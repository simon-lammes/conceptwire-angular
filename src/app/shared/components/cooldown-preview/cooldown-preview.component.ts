import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDuration } from 'date-fns';
import { ExerciseCooldownService } from '../../services/exercise-cooldown.service';

@Component({
  selector: 'app-cooldown-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cooldown-preview.component.html',
  styleUrls: ['./cooldown-preview.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CooldownPreviewComponent implements OnChanges {
  @Input()
  formula!: string;

  @Input()
  depth = 3;

  cooldownPreviews?: {
    correctStreak: number;
    durationFormatted: string;
  }[];

  constructor(private exerciseCooldownService: ExerciseCooldownService) {}

  ngOnChanges(): void {
    try {
      this.cooldownPreviews = [...Array(this.depth).keys()].map(
        (correctStreak) => {
          const cooldownTimeMillis =
            this.exerciseCooldownService.calculateCooldownMillis({
              formula: this.formula,
              correctStreak,
            });
          if (!cooldownTimeMillis) throw Error();
          const duration =
            this.exerciseCooldownService.durationMillisToDuration(
              cooldownTimeMillis
            );
          return {
            durationFormatted: formatDuration(duration),
            correctStreak,
          };
        }
      );
    } catch (e) {
      this.cooldownPreviews = undefined;
    }
  }
}
