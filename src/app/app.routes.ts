import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.page').then((x) => x.AuthPage),
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
