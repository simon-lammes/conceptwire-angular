import { Injectable } from '@angular/core';
import { ExerciseService } from './exercise.service';
import { LabelService } from './label.service';
import { LabelImplication } from '../models/label-implication';
import * as _ from 'lodash-es';
import { AssetService } from './asset.service';
import { AssetAttribution } from '../models/asset-attribution';
import { AssetAttributionService } from './asset-attribution.service';
import { createAcyclicGraph, transitiveClosure } from 'simple-digraph';
import { DbService } from './db.service';
import { TemplateService } from './template.service';
import { QualityLabels } from '../models/quality-labels';
import { ExperienceService } from './experience.service';
import { Book } from '../models/book';

/**
 * It is just a container for data, and it's corresponding id.
 * This is handy for our study material because the data and the id are often separated.
 * For example, while the data might be part of a file's content, the id might be in the file's path.
 * This interface is just handy during the import of data where the data is just obtained from the data source,
 * and we have the id and the data, but it is not yet transformed into our final models like exercises and labels etc.
 * In simple terms, this is a very simple intermediate representation.
 */
export interface DataWithId<T> {
  id: string;
  content: T;
}

/**
 * Offers functionality for synchronizing studying content. But this service is not necessarily responsible
 * for connecting to a specific data source like database, file system or GitHub.
 */
@Injectable({
  providedIn: 'root',
})
export class SynchronizationService {
  constructor(
    private exerciseService: ExerciseService,
    private labelService: LabelService,
    private assetService: AssetService,
    private assetAttributionService: AssetAttributionService,
    private db: DbService,
    private templateService: TemplateService,
    private experienceService: ExperienceService
  ) {}

  public async clearModels() {
    await Promise.all([
      this.db.labels.clear(),
      this.db.labelImplications.clear(),
      this.db.assets.clear(),
      this.db.assetAttributions.clear(),
      this.db.exerciseLabels.clear(),
      this.db.exercises.clear(),
      this.db.books.clear(),
    ]);
  }

  /**
   * Imports a complete collection of learning content.
   *
   * This method takes care of importing content and doing so in the right order.
   * Obtaining the data from a given source like the file system or GitHub is
   * the caller's responsibility. I think this is a very nice separation of concerns
   * because we potentially want to implement further data sources. This way,
   * each new implementation for new data sources must only take care of
   * obtaining the data while this method takes care of the rest.
   *
   * While I am 100 percent confident in this separation of concerns, I
   * think there are some competing ways how the two actors (the data retriever aka. caller
   * and the importer aka. this method) interact or pass messages around.
   * This method uses what I call the in-memory strategy where the caller has
   * loaded the complete data set into memory and passes it as function parameters.
   * I think this approach works very fine so far but once the data set is so large
   * that it does not fit into memory anymore, we have to think about different approaches.
   * But of course, premature optimization is the root of all evil, so we should only
   * switch to a more sophisticated strategy once we really need it.
   * One common approach (for example quite common in NodeJS File System API) is streaming the data.
   * I initially tried something like this with RxJS observables, but it gets complex.
   * An idea for the future that might be easier could be to load data into IndexedDB as an "intermediate" location
   * and then "import" it from there.
   *
   * @param exercises
   * @param assets
   * @param assetAttributions
   * @param conceptDocuments
   * @param labels
   */
  public async importContentWithImMemoryStrategy({
    exercises,
    assets,
    assetAttributions,
    conceptDocuments,
    labels,
    books,
  }: {
    exercises: DataWithId<string>[];
    assets: DataWithId<Blob>[];
    assetAttributions: DataWithId<Partial<AssetAttribution>>[];
    conceptDocuments: DataWithId<string>[];
    labels: DataWithId<string>[];
    books: Book[];
  }) {
    await this.clearModels();
    const importBooks = this.db.books.bulkPut(books);
    const importLabels = Promise.all(
      labels.map(({ id, content }) => this.importLabel(content, id))
    );
    // The import of exercise only makes sense when labels are already imported.
    const importExercises = importLabels.then(() =>
      Promise.all(
        exercises.map(({ id, content }) => this.importExercise(content, id))
      )
    );
    // The import of concepts only makes sense when labels are already imported.
    const importConcepts = importLabels.then(() =>
      Promise.all(
        conceptDocuments.map(({ id, content }) =>
          this.importConceptDocument(content, id)
        )
      )
    );
    // Experiences can only be updated once exercises and concepts have been imported.
    const updateExperiencesTable = Promise.all([
      importExercises,
      importConcepts,
    ]).then(() => this.experienceService.updateExperiencesTable());
    const importAssetAttributions = Promise.all(
      assetAttributions.map(({ id, content }) =>
        this.importAssetAttribution({
          ...(content as AssetAttribution),
          assetId: id,
        })
      )
    );
    const importAssets = Promise.all(
      assets.map(({ id, content }) => this.importAsset(content, id))
    );
    // It might not be necessary, but for readability and explicitness I think it makes sense
    // to *explicitly* wait for all promises to finish.
    await Promise.all([
      importLabels,
      importExercises,
      importConcepts,
      updateExperiencesTable,
      importAssetAttributions,
      importAssets,
      importBooks,
    ]);
  }

