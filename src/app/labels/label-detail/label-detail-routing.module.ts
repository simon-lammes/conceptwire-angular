import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelDetailComponent } from './label-detail.component';

const routes: Routes = [{ path: '', component: LabelDetailComponent }, { path: 'study', loadChildren: () => import('./study/study.module').then(m => m.StudyModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelDetailRoutingModule {}
