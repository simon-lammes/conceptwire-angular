import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseSituation } from '../../models/exercise-situation';
import { ExerciseResult } from '../../models/exerciseResult';
import { ExerciseFeedback } from '../../models/exercise-feedback';
import { ExerciseComponent } from '../exercise/exercise.component';

@Component({
  selector: 'app-exercise-situation',
  standalone: true,
  imports: [CommonModule, ExerciseComponent],
  templateUrl: './exercise-situation.component.html',
  styleUrls: ['./exercise-situation.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseSituationComponent {
  @Input() exerciseSituation!: ExerciseSituation;

  @Output()
  exerciseResult = new EventEmitter<ExerciseResult>();

  @Output()
  nextExerciseRequested = new EventEmitter();

  emitExerciseResult(feedback: ExerciseFeedback) {
    this.exerciseResult.emit({
      exerciseSituation: this.exerciseSituation,
      feedback,
    });
  }
}
