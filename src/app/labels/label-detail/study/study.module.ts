import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';
import { ExerciseComponent } from '../../../shared/components/exercise/exercise.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';

@NgModule({
  declarations: [StudyComponent],
  imports: [
    CommonModule,
    StudyRoutingModule,
    ExerciseComponent,
    ToolbarComponent,
  ],
})
export class StudyModule {}
