import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/bonus/dashboard/dashboard';
import { Documentation } from './app/bonus/documentation/documentation';
import { Landing } from './app/bonus/landing/landing';
import { Notfound } from './app/bonus/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/bonus/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'review', loadChildren: () => import('./app/pages/review/review.route') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/bonus/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
