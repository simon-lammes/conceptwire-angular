import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelsComponent } from './labels.component';

const routes: Routes = [
  { path: '', component: LabelsComponent },
  {
    path: ':labelId',
    loadChildren: () =>
      import('./label-detail/label-detail.module').then(
        (m) => m.LabelDetailModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelsRoutingModule {}
