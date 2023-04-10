import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SynchronizationComponent } from './synchronization.component';

const routes: Routes = [
  { path: '', component: SynchronizationComponent },
  {
    path: 'github',
    loadChildren: () =>
      import('./github-synchronization/github-synchronization.module').then(
        (m) => m.GithubSynchronizationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SynchronizationRoutingModule {}
