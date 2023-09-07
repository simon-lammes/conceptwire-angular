import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter, map, startWith } from 'rxjs';
import { shareSingleton } from '../helpers/rxjs/share-singleton';

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  readonly isUpdateAvailable$ = this.swUpdate.versionUpdates.pipe(
    filter((event) => event.type === 'VERSION_READY'),
    map(() => true),
    startWith(false),
    shareSingleton(),
  );

  constructor(private swUpdate: SwUpdate) {}

  public checkForUpdate() {
    return this.swUpdate.checkForUpdate();
  }

  public activateUpdate() {
    location.reload();
  }
}
