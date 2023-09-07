import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Exercise } from '../../models/exercise';
import { MatButtonModule } from '@angular/material/button';
import { TextContentOfHtmlPipe } from '../../pipes/text-content-of-html.pipe';

@Component({
  selector: 'app-exercise-preview-small-clickable',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    TextContentOfHtmlPipe,
  ],
  templateUrl: './exercise-preview-small-clickable.component.html',
  styleUrls: ['./exercise-preview-small-clickable.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisePreviewSmallClickableComponent {
  @Input()
  exercise!: Exercise;
}
