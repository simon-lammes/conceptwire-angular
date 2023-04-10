import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalAssetsComponent } from './local-assets.component';

const routes: Routes = [
  { path: '', component: LocalAssetsComponent },
  {
    path: ':assetId',
    loadChildren: () =>
      import('./local-asset-detail/local-asset-detail.module').then(
        (m) => m.LocalAssetDetailModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalAssetsRoutingModule {}
