import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesComponent } from './exercises.component';

const routes: Routes = [
  { path: '', component: ExercisesComponent },
  {
    path: ':exerciseId',
    loadChildren: () =>
      import('./exercise-detail/exercise-detail.module').then(
        (m) => m.ExerciseDetailModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesRoutingModule {}
