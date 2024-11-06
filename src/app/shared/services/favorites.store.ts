import { effect, inject } from '@angular/core';
import { StorageService } from './storage.service';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

const FAV_KEY = 'favorites';
type FavoritesState = {
  favorites: string[];
};

export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState<FavoritesState>((storage = inject(StorageService)) => ({
    favorites: storage.load<string>(FAV_KEY),
  })),
  withMethods((store) => ({
    update(id: string): void {
      patchState(store, (state) => {
        const active = state.favorites.indexOf(id);
        return {
          favorites:
            active > -1
              ? [
                  ...state.favorites.slice(0, active),
                  ...state.favorites.slice(active + 1),
                ]
              : [...state.favorites, id],
        };
      });
    },
  })),
  withHooks({
    onInit: (store, storage = inject(StorageService)) =>
      effect(() => storage.save(FAV_KEY, store.favorites())),
  }),
);
