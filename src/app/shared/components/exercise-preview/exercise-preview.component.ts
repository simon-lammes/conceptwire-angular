import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TrustHtmlPipe } from '../../pipes/trust-html.pipe';
import { ExerciseComponent } from '../exercise/exercise.component';

@Component({
  selector: 'app-exercise-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, TrustHtmlPipe, ExerciseComponent],
  templateUrl: './exercise-preview.component.html',
  styleUrls: ['./exercise-preview.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisePreviewComponent {
  @Input()
  content?: string | null;
}
