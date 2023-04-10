import { Injectable } from '@angular/core';
import { ExerciseService } from './exercise.service';
import { LabelService } from './label.service';
import { LabelImplication } from '../models/label-implication';
import * as _ from 'lodash-es';
import { AssetService } from './asset.service';
import { AssetAttribution } from '../models/asset-attribution';
import { AssetAttributionService } from './asset-attribution.service';

@Injectable({
  providedIn: 'root',
})
export class SynchronisationService {
  private directoryHandle?: FileSystemDirectoryHandle;

  constructor(
    private exerciseService: ExerciseService,
    private labelService: LabelService,
    private assetService: AssetService,
    private assetAttributionService: AssetAttributionService
  ) {}

  async uploadContent() {
    if (!this.directoryHandle) {
      // @ts-ignore
      this.directoryHandle = await showDirectoryPicker({
        mode: 'readwrite',
      });
    }
    const labelsDirectoryHandle =
      await this.directoryHandle!.getDirectoryHandle('labels', {
        create: false,
      });
    // @ts-ignore
    for await (const [key, value] of labelsDirectoryHandle.entries()) {
      if (!(key as string).endsWith('.html')) continue;
      const id = (key as string).slice(0, (key as string).length - 5);
      const file = (await value.getFile()) as File;
      const labelContent = await file.text();
      await this.importLabel(labelContent, id);
    }
    const assetsDirectoryHandle =
      await this.directoryHandle!.getDirectoryHandle('assets', {
        create: false,
      });
    // @ts-ignore
    for await (const [key, value] of assetsDirectoryHandle.entries()) {
      const fileExtension = _.last((key as string).split('.'));
      if (!fileExtension || !['svg', 'png', 'jpg'].includes(fileExtension))
        continue;
      const id = _.first((key as string).split('.'));
      if (!id) return;
      const file = (await value.getFile()) as File;
      await this.importAsset(file, id);
    }

    const assetsAttributionsDirectoryHandle =
      await this.directoryHandle!.getDirectoryHandle('asset-attributions', {
        create: false,
      });
    for await (const [
      key,
      value,
      // @ts-ignore
    ] of assetsAttributionsDirectoryHandle.entries()) {
      const fileExtension = _.last((key as string).split('.'));
      if (!fileExtension || fileExtension !== 'json') continue;
      const id = _.first((key as string).split('.'));
      if (!id) return;
      const file = (await value.getFile()) as File;
      const assetAttribution = {
        assetId: id,
        ...JSON.parse(await file.text()),
      } as AssetAttribution;
      await this.importAssetAttribution(assetAttribution);
    }

    const exercisesDirectoryHandle =
      await this.directoryHandle!.getDirectoryHandle('exercises', {
        create: false,
      });
    // @ts-ignore
    for await (const [key, value] of exercisesDirectoryHandle.entries()) {
      if (!(key as string).endsWith('.html')) continue;
      const id = (key as string).slice(0, (key as string).length - 5);
      const file = (await value.getFile()) as File;
      const exerciseContent = await file.text();
      await this.importExercise(exerciseContent, id);
    }
  }

  public async importExercise(exerciseContent: string, id: string) {
    const exerciseElement = this.createHtmlElement(exerciseContent);
    await this.exerciseService.saveExercise({
      id,
      content: exerciseContent,
      title: this.extractTitleFromHtmlElement(exerciseElement),
      labelIds: await this.extractLabelIdsOfExercise(exerciseElement),
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
}
