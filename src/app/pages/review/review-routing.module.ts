import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'phaseone', loadComponent: () => import('./phase-one/phase-one.component').then((c) => c.PhaseOneComponent) },
            { path: 'phasetwo', loadComponent: () => import('./phase-two/phase-two.component').then((c) => c.PhaseTwoComponent) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReviewRoutingModule {}
