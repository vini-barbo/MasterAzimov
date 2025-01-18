import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./phase-one/phase-one.component').then(c => c.PhaseOneComponent)
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
