import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExerciseDetailRoutingModule } from './exercise-detail-routing.module';
import { ExerciseDetailComponent } from './exercise-detail.component';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { ExercisePreviewComponent } from '../../shared/components/exercise-preview/exercise-preview.component';
import { PaddedLayoutComponent } from '../../shared/components/padded-layout/padded-layout.component';

@NgModule({
  declarations: [ExerciseDetailComponent],
  imports: [
    CommonModule,
    ExerciseDetailRoutingModule,
    MatCardModule,
    ToolbarComponent,
    ExercisePreviewComponent,
    PaddedLayoutComponent,
  ],
})
export class ExerciseDetailModule {}
