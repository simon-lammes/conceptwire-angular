import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelDetailRoutingModule } from './label-detail-routing.module';
import { LabelDetailComponent } from './label-detail.component';
import { LabelFormComponent } from '../../shared/components/label-form/label-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';

@NgModule({
  declarations: [LabelDetailComponent],
  imports: [
    CommonModule,
    LabelDetailRoutingModule,
    LabelFormComponent,
    MatCardModule,
    MatButtonModule,
    ToolbarComponent,
  ],
})
export class LabelDetailModule {}
