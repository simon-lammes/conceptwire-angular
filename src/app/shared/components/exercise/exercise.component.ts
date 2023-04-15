import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExerciseFeedback } from '../../models/exercise-feedback';
import { ApplyRuntimeTransformationsToExercisePipe } from '../../pipes/apply-study-settings-to-exercise.pipe';
import { TrustHtmlPipe } from '../../pipes/trust-html.pipe';
import '../../../shared/custom-elements/question-answer-exercise.element';
import '../../../shared/custom-elements/math.element';
import '../../../shared/custom-elements/code.element';
import '../../../shared/custom-elements/marble-diagram.element';
import '../../../shared/custom-elements/svg-occlusion-exercise.element';
import '../../../shared/custom-elements/solution-feedback.element';
import '../../../shared/custom-elements/multiline-prompt-exercise.element';
import '../../../shared/custom-elements/request-next-exercise-button.element';
import '../../../shared/custom-elements/shoelace-context.element';
import '../../../shared/custom-elements/instructions.element';
import '../../../shared/custom-elements/info.element';
import '../../../shared/custom-elements/short-answer.element';
import '../../../shared/custom-elements/external-reference.element';
import '../../../shared/custom-elements/opinion-exercise.element';
import '../../custom-elements/opinion.element';
import '../../custom-elements/cw-example.element';
import '../../custom-elements/element.element';
import '../../custom-elements/personal-note.element';

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

  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.addEventListener(
      'cw-exercise-feedback',
      (ev: CustomEvent<ExerciseFeedback>) =>
        this.exerciseFeedback.emit(ev.detail)
    );
    this.elementRef.nativeElement.addEventListener(
      'cw-request-next-exercise',
      (ev: CustomEvent) => {
        this.nextExerciseRequested.emit();
      }
    );
  }
}
