import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesComponent } from './exercises.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelAutocompleteComponent } from '../shared/components/label-autocomplete/label-autocomplete.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { ExercisePreviewSmallClickableComponent } from '../shared/components/exercise-preview-small-clickable/exercise-preview-small-clickable.component';
import { PaddedLayoutComponent } from '../shared/components/padded-layout/padded-layout.component';

@NgModule({
  declarations: [ExercisesComponent],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    LabelAutocompleteComponent,
    ToolbarComponent,
    ExercisePreviewSmallClickableComponent,
    PaddedLayoutComponent,
  ],
})
export class ExercisesModule {}
