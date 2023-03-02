import { ExerciseFeedback } from './exercise-feedback';
import { ExerciseSituation } from './exercise-situation';

export interface ExerciseResult {
  exerciseSituation: ExerciseSituation;
  feedback: ExerciseFeedback;
}
