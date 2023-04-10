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
                  exercise.content.toLowerCase().includes(lowerCaseQuery)
                )
                .toArray()
            : collectionFilteredByLabel.toArray();
        })
      )
    );
  }

  async saveExercise({
    id,
    content,
    labelIds,
    title,
  }: {
    id?: string;
    content: string;
    labelIds?: string[] | null;
    title?: string;
  }) {
    await this.db.transaction(
      'rw',
      [this.db.exercises, this.db.exerciseLabels],
      async () => {
        const exerciseId = await this.db.exercises.put({
          id: id ?? self.crypto.randomUUID(),
          content,
          title,
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
