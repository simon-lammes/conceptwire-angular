import { Routes } from '@angular/router';
import { LocalAssetsComponent } from './local-assets.component';

const routes: Routes = [
  { path: '', component: LocalAssetsComponent },
  {
    path: ':assetId',
    loadChildren: () =>
      import('./local-asset-detail/local-asset-detail.routes'),
  },
];

export default routes;
