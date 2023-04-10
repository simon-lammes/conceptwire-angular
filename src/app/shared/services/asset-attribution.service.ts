import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { AssetAttribution } from '../models/asset-attribution';

@Injectable({
  providedIn: 'root',
})
export class AssetAttributionService {
  constructor(private db: DbService) {}

  saveAssetAttribution(assetAttribution: AssetAttribution) {
    return this.db.assetAttributions.put(assetAttribution);
  }

  getAssetAttribution(assetId: string) {
    return this.db.assetAttributions.get(assetId);
  }
}
