import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'megasena/:cod', loadComponent: () => import('./megasena/megasena.component').then(mod => mod.MegasenaComponent)},
    {path: 'lotomania/:cod', loadComponent: () => import('./lotomania/lotomania.component').then(mod => mod.LotomaniaComponent)},
    { path: '**', redirectTo: '/megasena/0'}
];
