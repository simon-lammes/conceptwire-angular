import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'labels',
    loadChildren: () =>
      import('./labels/labels.module').then((m) => m.LabelsModule),
  },
  {
    path: 'exercises',
    loadChildren: () =>
      import('./exercises/exercises.module').then((m) => m.ExercisesModule),
  },
  {
    path: 'synchronization',
    loadChildren: () =>
      import('./synchronization/synchronization.module').then(
        (m) => m.SynchronizationModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'local-assets',
    loadChildren: () =>
      import('./local-assets/local-assets.module').then(
        (m) => m.LocalAssetsModule
      ),
  },
  {
    path: 'designer',
    loadChildren: () => import('./designer/designer.routes'),
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
