import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'fechamento', loadComponent: () => import('./setup/setup.component').then(mod => mod.SetupComponent)},
    { path: '**', redirectTo: '/fechamento'}
];
