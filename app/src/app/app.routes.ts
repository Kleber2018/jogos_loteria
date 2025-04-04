import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'megasena', loadComponent: () => import('./megasena/megasena.component').then(mod => mod.MegasenaComponent)},
    {path: 'lotomania', loadComponent: () => import('./lotomania/lotomania.component').then(mod => mod.LotomaniaComponent)},
    { path: '**', redirectTo: '/megasena'}
];
