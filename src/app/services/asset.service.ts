import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Asset } from '../models/asset';
import { from, Observable } from 'rxjs';
import { liveQuery } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  assets$: Observable<Asset[]> = from(
    liveQuery(() => this.db.assets.toArray()),
  );

  constructor(private db: DbService) {}

  getAsset(src: string) {
    return this.db.assets.get(src);
  }

  saveAsset(asset: Asset) {
    this.db.assets.put(asset, asset.id);
  }
}
