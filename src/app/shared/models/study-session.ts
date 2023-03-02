import { ExerciseSituation } from './exercise-situation';

export interface StudySession {
  id: string;
  upcomingExerciseSituationQueue: ExerciseSituation[];
  completedExerciseSituationQueue: ExerciseSituation[];
  reviewExerciseSituationQueue: ExerciseSituation[];
}
