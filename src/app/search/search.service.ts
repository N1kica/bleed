import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Status, TVShow } from '../shared/interfaces/tv-show.model';
import { FavoritesService } from '../shared/services/favorites.service';
import { SearchEvent, SearchState } from './interfaces/search.model';

@Injectable()
export class SearchService {
  private http = inject(HttpClient);
  private favs = inject(FavoritesService);

  // Single stream for all search-related events
  private readonly events$ = new Subject<SearchEvent>();

  // Action creators
  readonly actions = {
    search: (query: string) => this.events$.next({ type: 'search', query }),
    next: () => this.events$.next({ type: 'next' }),
    prev: () => this.events$.next({ type: 'prev' }),
    reset: () => this.events$.next({ type: 'reset' }),
    favorite: (id: string) => this.favs.update(id),
  } as const;

  // State management using RxJS
  private state$: Observable<SearchState> = this.events$.pipe(
    startWith({ type: 'search' } as SearchEvent),
    map(
      (event) =>
        `https://www.episodate.com/api/search?${event.query && `q=${event.query}&`}page=1`,
    ),
    distinctUntilChanged(),
    switchMap((url) =>
      this.http.get<SearchState>(url).pipe(
        startWith({} as SearchState),
        tap((val) => console.log(val)),
        catchError(() => of({ total: '-1' })),
      ),
    ),
  );

  // Private signal selector
  private readonly state = toSignal(this.state$);

  // Public signals
  shows: Signal<TVShow[]> = computed(
    () =>
      this.state()?.tv_shows?.map((show) => ({
        ...show,
        favorite: this.favs.favorites()?.includes(show.id),
      })) ?? [],
  );

  status: Signal<Status> = computed(() => {
    switch (this.state()?.total) {
      case undefined:
        return 'loading';
      case '-1':
        return 'error';
      case '0':
        return 'no_results';
      default:
        return 'success';
    }
  });
}
