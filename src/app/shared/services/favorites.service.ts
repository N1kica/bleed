import { Injectable, Signal, inject } from '@angular/core';
import { StatePersistenceService } from './state-persistence.service';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  storage = inject(StatePersistenceService);
  state$ = new Subject<string>();

  favorites: Signal<string[] | undefined> = toSignal(
    this.storage.syncWithStorage<string>('favorites', this.state$),
  );
}
