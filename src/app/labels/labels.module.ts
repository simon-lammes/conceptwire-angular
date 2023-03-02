import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelsRoutingModule } from './labels-routing.module';
import { LabelsComponent } from './labels.component';
import { LabelFormComponent } from '../shared/components/label-form/label-form.component';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';

@NgModule({
  declarations: [LabelsComponent],
  imports: [
    CommonModule,
    LabelsRoutingModule,
    LabelFormComponent,
    MatButtonModule,
    ToolbarComponent,
  ],
})
export class LabelsModule {}
