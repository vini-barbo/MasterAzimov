import { Routes } from '@angular/router';
import { PhaseOneComponent } from './phase-one/phase-one.component';
import { PhaseTwoComponent } from './phase-two/phase-two.component';
import { PhaseThreeComponent } from './phase-three/phase-three.component';

export default [
    { path: 'phase-one', component: PhaseOneComponent },
    { path: 'phase-two', component: PhaseTwoComponent },
    { path: 'phase-three', component: PhaseThreeComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
