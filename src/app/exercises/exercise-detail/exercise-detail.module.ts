import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExerciseDetailRoutingModule } from './exercise-detail-routing.module';
import { ExerciseDetailComponent } from './exercise-detail.component';
import { MatCardModule } from '@angular/material/card';
import { ExerciseFormComponent } from '../../shared/components/exercise-form/exercise-form.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';

@NgModule({
  declarations: [ExerciseDetailComponent],
  imports: [
    CommonModule,
    ExerciseDetailRoutingModule,
    MatCardModule,
    ExerciseFormComponent,
    ToolbarComponent,
  ],
})
export class ExerciseDetailModule {}
