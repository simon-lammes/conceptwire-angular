import { QualityLabels } from './quality-labels';

export interface Experience {
  exerciseId: string;
  streak: number;
  lastSeen: Date;
  indexesForLabelStreakAndLastSeen: IndexForLabelStreakAndLastSeen[];
  qualityLabels?: QualityLabels[];
  requiredReferencedBooksByIsbn13: string[];
}

/**
 * This index can be used for efficiently determine the next exercise.
 * Inspired by: https://github.com/dexie/Dexie.js/issues/368
 */
export type IndexForLabelStreakAndLastSeen = [string, number, Date];
