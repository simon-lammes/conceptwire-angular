import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Octokit } from 'octokit';
import { SynchronisationService } from './synchronisation.service';
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

  constructor(private synchronisationService: SynchronisationService) {}

  async importContent(props: { owner: string; repo: string; ref: string }) {
    const labels = (await this.octokit.rest.repos
      .getContent({
        ...props,
        // @ts-ignore
        path: 'labels',
      })
      .then((response) => response.data)) as FilePreview[];
    for await (const label of labels) {
      if (!label.name.endsWith('.html')) continue;
      const id = label.name.slice(0, label.name.length - 5);
      const labelContent = await fetch(label.download_url).then((x) =>
        x.text()
      );
      await this.synchronisationService.importLabel(labelContent, id);
    }
    const exercises = (await this.octokit.rest.repos
      .getContent({
        ...props,
        // @ts-ignore
        path: 'exercises',
      })
      .then((response) => response.data)) as FilePreview[];
    // @ts-ignore
    for await (const exercise of exercises) {
      if (!exercise.name.endsWith('.html')) continue;
      const id = exercise.name.slice(0, exercise.name.length - 5);
      const exerciseContent = await fetch(exercise.download_url).then((x) =>
        x.text()
      );
      await this.synchronisationService.importExercise(exerciseContent, id);
    }
    const assets = (await this.octokit.rest.repos
      .getContent({
        ...props,
        // @ts-ignore
        path: 'assets',
      })
      .then((response) => response.data)) as FilePreview[];
    // @ts-ignore
    for await (const asset of assets) {
      const fileExtension = _.last(asset.name.split('.'));
      if (!fileExtension || !['svg', 'png', 'jpeg'].includes(fileExtension))
        continue;
      const id = _.first(asset.name.split('.'));
      if (!id) continue;
      const assetBlob = await fetch(asset.download_url).then((x) => x.blob());
      await this.synchronisationService.importAsset(assetBlob, id);
    }
    const assetAttributions = (await this.octokit.rest.repos
      .getContent({
        ...props,
        // @ts-ignore
        path: 'asset-attributions',
      })
      .then((response) => response.data)) as FilePreview[];
    // @ts-ignore
    for await (const assetAttributionFilePreview of assetAttributions) {
      const fileExtension = _.last(assetAttributionFilePreview.name.split('.'));
      if (!fileExtension || fileExtension !== 'json') continue;
      const id = _.first(assetAttributionFilePreview.name.split('.'));
      if (!id) continue;
      const assetAttribution: AssetAttribution = {
        assetId: id,
        ...JSON.parse(
          await fetch(assetAttributionFilePreview.download_url).then((x) =>
            x.text()
          )
        ),
      };
      await this.synchronisationService.importAssetAttribution(
        assetAttribution
      );
    }
  }
}
