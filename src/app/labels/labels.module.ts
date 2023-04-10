import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelsRoutingModule } from './labels-routing.module';
import { LabelsComponent } from './labels.component';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { LabelComponent } from '../shared/components/label/label.component';

@NgModule({
  declarations: [LabelsComponent],
  imports: [
    CommonModule,
    LabelsRoutingModule,
    MatButtonModule,
    ToolbarComponent,
    LabelComponent,
  ],
})
export class LabelsModule {}
