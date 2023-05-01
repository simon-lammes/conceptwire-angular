import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SynchronizationRoutingModule } from './synchronization-routing.module';
import { SynchronizationComponent } from './synchronization.component';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { PaddedLayoutComponent } from '../shared/components/padded-layout/padded-layout.component';
import { TileComponent } from '../shared/components/tile/tile.component';

@NgModule({
  declarations: [SynchronizationComponent],
  imports: [
    CommonModule,
    SynchronizationRoutingModule,
    MatButtonModule,
    ToolbarComponent,
    PaddedLayoutComponent,
    TileComponent,
  ],
})
export class SynchronizationModule {}
