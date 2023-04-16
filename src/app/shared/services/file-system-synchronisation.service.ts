import { Injectable } from '@angular/core';
import { SynchronisationService } from './synchronisation.service';
import * as _ from 'lodash-es';
import { AssetAttribution } from '../models/asset-attribution';

@Injectable({
  providedIn: 'root',
})
export class FileSystemSynchronisationService {
  private directoryHandle?: FileSystemDirectoryHandle;
  constructor(private synchronisationService: SynchronisationService) {}

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
      await this.synchronisationService.importLabel(labelContent, id);
    }
    await this.synchronisationService.generateTransitiveClosureForLabelImplications();
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
      await this.synchronisationService.importAsset(file, id);
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
      await this.synchronisationService.importAssetAttribution(
        assetAttribution
      );
    }

    const conceptsDirectoryHandle =
      await this.directoryHandle!.getDirectoryHandle('concepts', {
        create: false,
      });
    // @ts-ignore
    for await (const [key, value] of conceptsDirectoryHandle.entries()) {
      if (!(key as string).endsWith('.html')) continue;
      const id = (key as string).slice(0, (key as string).length - 5);
      const file = (await value.getFile()) as File;
      const conceptContent = await file.text();
      await this.synchronisationService.importConceptDocument(
        conceptContent,
        id
      );
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
      await this.synchronisationService.importExercise(exerciseContent, id);
    }
  }
}