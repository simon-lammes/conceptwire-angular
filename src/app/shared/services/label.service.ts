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
    labelImplications,
    localImageId,
  }: {
    id?: string;
    title: string;
    description?: string;
    labelImplications?: LabelImplication[];
    localImageId?: string;
  }) {
    await this.db.transaction(
      'rw',
      [this.db.labels, this.db.labelImplications],
      async () => {
        await this.db.labels.put({
          id: id ?? self.crypto.randomUUID(),
          title,
          description,
          localImageId,
        });
        if (labelImplications?.length) {
          await this.db.labelImplications.bulkPut(labelImplications);
        }
      }
    );
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

  async getAllTransitiveLabelIdsByBreathFirstSearch(initialLabelIds: string[]) {
    const breathFirstSearchQueueOfLabelIds: string[] = initialLabelIds;
    const visitedLabelIds: string[] = [];
    while (breathFirstSearchQueueOfLabelIds.length) {
      const currentLabelId = breathFirstSearchQueueOfLabelIds.pop()!;
      if (visitedLabelIds.includes(currentLabelId)) continue;
      const implicatedLabelIds = await this.getImplicatedParentLabels(
        currentLabelId
      ).then((x) => x.map((y) => y.implicatedLabelId));
      breathFirstSearchQueueOfLabelIds.push(...implicatedLabelIds);
      visitedLabelIds.push(currentLabelId);
    }
    return visitedLabelIds;
  }

  /**
   * Gets all parent labels which we also call implicated labels.
   *
   * I think both parent and implicated are suitable terms: One is more widely accepted
   * while the other more clearly shows what it means mathematically in our context:
   * If an exercise has a sub label, it implicitly also has all the parent labels.
   * It is a transitive relationship.
   *
   * @param currentLabelId
   * @private
   */
  private async getImplicatedParentLabels(currentLabelId: string) {
    return this.db.labelImplications
      .where('causingLabelId')
      .equals(currentLabelId)
      .toArray();
  }
}
