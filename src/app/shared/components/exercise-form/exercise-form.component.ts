import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MultiLabelInputComponent } from '../multi-label-input/multi-label-input.component';
import { MatInputModule } from '@angular/material/input';
import { Exercise } from '../../models/exercise';
import { Label } from '../../models/label';
import { ExerciseService } from '../../services/exercise.service';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { LabelService } from '../../services/label.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MultiLabelInputComponent,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseFormComponent implements OnChanges {
  @Input()
  exercise?: Exercise;

  exercise$ = new BehaviorSubject(this.exercise);

  questionControl = this.fb.control('');

  answerControl = this.fb.control('');

  labelControl = this.fb.control<Label[]>([]);

  form = this.fb.group({
    question: this.questionControl,
    answer: this.answerControl,
    labels: this.labelControl,
  });

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private labelService: LabelService
  ) {
    // todo show loading state
    // Note: Some things like handling loading states might be easier to handle
    // with side effects than with a "clean" reactive approach.
    const updateFormWithSideEffects$ = this.exercise$.pipe(
      switchMap((exercise) =>
        this.labelService.getLabelsOfExercise(exercise).pipe(
          tap((labels) =>
            this.form.reset({
              labels: labels,
              question: exercise?.question,
              answer: exercise?.answer,
            })
          )
        )
      ),
      untilDestroyed(this)
    );
    updateFormWithSideEffects$.subscribe();
  }

  ngOnChanges(): void {
    this.exercise$.next(this.exercise);
  }

  async onSubmit() {
    const values = this.form.value;
    if (values.question && values.answer) {
      await this.exerciseService.saveExercise({
        id: this.exercise?.id,
        question: values.question,
        answer: values.answer,
        labelIds: values.labels?.map((x) => x.id),
      });
      this.form.reset(this.exercise);
    }
  }
}
