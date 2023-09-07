import { ExerciseFeedback } from './exercise-feedback';

export interface StudyEvent {
  id: string;
  exerciseId: string;
  exerciseFeedback: ExerciseFeedback;
  studiedLabelId: string;
  dateTime: Date;
}
