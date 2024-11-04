import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { StatePersistenceService } from './state-persistence.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly KEY = 'favorites';
  storage = inject(StatePersistenceService);

  #favorites: WritableSignal<string[]> = signal(this.storage.load(this.KEY));
  favorites: Signal<string[]> = computed(() => this.#favorites());

  update(id: string) {
    this.#favorites.update((favorites) => {
      const active = favorites.indexOf(id);
      return active > -1
        ? [...favorites.slice(0, active), ...favorites.slice(active + 1)]
        : [...favorites, id];
    });
  }

  syncWithStorage = effect(() => {
    this.storage.save(this.KEY, this.#favorites());
  });
}
