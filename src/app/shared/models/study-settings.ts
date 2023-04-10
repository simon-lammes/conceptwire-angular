export type StudySettingsId = 'my-study-settings';

export interface StudySettings {
  id: StudySettingsId;
  immediatelyJumpToNextExerciseAfterGivingFeedback: boolean;
  /**
   * A formula that calculates the amount of seconds an exercise needs to cool down until it can
   * be presented to the user again.
   *
   * As an input, it gets the exercise's correctStreak count. Thus, you can customize the formula
   * to drastically increase the cooldown time for exercises with higher correct streaks.
   */
  cooldownFormula: string;
}
