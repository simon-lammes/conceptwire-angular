import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SynchronizationRoutingModule } from './synchronization-routing.module';
import { SynchronizationComponent } from './synchronization.component';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';

@NgModule({
  declarations: [SynchronizationComponent],
  imports: [
    CommonModule,
    SynchronizationRoutingModule,
    MatButtonModule,
    ToolbarComponent,
  ],
})
export class SynchronizationModule {}
