import { Injectable } from '@angular/core';
import * as math from 'mathjs';
import { Duration, intervalToDuration } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ExerciseCooldownService {
  calculateCooldown({
    formula,
    correctStreak,
  }: {
    formula?: string;
    correctStreak?: number;
  }): number | undefined {
    if (!formula || correctStreak == null) return undefined;
    try {
      return (
        math.evaluate(formula, {
          x: correctStreak,
        }) * 1000
      );
    } catch (e) {
      return undefined;
    }
  }

  durationMillisToDuration(durationMillis: number): Duration {
    return intervalToDuration({
      start: new Date(0),
      end: new Date(durationMillis),
    });
  }
}
