import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Exercise } from '../models/exercise';
import { Experience } from '../models/experience';
import { Label } from '../models/label';
import { LabelImplication } from '../models/label-implication';
import { ExerciseLabel } from '../models/exercise-label';
import { StudySettings, StudySettingsId } from '../models/study-settings';
import { Asset } from '../models/asset';
import { AssetAttribution } from '../models/asset-attribution';

@Injectable({
  providedIn: 'root',
})
export class DbService extends Dexie {
  exercises!: Table<Exercise, string>;
  experiences!: Table<Experience, string>;
  labels!: Table<Label, string>;
  labelImplications!: Table<LabelImplication, string>;
  exerciseLabels!: Table<ExerciseLabel, string>;
  studySettings!: Table<StudySettings, StudySettingsId>;
  assets!: Table<Asset, string>;
  assetAttributions!: Table<AssetAttribution, string>;

  constructor() {
    super('conceptwire_db');
    this.version(13).stores({
      exercises: 'id',
      experiences: 'exerciseId,*indexesForLabelStreakAndLastSeen',
      labels: 'id,&title',
      labelImplications: '[causingLabelId+implicatedLabelId],implicatedLabelId',
      exerciseLabels: '[exerciseId+labelId],labelId',
      studySettings: 'id',
      assets: 'id',
      assetAttributions: 'assetId',
    });
  }

  clearAllTables() {
    return Promise.all(this.tables.map((x) => x.clear()));
  }
}
