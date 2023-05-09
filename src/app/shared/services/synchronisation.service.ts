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

/**
 * Offers functionality for synchronizing studying content. But this service is not necessarily responsible
 * for connecting to a specific data source like database, file system or GitHub.
 */
@Injectable({
  providedIn: 'root',
})
export class SynchronisationService {
  constructor(
    private exerciseService: ExerciseService,
    private labelService: LabelService,
    private assetService: AssetService,
    private assetAttributionService: AssetAttributionService,
    private db: DbService,
    private templateService: TemplateService
  ) {}

  public async clearModels() {
    await Promise.all([
      this.db.labels.clear(),
      this.db.labelImplications.clear(),
      this.db.assets.clear(),
      this.db.assetAttributions.clear(),
      this.db.exerciseLabels.clear(),
      this.db.exercises.clear(),
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
  public async generateTransitiveClosureForLabelImplications() {
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
    const conceptElements = Array.from(
      conceptDocumentElement.querySelectorAll('cw-set-concept')
    );
    await Promise.all(
      conceptElements.map((conceptElement) =>
        this.importSetConcept({
          setConceptElement: conceptElement,
          conceptDocument: conceptDocumentElement,
          conceptId: id,
        })
      )
    );
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
}