  public async importExercise(exerciseContent: string, id: string) {
    const exerciseElement = this.createHtmlElement(exerciseContent);
    await this.exerciseService.saveExercise({
      id,
      content: exerciseContent,
      title: this.extractTitleFromHtmlElement(exerciseElement),
      labelIds: await this.extractLabelIdsOfExercise(exerciseElement),
      qualityLabels: await this.extractQualityLabelsOfExercise(exerciseElement),
    });
  }

  public async importLabel(labelContent: string, id: string) {
    const labelElement = this.createHtmlElement(labelContent);
    await this.labelService.saveLabel({
      id,
      title: this.extractTitleFromHtmlElement(labelElement)!,
      description:
        this.extractDescriptionFromHtmlElement(labelElement) ?? undefined,
      labelImplications: this.extractLabelImplications(id, labelElement),
      localImageId: this.extractLocalImageSrc(labelElement),
    });
  }

  public async importAsset(file: Blob, id: string) {
    return this.assetService.saveAsset({ id, blob: file });
  }

  public async importAssetAttribution(assetAttribution: AssetAttribution) {
    return this.assetAttributionService.saveAssetAttribution(assetAttribution);
  }

  /**
   * When A implicated B and B implicates C, then we can also say that A implicated C.
   * For our application to properly work, we should add all implication to the database.
   */
  private async generateTransitiveClosureForLabelImplications() {
    const labelIds = await this.db.labels
      .toArray()
      .then((x) => x.map((y) => y.id));
    const labelImplications = await this.db.labelImplications.toArray();
    const originalEdges: [number, number][] = labelImplications.map(
      (labelImplication) => [
        labelIds.indexOf(labelImplication.causingLabelId),
        labelIds.indexOf(labelImplication.implicatedLabelId),
      ]
    );
    const graph = createAcyclicGraph(originalEdges);
    const closure = transitiveClosure(graph);
    const neededAdditionalEdges = _.differenceWith(
      [...closure[1].values()],
      originalEdges,
      _.isEqual
    );
    const needAdditionalLabelImplications = neededAdditionalEdges.map(
      ([source, target]) =>
        ({
          causingLabelId: labelIds[source],
          implicatedLabelId: labelIds[target],
        } as LabelImplication)
    );
    await this.db.labelImplications.bulkPut(needAdditionalLabelImplications);
  }

  private createHtmlElement(content: string): HTMLElement {
    const el = document.createElement('div');
    el.innerHTML = content;
    return el;
  }

  private extractTitleFromHtmlElement(element: HTMLElement) {
    const titleElement = element.querySelector('title');
    return titleElement?.text;
  }

  private extractDescriptionFromHtmlElement(element: HTMLElement) {
    const descriptionElement = element.querySelector('meta[name=description]');
    return descriptionElement?.getAttribute('content');
  }

  private extractLabelImplications(
    sourceLabelId: string,
    labelElement: HTMLElement
  ) {
    const labelImplicationElements = Array.from(
      labelElement.querySelectorAll('cw-label-implication')
    );
    return labelImplicationElements.map(
      (labelImplicationElement) =>
        ({
          implicatedLabelId: labelImplicationElement.getAttribute(
            'cw-implicated-label-id'
          ),
          causingLabelId: sourceLabelId,
        } as LabelImplication)
    );
  }

  private extractLabelIdsOfExercise(exerciseElement: HTMLElement) {
    const directLabelIdsElement = exerciseElement.querySelector(
      'meta[name=direct-label-ids]'
    );
    const directLabelIds =
      directLabelIdsElement
        ?.getAttribute('content')
        ?.split(',')
        .map((x) => x.trim()) ?? [];
    return this.labelService.getAllTransitiveLabelIdsByBreathFirstSearch(
      directLabelIds
    );
  }

