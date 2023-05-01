import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { LabelComponent } from '../shared/components/label/label.component';
import { PaddedLayoutComponent } from '../shared/components/padded-layout/padded-layout.component';
import { TileComponent } from '../shared/components/tile/tile.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    LabelComponent,
    PaddedLayoutComponent,
    TileComponent,
  ],
})
export class HomeModule {}
