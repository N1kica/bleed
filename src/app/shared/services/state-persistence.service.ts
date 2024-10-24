import { Injectable, inject } from '@angular/core';
import { Observable, scan, startWith, tap } from 'rxjs';
import { LOCAL_STORAGE } from '../utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class StatePersistenceService {
  storage = inject(LOCAL_STORAGE);

  syncWithStorage<T>(key: string, state$: Observable<T>): Observable<T[]> {
    const initialState: T[] = this.loadState(key);
    return state$.pipe(
      startWith(...initialState),
      scan((state: T[], event: T) => this.updateState(state, event), []),
      tap((favorites) => this.saveState(key, favorites)),
    );
  }

  private loadState<T>(key: string): T[] {
    return JSON.parse(this.storage.getItem(key) ?? '[]') as T[];
  }

  private saveState<T>(key: string, items: T[]): void {
    this.storage.setItem(key, JSON.stringify(items));
  }

  private updateState<T>(state: T[], event: T): T[] {
    const active = state.indexOf(event);
    return active > -1
      ? [...state.slice(0, active), ...state.slice(active + 1)]
      : [...state, event];
  }
}
