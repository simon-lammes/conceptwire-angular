import { Injectable } from '@angular/core';
import { DataWithId, SynchronizationService } from './synchronization.service';
import * as _ from 'lodash-es';
import { TemplateService } from './template.service';
import { ExperienceService } from './experience.service';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class FileSystemSynchronisationService {
  private directoryHandle?: FileSystemDirectoryHandle;
  constructor(
    private synchronisationService: SynchronizationService,
    private templateService: TemplateService,
    private experienceService: ExperienceService
  ) {}

  async uploadContent() {
    const rootDirectoryHandle = await this.getExistingOrNewDirectoryHandle();
    if (!rootDirectoryHandle) return;
    const labelsPromise = this.loadFromFileSystem({
      rootDirectoryHandle,
      path: 'labels',
      fileExtensions: ['html'],
      dataExtractor: (file) => file.text(),
    });
    const assetsPromise = this.loadFromFileSystem({
      rootDirectoryHandle,
      path: 'assets',
      fileExtensions: ['svg', 'png', 'jpg'],
      dataExtractor: (file) => file,
    });
    const assetAttributionsPromise = this.loadFromFileSystem({
      rootDirectoryHandle,
      path: 'asset-attributions',
      fileExtensions: ['json'],
      dataExtractor: async (file) => JSON.parse(await file.text()),
    });
    const conceptDocumentsPromise = this.loadFromFileSystem({
      rootDirectoryHandle,
      path: 'concepts',
      fileExtensions: ['html'],
      dataExtractor: (file) => file.text(),
    });
    const exercisesPromise = this.loadFromFileSystem({
      rootDirectoryHandle,
      path: 'exercises',
      fileExtensions: ['html'],
      dataExtractor: (file) => file.text(),
    });
    const booksPromise = this.loadFromFileSystem({
      rootDirectoryHandle,
      path: 'books',
      fileExtensions: ['json'],
      dataExtractor: (file) => file.text().then((x) => JSON.parse(x)),
    }).then((x) => x.map((y) => y.content as Book));
    const [
      labels,
      assets,
      assetAttributions,
      conceptDocuments,
      exercises,
      books,
    ] = await Promise.all([
      labelsPromise,
      assetsPromise,
      assetAttributionsPromise,
      conceptDocumentsPromise,
      exercisesPromise,
      booksPromise,
    ]);
    await this.synchronisationService.importContentWithImMemoryStrategy({
      assets,
      assetAttributions,
      exercises,
      labels,
      conceptDocuments,
      books,
    });
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

  private async loadFromFileSystem<T>({
    rootDirectoryHandle,
    path,
    fileExtensions,
    dataExtractor,
  }: {
    rootDirectoryHandle: FileSystemDirectoryHandle;
    path: string;
    fileExtensions: string[];
    dataExtractor: (file: File) => T | Promise<T>;
  }): Promise<DataWithId<T>[]> {
    const directoryHandle = await rootDirectoryHandle!.getDirectoryHandle(
      path,
      {
        create: false,
      }
    );

    const dataPoints: DataWithId<T>[] = [];

    // @ts-ignore
    for await (const [key, value] of directoryHandle.entries()) {
      const fileExtension = _.last((key as string).split('.'));
      if (!fileExtension || !fileExtensions.includes(fileExtension)) continue;
      const id = _.first((key as string).split('.'));
      if (!id) continue;
      const file = (await value.getFile()) as File;
      const content: T = await dataExtractor(file);
      dataPoints.push({ id, content });
    }
    return dataPoints;
  }
}
