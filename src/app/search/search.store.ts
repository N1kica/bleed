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
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { FavoritesStore } from '../shared/services/favorites.store';

type SearchState = {
  page: number;
  pages: number;
  total: number;
  tv_shows: TVShow[];
  status: Status;
};

const initialState: SearchState = {
  page: 1,
  pages: 1,
  total: 0,
  tv_shows: [],
  status: 'loading',
};

export const SearchStore = signalStore(
  withState<SearchState>(initialState),
  withComputed(({ tv_shows }, favs = inject(FavoritesStore)) => ({
    shows: computed(() =>
      tv_shows().map((show) => ({
        ...show,
        favorite: favs.favorites()?.includes(show.id),
      })),
    ),
  })),
  withMethods(
    (store, http = inject(HttpClient), favs = inject(FavoritesStore)) => ({
      search: rxMethod<string>(
        pipe(
          distinctUntilChanged(),
          tap(() => patchState(store, { status: 'loading' })),
          switchMap((query: string) =>
            http
              .get<SearchState>(
                `https://www.episodate.com/api/search?${query}page=1`,
              )
              .pipe(
                tapResponse({
                  next: (res: SearchState) =>
                    patchState(store, { ...res, status: 'success' }),
                  error: () => patchState(store, { status: 'error' }),
                }),
              ),
          ),
        ),
      ),
      favorite: (id: string) => favs.update(id),
    }),
  ),
  withHooks({
    onInit: (store) => store.search(''),
  }),
);
