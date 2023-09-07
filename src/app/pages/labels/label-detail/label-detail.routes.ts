import { Routes } from '@angular/router';
import { LabelDetailComponent } from './label-detail.component';

const routes: Routes = [
  { path: '', component: LabelDetailComponent },
  {
    path: 'study',
    loadChildren: () => import('./study/study.routes'),
  },
];

export default routes;
