import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseDetailComponent } from './exercise-detail.component';

const routes: Routes = [{ path: '', component: ExerciseDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseDetailRoutingModule {}
