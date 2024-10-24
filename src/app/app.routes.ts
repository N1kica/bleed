import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'show',
    loadChildren: () => import('./show/show.routes').then((r) => r.showRoutes),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
