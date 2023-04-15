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
import { BehaviorSubject, Observable, of, scan, switchMap } from 'rxjs';
import { Exercise } from '../shared/models/exercise';
import { Label } from '../shared/models/label';
import { ExercisePreviewComponent } from '../shared/components/exercise-preview/exercise-preview.component';
import { LabelComponent } from '../shared/components/label/label.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { LabelPreviewComponent } from '../shared/components/label-preview/label-preview.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignerComponent {
  readonly labels$ = this.labelService.labels$;
  readonly exercises$: Observable<Exercise[]> =
    this.exerciseService.searchExercises({});
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
    private exerciseService: ExerciseService
  ) {}

  selectExercise(exercise: Exercise) {
    this.selection$.next({ exercise });
  }

  selectLabel(label: Label) {
    this.selection$.next({ label });
  }
}
