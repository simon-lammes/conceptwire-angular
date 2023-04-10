import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalAssetDetailComponent } from './local-asset-detail.component';

const routes: Routes = [{ path: '', component: LocalAssetDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalAssetDetailRoutingModule {}
