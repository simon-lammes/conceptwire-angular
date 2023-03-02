import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { from, Observable } from 'rxjs';
import { liveQuery } from 'dexie';
import {
  Experience,
  IndexForLabelStreakAndLastSeen,
} from '../models/experience';
import { ExerciseResult } from '../models/exerciseResult';
import { sub } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  constructor(private db: DbService) {}

  updateExperiencesTable() {
    this.db.transaction(
      'rw',
      [this.db.experiences, this.db.exercises, this.db.exerciseLabels],
      () => {
        this.db.exercises.each(async (exercise) => {
          const [experience, exerciseLabels] = await Promise.all([
            this.db.experiences.get(exercise.id),
            this.db.exerciseLabels
              .where('exerciseId')
              .equals(exercise.id)
              .toArray(),
          ]);
          const streak = experience?.streak ?? 0;
          const lastSeen = experience?.lastSeen ?? new Date(0);
          await this.db.experiences.put({
            exerciseId: exercise.id,
            streak,
            lastSeen,
            indexesForLabelStreakAndLastSeen: exerciseLabels.map(
              (exerciseLabel) =>
                <IndexForLabelStreakAndLastSeen>[
                  exerciseLabel.labelId,
                  streak,
                  lastSeen,
                ]
            ),
          });
        });
      }
    );
  }

  getExperienceStreamForStudying({
    labelId,
  }: {
    labelId: string;
  }): Observable<Experience | undefined> {
    return from(
      liveQuery(() =>
        this.db.experiences
          .where('indexesForLabelStreakAndLastSeen')
          // We basically want to look at all experiences with the given label.
          // The nature of the index already guarantees that they are ordered by streak and last seen - just as we like it.
          // Inspired by: https://github.com/dexie/Dexie.js/issues/368
          .between([labelId, -Infinity], [labelId, Infinity], true, true)
          .filter((x) => x.lastSeen < sub(new Date(), { seconds: 10 }))
          .first()
      )
    );
  }

  async onExerciseResult(exerciseResult: ExerciseResult) {
    const experience = exerciseResult.exerciseSituation.experience;
    if (!experience) {
      throw Error('not yet implemented');
    }
    const streak =
      exerciseResult.feedback === 'success' ? experience.streak + 1 : 0;
    const lastSeen = new Date();
    const updatedExperience: Experience = {
      ...experience,
      streak,
      lastSeen,
      indexesForLabelStreakAndLastSeen:
        experience.indexesForLabelStreakAndLastSeen?.map((index) => [
          index[0],
          updatedExperience.streak,
          updatedExperience.lastSeen,
        ]),
    };
    this.db.experiences.put(updatedExperience);
  }
}
