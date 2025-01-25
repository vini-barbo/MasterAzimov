import { Routes } from '@angular/router';
import { PhaseOneComponent } from './phase-one/phase-one.component';
import { PhaseTwoComponent } from './phase-two/phase-two.component';

export default [
    { path: 'phase-one', component: PhaseOneComponent },
    { path: 'phase-two', component: PhaseTwoComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
