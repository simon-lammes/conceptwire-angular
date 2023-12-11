import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((x) => x.routes),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((x) => x.HomePage),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
