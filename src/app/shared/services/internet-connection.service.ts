import { inject, Injectable } from '@angular/core';
import { StudySettingsService } from './study-settings.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InternetConnectionService {
  readonly studySettingsService = inject(StudySettingsService);

  readonly hasInternetConnection$ =
    this.studySettingsService.studySettings$.pipe(
      map(({ internetConnectionEvaluationStrategy }) => {
        switch (internetConnectionEvaluationStrategy) {
          case 'considerInternetUnavailable':
            return false;
          case 'considerInternetAvailable':
            return true;
          case 'considerInternetAvailableWhenUsingWlan':
            // @ts-ignore
            return navigator.connection?.effectiveType === '4g';
          default:
            return true;
        }
      })
    );
}
