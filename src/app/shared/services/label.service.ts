import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Label } from '../models/label';
import { liveQuery } from 'dexie';
import { LabelImplication } from '../models/label-implication';
import { Exercise } from '../models/exercise';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  labels$: Observable<Label[]>;
  constructor(private db: DbService) {
    this.labels$ = from(liveQuery(() => this.db.labels.toArray()));
  }

  async saveLabel({
    id,
    title,
    description,
    implicatedLabels,
  }: {
    id?: string;
    title: string;
    description?: string;
    implicatedLabels?: Label[];
  }) {
    await this.db.transaction(
      'rw',
      [this.db.labels, this.db.labelImplications],
      async () => {
        const labelId = await this.db.labels.put({
          id: id ?? self.crypto.randomUUID(),
          title,
          description,
        });
        if (implicatedLabels?.length) {
          await this.db.labelImplications.bulkPut(
            implicatedLabels.map(
              (implicatedLabel) =>
                <LabelImplication>{
                  implicatedLabelId: implicatedLabel.id,
                  causingLabelId: labelId,
                }
            )
          );
        }
      }
    );
    this.db.labels.put({
      id: id ?? self.crypto.randomUUID(),
      title,
      description,
    });
  }

  searchLabels(query: string) {
    return this.labels$.pipe(
      map((labels) => labels.filter((x) => x.title.includes(query)))
    );
  }

  getLabelByTitle(title: string) {
    return this.db.labels.where('title').equals(title).first();
  }

  getLabelById(labelId: string) {
    if (!labelId) return of(undefined);
    return from(liveQuery(() => this.db.labels.get(labelId)));
  }

  getChildLabels(labelId: string) {
    return from(
      liveQuery(() =>
        this.db.labelImplications
          .where('implicatedLabelId')
          .equals(labelId)
          .toArray()
      )
    ).pipe(
      switchMap((labelImplications) =>
        liveQuery(() =>
          this.db.labels.bulkGet(labelImplications.map((x) => x.causingLabelId))
        )
      ),
      map((labels) => labels.filter((x) => !!x) as Array<Label>)
    );
  }

  getLabelsOfExercise(exercise?: Exercise): Observable<Label[] | undefined> {
    if (!exercise) return of(undefined);
    return from(
      liveQuery(() =>
        this.db.exerciseLabels.where('exerciseId').equals(exercise.id).toArray()
      )
    ).pipe(
      switchMap((exerciseLabels) =>
        this.db.labels.bulkGet(exerciseLabels.map((x) => x.labelId))
      ),
      map((labels) => labels.filter((x) => !!x) as Array<Label>)
    );
  }
}
