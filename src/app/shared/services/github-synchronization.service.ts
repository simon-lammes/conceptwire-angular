import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Octokit } from '@octokit/rest';
import { DataWithId, SynchronizationService } from './synchronization.service';
import { AssetAttribution } from '../models/asset-attribution';

interface FilePreview {
  url: string;
  name: string;
  download_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubSynchronizationService {
  readonly octokit = new Octokit();

  constructor(private synchronisationService: SynchronizationService) {}

  async importContent(repo: { owner: string; repo: string; ref: string }) {
    const labelsPromise = this.loadFiles({
      path: 'labels',
      source: repo,
      responseParser: (response) => response.text(),
    });
    const conceptDocumentsPromise = this.loadFiles({
      path: 'concepts',
      source: repo,
      responseParser: (response) => response.text(),
    });
    const exercisesPromise = this.loadFiles({
      path: 'exercises',
      source: repo,
      responseParser: (response) => response.text(),
    });
    const assetsPromise = this.loadFiles({
      path: 'assets',
      source: repo,
      responseParser: (response) => response.blob(),
    });
    const assetAttributionsPromise = this.loadFiles({
      path: 'asset-attributions',
      source: repo,
      responseParser: async (response) =>
        ({
          ...JSON.parse(await response.text()),
        } as AssetAttribution),
    });

    const [labels, conceptDocuments, exercises, assets, assetAttributions] =
      await Promise.all([
        labelsPromise,
        conceptDocumentsPromise,
        exercisesPromise,
        assetsPromise,
        assetAttributionsPromise,
      ]);
    await this.synchronisationService.importContentWithImMemoryStrategy({
      labels,
      conceptDocuments,
      exercises,
      assets,
      assetAttributions,
    });
  }

  private loadFiles<T>({
    source,
    path,
    responseParser,
  }: {
    path: string;
    source: { owner: string; repo: string; ref: string };
    responseParser: (response: Response) => Promise<T>;
  }): Promise<DataWithId<T>[]> {
    return this.octokit.rest.repos
      .getContent({
        ...source,
        // @ts-ignore
        path: path,
      })
      .then((response) => response.data as FilePreview[])
      .then((filePreviews) =>
        Promise.all(
          filePreviews.map(async (filePreview) => {
            const id = _.first(filePreview.name.split('.'))!;
            const content: T = await fetch(filePreview.download_url).then((x) =>
              responseParser(x)
            );
            return { id, content };
          })
        )
      );
  }
}
