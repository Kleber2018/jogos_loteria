import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'megasena', loadComponent: () => import('./setup/setup.component').then(mod => mod.SetupComponent)},
    {path: 'lotomania', loadComponent: () => import('./lotomania/lotomania.component').then(mod => mod.LotomaniaComponent)},
    { path: '**', redirectTo: '/megasena'}
];
