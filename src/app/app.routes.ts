import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes'),
  },
  {
    path: 'labels',
    loadChildren: () => import('./labels/labels.routes'),
  },
  {
    path: 'synchronization',
    loadChildren: () => import('./synchronization/synchronization.routes'),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes'),
  },
  {
    path: 'local-assets',
    loadChildren: () => import('./local-assets/local-assets.routes'),
  },
  {
    path: 'designer',
    loadChildren: () => import('./designer/designer.routes'),
  },
  {
    path: 'resource-possessions',
    loadChildren: () =>
      import('./resource-possessions/resource-possessions.routes'),
  },
  { path: '**', redirectTo: 'home' },
];

export default routes;
