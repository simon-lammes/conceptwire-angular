import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelDetailRoutingModule } from './label-detail-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { LabelDetailComponent } from './label-detail.component';
import { LocalAssetUrlPipe } from '../../shared/pipes/local-asset-url.pipe';

@NgModule({
  declarations: [LabelDetailComponent],
  imports: [
    CommonModule,
    LabelDetailRoutingModule,
    MatCardModule,
    MatButtonModule,
    ToolbarComponent,
    LocalAssetUrlPipe,
  ],
})
export class LabelDetailModule {}
