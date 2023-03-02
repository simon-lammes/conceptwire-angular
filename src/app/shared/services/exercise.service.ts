import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { from, Observable, of, switchMap } from 'rxjs';
import { liveQuery } from 'dexie';
import { ExerciseLabel } from '../models/exercise-label';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private db: DbService) {}

  searchExercises({
    query,
    labelId,
  }: {
    query?: string | null;
    labelId?: string | null;
  }) {
    const exerciseLabels$: Observable<ExerciseLabel[] | undefined> = labelId
      ? from(
          liveQuery(() =>
            this.db.exerciseLabels.where('labelId').equals(labelId).toArray()
          )
        )
      : of(undefined);
    return exerciseLabels$.pipe(
      switchMap((exerciseLabels) =>
        liveQuery(() => {
          const collectionFilteredByLabel = exerciseLabels
            ? this.db.exercises
                .where('id')
                .anyOf(exerciseLabels.map((x) => x.exerciseId))
            : this.db.exercises.toCollection();
          const lowerCaseQuery = query?.toLowerCase();
          return lowerCaseQuery
            ? collectionFilteredByLabel
                .filter((exercise) =>
                  `${exercise.question} ${exercise.answer}`
                    .toLowerCase()
                    .includes(lowerCaseQuery)
                )
                .toArray()
            : collectionFilteredByLabel.toArray();
        })
      )
    );
  }

  async saveExercise({
    id,
    question,
    answer,
    labelIds,
  }: {
    id?: string;
    question: string;
    answer: string;
    labelIds?: string[] | null;
  }) {
    await this.db.transaction(
      'rw',
      [this.db.exercises, this.db.exerciseLabels],
      async () => {
        const exerciseId = await this.db.exercises.put({
          id: id ?? self.crypto.randomUUID(),
          question,
          answer,
        });
        if (labelIds) {
          await this.db.exerciseLabels.bulkPut(
            labelIds.map((labelId) => ({ exerciseId, labelId }))
          );
        }
      }
    );
  }

  getExerciseById(exerciseId?: string) {
    if (!exerciseId) {
      return of(undefined);
    }
    return from(liveQuery(() => this.db.exercises.get(exerciseId)));
  }
}
