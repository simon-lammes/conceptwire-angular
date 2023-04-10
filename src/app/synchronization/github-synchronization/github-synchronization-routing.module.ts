import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GithubSynchronizationComponent } from './github-synchronization.component';

const routes: Routes = [
  { path: '', component: GithubSynchronizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GithubSynchronizationRoutingModule {}