  private extractLocalImageSrc(labelElement: HTMLElement) {
    const imageMetaTag = labelElement.querySelector('meta[name="cw:image"]');
    if (!imageMetaTag) return undefined;
    return imageMetaTag.getAttribute('content') ?? undefined;
  }

  public async importConceptDocument(conceptContent: string, id: string) {
    const conceptDocumentElement = this.createHtmlElement(conceptContent);
    const setConceptElements = Array.from(
      conceptDocumentElement.querySelectorAll('cw-set-concept')
    );
    const keymapConceptElements = Array.from(
      conceptDocumentElement.querySelectorAll('cw-keymap-concept')
    );
    await Promise.all([
      ...setConceptElements.map((conceptElement) =>
        this.importSetConcept({
          setConceptElement: conceptElement,
          conceptDocument: conceptDocumentElement,
          conceptId: id,
        })
      ),
      ...keymapConceptElements.map((conceptElement) =>
        this.importKeymapConcept({
          keymapConceptElement: conceptElement,
          conceptDocument: conceptDocumentElement,
          conceptId: id,
        })
      ),
    ]);
  }

  private async importSetConcept({
    setConceptElement,
    conceptDocument,
    conceptId,
  }: {
    setConceptElement: Element;
    conceptDocument: Element;
    conceptId: string;
  }) {
    const setElements = Array.from(
      setConceptElement.querySelectorAll('cw-element')
    );
    const setElementsThatCanBeUsedForFindMissingElementExercises =
      setElements.filter((x) =>
        x.getAttribute('cw-find-missing-element-exercise-id')
      );
    for (const missingElement of setElementsThatCanBeUsedForFindMissingElementExercises) {
      const existingElements = setElements.filter((x) => x !== missingElement);
      const exercise =
        await this.templateService.createFindMissingElementExercise({
          concept: {
            id: conceptId,
            title: conceptDocument.querySelector('title')?.innerText ?? '',
            setDescription:
              conceptDocument.querySelector(
                'cw-set-concept > *[slot=description]'
              )?.innerHTML ?? '',
            directLabelIds:
              conceptDocument
                .querySelector('meta[name=direct-label-ids]')
                ?.getAttribute('content') ?? '',
          },
          existingElements: existingElements.map((existingElement) => ({
            rawContent: existingElement.outerHTML,
          })),
          missingElement: {
            rawContent: missingElement.outerHTML,
            title: missingElement.getAttribute('cw-title') ?? '',
          },
        });
      const exerciseId = missingElement.getAttribute(
        'cw-find-missing-element-exercise-id'
      );
      if (!exerciseId) throw Error('Missing Exercise Id');
      await this.importExercise(exercise, exerciseId);
    }
  }

  private extractQualityLabelsOfExercise(
    exerciseElement: HTMLElement
  ): QualityLabels[] {
    const qualityLabelsMetaElement = exerciseElement.querySelector(
      'meta[name=quality-labels]'
    );
    if (!qualityLabelsMetaElement) return [];
    const qualityLabelsString =
      qualityLabelsMetaElement.getAttribute('content');
    if (!qualityLabelsString) return [];
    return qualityLabelsString
      .split(';')
      .map((x) => x.trim()) as QualityLabels[];
  }

  private async importKeymapConcept({
    keymapConceptElement,
    conceptDocument,
    conceptId,
  }: {
    keymapConceptElement: Element;
    conceptDocument: Element;
    conceptId: string;
  }) {
    const commandElements = Array.from(
      keymapConceptElement.querySelectorAll('cw-keymap-command')
    );
    await Promise.all([
      commandElements.map(async (commandElement) => {
        const exerciseContent =
          await this.templateService.createKeymapCommandExercise({
            concept: {
              id: conceptId,
              directLabelIds:
                conceptDocument
                  .querySelector('meta[name=direct-label-ids]')
                  ?.getAttribute('content') ?? '',
              title: conceptDocument.querySelector('title')?.innerText ?? '',
            },
            command: {
              title: commandElement.getAttribute('title') ?? '',
              key: commandElement.getAttribute('mac-key') ?? '',
              operatingSystem: 'mac',
            },
          });
        const exerciseId = commandElement.getAttribute('mac-exercise-id');
        if (!exerciseId) {
          throw new Error(`Concept ${conceptId} has exercise without id`);
        }
        await this.importExercise(exerciseContent, exerciseId);
      }),
    ]);
  }
}
