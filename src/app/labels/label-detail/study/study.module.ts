import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { ExerciseSituationComponent } from '../../../shared/components/exercise-situation/exercise-situation.component';

@NgModule({
  declarations: [StudyComponent],
  imports: [
    CommonModule,
    StudyRoutingModule,
    ToolbarComponent,
    ExerciseSituationComponent,
  ],
})
export class StudyModule {}
