import { Routes } from '@angular/router';
import { SynchronizationComponent } from './synchronization.component';

const routes: Routes = [
  { path: '', component: SynchronizationComponent },
  {
    path: 'github',
    loadChildren: () =>
      import('./github-synchronization/github-synchronization.routes'),
  },
];

export default routes;
