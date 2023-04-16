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

interface Selection {
  label?: Label;
  exercise?: Exercise;
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
  ],
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.sass'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MatSnackBar],
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
      const recentSelectionsWithoutCurrentSelection = currentSelection.label
        ? recentSelections.filter(
            (x) => x.label?.id !== currentSelection.label?.id
          )
        : currentSelection.exercise
        ? recentSelections.filter(
            (x) => x.exercise?.id !== currentSelection.exercise?.id
          )
        : recentSelections;
      return [currentSelection, ...recentSelectionsWithoutCurrentSelection];
    }, [] as Selection[])
  );
  readonly labelsOfSelectedExercise$ = this.selection$.pipe(
    switchMap((selection) => {
      if (!selection?.exercise) of(undefined);
      return this.labelService.getLabelsOfExercise(selection?.exercise);
    })
  );
  readonly subLabelsOfSelectedLabel$ = this.selection$.pipe(
    switchMap((selection) => {
      const label = selection?.label;
      if (!label) return of(undefined);
      return this.labelService.getChildLabels(label.id);
    })
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

  selectExercise(exercise: Exercise) {
    this.selection$.next({ exercise });
  }

  selectLabel(label: Label) {
    this.selection$.next({ label });
  }

  onInputChange(event: CustomEvent) {
    // @ts-ignore
    const value = event.target.value;
    this.searchValue$.next(value);
  }
}
