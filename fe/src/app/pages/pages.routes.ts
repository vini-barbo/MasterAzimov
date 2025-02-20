import { Routes } from '@angular/router';
import { Documentation } from '../bonus/documentation/documentation';
import { Crud } from '../bonus/crud/crud';
import { Empty } from '../bonus/empty/empty';

export default [
  { path: 'documentation', component: Documentation },
  { path: 'crud', component: Crud },
  { path: 'empty', component: Empty },
  { path: '**', redirectTo: '/notfound' },
] as Routes;
