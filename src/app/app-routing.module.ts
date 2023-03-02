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
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
