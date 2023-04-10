import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalAssetsRoutingModule } from './local-assets-routing.module';
import { LocalAssetsComponent } from './local-assets.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { LabelComponent } from '../shared/components/label/label.component';
import { LocalAssetUrlPipe } from '../shared/pipes/local-asset-url.pipe';

@NgModule({
  declarations: [LocalAssetsComponent],
  imports: [
    CommonModule,
    LocalAssetsRoutingModule,
    ToolbarComponent,
    LabelComponent,
    LocalAssetUrlPipe,
  ],
})
export class LocalAssetsModule {}
