import {
  signalStore,
  withMethods,
  withState,
  patchState,
  withHooks,
  withComputed,
} from '@ngrx/signals';
import { Status, TVShow } from '../shared/interfaces/tv-show.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pipe, switchMap, tap } from 'rxjs';
import { FavoritesStore } from '../shared/services/favorites.store';
import { ActivatedRoute } from '@angular/router';

type ShowState = {
  tvShow: TVShow;
  status: Status;
};

const initialState: ShowState = {
  tvShow: { id: '-1' },
  status: 'loading',
};

export const ShowStore = signalStore(
  withState<ShowState>(initialState),
  withComputed(({ tvShow }, favs = inject(FavoritesStore)) => ({
    show: computed(() => ({
      ...tvShow(),
      favorite: favs.favorites()?.includes(tvShow().id),
    })),
  })),
  withMethods(
    (
      store,
      http = inject(HttpClient),
      route = inject(ActivatedRoute),
      favs = inject(FavoritesStore),
    ) => ({
      load: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { status: 'loading' })),
          switchMap(() =>
            route.url.pipe(
              switchMap((seg) =>
                http
                  .get<ShowState>(
                    `https://www.episodate.com/api/show-details?q=${seg[0].path}`,
                  )
                  .pipe(
                    tapResponse({
                      next: (res: ShowState) => {
                        patchState(store, { ...res, status: 'success' });
                      },
                      error: () => patchState(store, { status: 'error' }),
                    }),
                  ),
              ),
            ),
          ),
        ),
      ),
      favorite: (id: string) => favs.update(id),
    }),
  ),
  withHooks({
    onInit: (store) => store.load(),
  }),
);
