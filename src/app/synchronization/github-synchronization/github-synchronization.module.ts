import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GithubSynchronizationRoutingModule } from './github-synchronization-routing.module';
import { GithubSynchronizationComponent } from './github-synchronization.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PaddedLayoutComponent } from '../../shared/components/padded-layout/padded-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { ProcedureButtonComponent } from '../../shared/components/procedure-button/procedure-button.component';

@NgModule({
  declarations: [GithubSynchronizationComponent],
  imports: [
    CommonModule,
    GithubSynchronizationRoutingModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    PaddedLayoutComponent,
    MatButtonModule,
    ToolbarComponent,
    ProcedureButtonComponent,
  ],
})
export class GithubSynchronizationModule {}
