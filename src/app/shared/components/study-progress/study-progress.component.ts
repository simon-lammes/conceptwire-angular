import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyProgress } from '../../models/study-progress';

@Component({
  selector: 'app-study-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study-progress.component.html',
  styleUrls: ['./study-progress.component.sass'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyProgressComponent implements OnChanges {
  @Input()
  studyProgress?: StudyProgress | null;

  relativeProgressPercent = 0;

  ngOnChanges(): void {
    this.relativeProgressPercent = this.studyProgress?.totalExercises
      ? (this.studyProgress.finishedExercises * 100) /
        this.studyProgress.totalExercises
      : 0;
  }
}
