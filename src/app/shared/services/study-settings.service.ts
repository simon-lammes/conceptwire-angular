import { Injectable } from '@angular/core';
import { StudySettings } from '../models/study-settings';
import { DbService } from './db.service';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudySettingsService {
  studySettings$ = from(
    liveQuery(() => this.db.studySettings.get('my-study-settings'))
  );

  constructor(private db: DbService) {}

  put(value: StudySettings) {
    return this.db.studySettings.put(value, value.id);
  }
}
