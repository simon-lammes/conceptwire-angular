import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExerciseResult } from '../../models/exerciseResult';
import { ExerciseFeedback } from '../../models/exercise-feedback';
import { ExerciseSituation } from '../../models/exercise-situation';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseComponent {
  @Input() exerciseSituation!: ExerciseSituation;

  @Output()
  exerciseResult = new EventEmitter<ExerciseResult>();

  isAnswerShown = false;

  emitExerciseResult(feedback: ExerciseFeedback) {
    this.exerciseResult.emit({
      exerciseSituation: this.exerciseSituation,
      feedback,
    });
  }
}
