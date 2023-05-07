import { Injectable } from '@angular/core';
import { SynchronisationService } from './synchronisation.service';
import * as _ from 'lodash-es';
import { AssetAttribution } from '../models/asset-attribution';
import { TemplateService } from './template.service';
import { ExperienceService } from './experience.service';

@Injectable({
  providedIn: 'root',
})
export class FileSystemSynchronisationService {
  private directoryHandle?: FileSystemDirectoryHandle;
  constructor(
    private synchronisationService: SynchronisationService,
    private templateService: TemplateService,
    private experienceService: ExperienceService
  ) {}

  async uploadContent() {
    await this.getExistingOrNewDirectoryHandle();
    const labelsDirectoryHandle =
      await this.directoryHandle!.getDirectoryHandle('labels', {
        create: false,
      });
    await this.synchronisationService.clearModels();
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
      await this.experienceService.updateExperiencesTable();
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

  async createLabel() {
    const directoryHandle = await this.getExistingOrNewDirectoryHandle();
    const labelsDirectoryHandle = await directoryHandle!.getDirectoryHandle(
      'labels',
      {
        create: false,
      }
    );
    const labelId = self.crypto.randomUUID();
    const fileHandle = (await labelsDirectoryHandle.getFileHandle(
      `${labelId}.html`,
      { create: true }
    )) as any;
    const writable = await fileHandle.createWritable();
    const labelContent = await this.templateService.createNewLabel({ labelId });
    await writable.write(labelContent);
    await writable.close();
    await this.synchronisationService.importLabel(labelContent, labelId);
    return labelId;
  }

  async createExercise({
    initialExerciseContent,
  }: { initialExerciseContent?: string } = {}) {
    const directoryHandle = await this.getExistingOrNewDirectoryHandle();
    const exercisesDirectoryHandle = await directoryHandle!.getDirectoryHandle(
      'exercises',
      {
        create: false,
      }
    );
    const exerciseId = self.crypto.randomUUID();
    const fileHandle = (await exercisesDirectoryHandle.getFileHandle(
      `${exerciseId}.html`,
      { create: true }
    )) as any;
    const writable = await fileHandle.createWritable();
    const exerciseContent = initialExerciseContent
      ? initialExerciseContent
      : await this.templateService.createNewExercise({
          exerciseId,
        });
    await writable.write(exerciseContent);
    await writable.close();
    await this.synchronisationService.importExercise(
      exerciseContent,
      exerciseId
    );
    return exerciseId;
  }

  private async getExistingOrNewDirectoryHandle() {
    if (!this.directoryHandle) {
      // @ts-ignore
      this.directoryHandle = await showDirectoryPicker({
        mode: 'readwrite',
      });
    }
    return this.directoryHandle;
  }
}
