import { Injectable } from '@angular/core';
import { StudySettings } from '../models/study-settings';
import { DbService } from './db.service';
import { liveQuery } from 'dexie';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudySettingsService {
  readonly defaultStudySettings: StudySettings = {
    id: 'my-study-settings',
    cooldownFormula: '180+300x+50x^2',
    immediatelyJumpToNextExerciseAfterGivingFeedback: false,
  };

  studySettings$: Observable<StudySettings> = from(
    liveQuery(() => this.db.studySettings.get('my-study-settings'))
  ).pipe(
    map((studySettings) => studySettings ?? this.defaultStudySettings)
  ) as Observable<StudySettings>;

  constructor(private db: DbService) {}

  put(value: StudySettings) {
    return this.db.studySettings.put(value, value.id);
  }
}
