import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { ExerciseSituationComponent } from '../../../shared/components/exercise-situation/exercise-situation.component';
import { PaddedLayoutComponent } from '../../../shared/components/padded-layout/padded-layout.component';
import { StudyProgressComponent } from '../../../shared/components/study-progress/study-progress.component';

@NgModule({
  declarations: [StudyComponent],
  imports: [
    CommonModule,
    StudyRoutingModule,
    ToolbarComponent,
    ExerciseSituationComponent,
    PaddedLayoutComponent,
    StudyProgressComponent,
  ],
})
export class StudyModule {}
