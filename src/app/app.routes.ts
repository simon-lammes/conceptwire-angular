import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.routes'),
  },
  {
    path: 'labels',
    loadChildren: () => import('./pages/labels/labels.routes'),
  },
  {
    path: 'synchronization',
    loadChildren: () =>
      import('./pages/synchronization/synchronization.routes'),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.routes'),
  },
  {
    path: 'local-assets',
    loadChildren: () => import('./pages/local-assets/local-assets.routes'),
  },
  {
    path: 'designer',
    loadChildren: () => import('./pages/designer/designer.routes'),
  },
  {
    path: 'resource-possessions',
    loadChildren: () =>
      import('./pages/resource-possessions/resource-possessions.routes'),
  },
  { path: '**', redirectTo: 'home' },
];

export default routes;
