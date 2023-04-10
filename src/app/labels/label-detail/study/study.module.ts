import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { ExerciseSituationComponent } from '../../../shared/components/exercise-situation/exercise-situation.component';
import { PaddedLayoutComponent } from '../../../shared/components/padded-layout/padded-layout.component';

@NgModule({
  declarations: [StudyComponent],
  imports: [
    CommonModule,
    StudyRoutingModule,
    ToolbarComponent,
    ExerciseSituationComponent,
    PaddedLayoutComponent,
  ],
})
export class StudyModule {}
