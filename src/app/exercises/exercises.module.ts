import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesComponent } from './exercises.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelAutocompleteComponent } from '../shared/components/label-autocomplete/label-autocomplete.component';
import { ExerciseFormComponent } from '../shared/components/exercise-form/exercise-form.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';

@NgModule({
  declarations: [ExercisesComponent],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    LabelAutocompleteComponent,
    ExerciseFormComponent,
    ToolbarComponent,
  ],
})
export class ExercisesModule {}
