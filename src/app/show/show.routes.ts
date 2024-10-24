import { Routes } from '@angular/router';

export const showRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./show.component').then((m) => m.ShowComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./show.component').then((m) => m.ShowComponent),
  },
];
