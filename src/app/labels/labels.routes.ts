import { Routes } from '@angular/router';
import { LabelsComponent } from './labels.component';

const routes: Routes = [
  { path: '', component: LabelsComponent },
  {
    path: ':labelId',
    loadChildren: () => import('./label-detail/label-detail.routes'),
  },
];

export default routes;
