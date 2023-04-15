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
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercise } from '../shared/models/exercise';
import { Label } from '../shared/models/label';
import { ExercisePreviewComponent } from '../shared/components/exercise-preview/exercise-preview.component';
import { LabelComponent } from '../shared/components/label/label.component';

@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ExercisePreviewComponent,
    LabelComponent,
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
  readonly selection$ = new BehaviorSubject<
    { label?: Label; exercise?: Exercise } | undefined
  >(undefined);

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
