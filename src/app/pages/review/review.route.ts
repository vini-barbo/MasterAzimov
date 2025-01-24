import { Routes } from '@angular/router';
import { PhaseOneComponent } from './phase-one/phase-one.component';

export default [
    { path: '', component: PhaseOneComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
