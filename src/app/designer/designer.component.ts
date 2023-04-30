import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import '../shared/custom-elements/shoelace-context.element';
import { LabelService } from '../shared/services/label.service';
import { ExerciseService } from '../shared/services/exercise.service';
import {
  BehaviorSubject,
  debounceTime,
  firstValueFrom,
  map,
  Observable,
  of,
  scan,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Exercise } from '../shared/models/exercise';
import { Label } from '../shared/models/label';
import { ExercisePreviewComponent } from '../shared/components/exercise-preview/exercise-preview.component';
import { LabelComponent } from '../shared/components/label/label.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { LabelPreviewComponent } from '../shared/components/label-preview/label-preview.component';
import { FileSystemSynchronisationService } from '../shared/services/file-system-synchronisation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileButtonComponent } from './file-button/file-button.component';

interface Selection {
  labelId?: string;
  exerciseId?: string;
}

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ExercisePreviewComponent,
    LabelComponent,
    ToolbarComponent,
    LabelPreviewComponent,
    FileButtonComponent,
  ],
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.sass'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignerComponent {
  readonly searchValue$ = new BehaviorSubject('');
  debouncedSearchValue$ = this.searchValue$.pipe(
    debounceTime(50),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  readonly labels$ = this.debouncedSearchValue$.pipe(
    switchMap((query) => this.labelService.searchLabels(query))
  );
  readonly exercises$: Observable<Exercise[]> = this.debouncedSearchValue$.pipe(
    switchMap((query) => this.exerciseService.searchExercises({ query }))
  );
  readonly selection$ = new BehaviorSubject<Selection | undefined>(undefined);
  recentSelections$ = this.selection$.pipe(
    scan((recentSelections, currentSelection) => {
      if (!currentSelection) return recentSelections;
      const isAlreadyIncluded =
        (currentSelection.exerciseId &&
          recentSelections.some(
            (x) => x.exerciseId === currentSelection.exerciseId
          )) ||
        (currentSelection.labelId &&
          recentSelections.some((x) => x.labelId === currentSelection.labelId));
      if (isAlreadyIncluded) return recentSelections;
      return [currentSelection, ...recentSelections];
    }, [] as Selection[])
  );
  readonly labelsOfSelectedExercise$ = this.selection$.pipe(
    switchMap((selection) => {
      if (!selection?.exerciseId) of(undefined);
      return this.labelService.getLabelsOfExercise(selection?.exerciseId);
    })
  );
  readonly subLabelsOfSelectedLabel$ = this.selection$.pipe(
    switchMap((selection) => {
      const labelId = selection?.labelId;
      if (!labelId) return of(undefined);
      return this.labelService.getChildLabels(labelId);
    })
  );
  readonly selectedExercise$ = this.selection$.pipe(
    switchMap((selection) =>
      this.exerciseService.getExerciseById(selection?.exerciseId)
    )
  );
  readonly selectedLabel$ = this.selection$.pipe(
    switchMap((selection) => this.labelService.getLabelById(selection?.labelId))
  );
  readonly recentlySelectedExercises$ = this.recentSelections$.pipe(
    map(
      (selections) =>
        selections.map((x) => x.exerciseId).filter((x) => !!x) as string[]
    ),
    switchMap((exerciseIds) =>
      this.exerciseService.getExercisesByIds(exerciseIds)
    )
  );
  readonly recentlySelectedLabels$ = this.recentSelections$.pipe(
    map(
      (selections) =>
        selections.map((x) => x.labelId).filter((x) => !!x) as string[]
    ),
    switchMap((labelIds) => this.labelService.getLabelsByIds(labelIds))
  );

  constructor(
    private labelService: LabelService,
    private exerciseService: ExerciseService,
    private fileSystemSynchronisationService: FileSystemSynchronisationService,
    private _snackBar: MatSnackBar
  ) {}

  async createLabel() {
    const labelId = await this.fileSystemSynchronisationService.createLabel();
    const label = await firstValueFrom(this.labelService.getLabelById(labelId));
    if (!label) throw Error();
    this.selectLabel(label);
    await navigator.clipboard.writeText(labelId);
    this._snackBar.open('ID copied', undefined, { duration: 2000 });
  }

  async createExercise() {
    const exerciseId =
      await this.fileSystemSynchronisationService.createExercise();
    const exercise = await firstValueFrom(
      this.exerciseService.getExerciseById(exerciseId)
    );
    if (!exercise) throw Error();
    this.selectExercise(exercise);
    await navigator.clipboard.writeText(exerciseId);
    this._snackBar.open('ID copied', undefined, { duration: 2000 });
  }

  selectExercise(exercise: Exercise) {
    this.selection$.next({ exerciseId: exercise.id });
  }

  selectLabel(label: Label) {
    this.selection$.next({ labelId: label.id });
  }

  onInputChange(event: CustomEvent) {
    // @ts-ignore
    const value = event.target.value;
    this.searchValue$.next(value);
  }

  async duplicateExercise(duplicatedExercise: Exercise) {
    const exerciseId =
      await this.fileSystemSynchronisationService.createExercise({
        initialExerciseContent: duplicatedExercise.content,
      });
    const exercise = await firstValueFrom(
      this.exerciseService.getExerciseById(exerciseId)
    );
    if (!exercise) throw Error();
    this.selectExercise(exercise);
    await navigator.clipboard.writeText(exerciseId);
    this._snackBar.open('ID copied', undefined, { duration: 2000 });
  }
}
