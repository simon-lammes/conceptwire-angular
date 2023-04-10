import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalAssetDetailRoutingModule } from './local-asset-detail-routing.module';
import { LocalAssetDetailComponent } from './local-asset-detail.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { LocalAssetUrlPipe } from '../../shared/pipes/local-asset-url.pipe';

@NgModule({
  declarations: [LocalAssetDetailComponent],
  imports: [
    CommonModule,
    LocalAssetDetailRoutingModule,
    ToolbarComponent,
    LocalAssetUrlPipe,
  ],
})
export class LocalAssetDetailModule {}
