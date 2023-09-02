import { QualityLabels } from './quality-labels';

export interface Exercise {
  id: string;
  title?: string;
  content: string;
  qualityLabels: QualityLabels[];
}
