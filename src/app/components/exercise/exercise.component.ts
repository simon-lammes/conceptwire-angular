import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExerciseFeedback } from '../../models/exercise-feedback';
import { ApplyRuntimeTransformationsToExercisePipe } from '../../pipes/apply-runtime-transformations-to-exercise.pipe';
import { TrustHtmlPipe } from '../../pipes/trust-html.pipe';
import '../../custom-elements/question-answer-exercise.element';
import '../../custom-elements/math.element';
import '../../custom-elements/code.element';
import '../../custom-elements/marble-diagram.element';
import '../../custom-elements/svg-occlusion-exercise.element';
import '../../custom-elements/solution-feedback.element';
import '../../custom-elements/multiline-prompt-exercise.element';
import '../../custom-elements/request-next-exercise-button.element';
import '../../custom-elements/shoelace-context.element';
import '../../custom-elements/instructions.element';
import '../../custom-elements/info.element';
import '../../custom-elements/short-answer.element';
import '../../custom-elements/external-reference.element';
import '../../custom-elements/opinion-exercise.element';
import '../../custom-elements/opinion.element';
import '../../custom-elements/cw-example.element';
import '../../custom-elements/element.element';
import '../../custom-elements/personal-note.element';
import '../../custom-elements/youtube-video.element';
import '../../custom-elements/book-reference.element';
import '../../custom-elements/exercise-reference.element';
import { Exercise } from '../../models/exercise';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ApplyRuntimeTransformationsToExercisePipe,
    TrustHtmlPipe,
  ],
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseComponent {
  @Input() exerciseContent!: string;

  @Output()
  exerciseFeedback = new EventEmitter<ExerciseFeedback>();

  @Output()
  nextExerciseRequested = new EventEmitter();

  @Output()
  openExercise = new EventEmitter<Exercise>();

  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.addEventListener(
      'cw-exercise-feedback',
      (ev: CustomEvent<ExerciseFeedback>) =>
        this.exerciseFeedback.emit(ev.detail),
    );
    this.elementRef.nativeElement.addEventListener(
      'cw-request-next-exercise',
      () => {
        this.nextExerciseRequested.emit();
      },
    );
    this.elementRef.nativeElement.addEventListener(
      'cw-open-exercise',
      (event: CustomEvent<Exercise>) => {
        this.openExercise.emit(event.detail);
      },
    );
  }
}
