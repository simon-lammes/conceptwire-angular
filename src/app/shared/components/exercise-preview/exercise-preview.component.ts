import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TrustHtmlPipe } from '../../pipes/trust-html.pipe';
import { ExerciseComponent } from '../exercise/exercise.component';
import { Exercise } from '../../models/exercise';
import { Label } from '../../models/label';
import { CopyTextButtonComponent } from '../copy-text-button/copy-text-button.component';

@Component({
  selector: 'app-exercise-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TrustHtmlPipe,
    ExerciseComponent,
    CopyTextButtonComponent,
  ],
  templateUrl: './exercise-preview.component.html',
  styleUrls: ['./exercise-preview.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisePreviewComponent {
  @Input()
  exercise!: Exercise;

  @Input()
  labels: Label[] = [];

  @Output()
  labelClicked = new EventEmitter<Label>();

  onLabelClicked(label: Label) {
    this.labelClicked.emit(label);
  }
}
