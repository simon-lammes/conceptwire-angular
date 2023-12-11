import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.page').then((x) => x.AuthPage),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./registration/registration.page').then(
        (x) => x.RegistrationPage,
      ),
  },
];
