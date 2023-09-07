import { Exercise } from './exercise';
import { Experience } from './experience';

/**
 * When you combine the exercise someone is doing and his given experience,
 * you know his current exercise situation.
 */
export interface ExerciseSituation {
  exercise: Exercise;
  experience: Experience;
}
