import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  catchError,
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

  // Simplified action creators
  readonly actions = {
    search: (query: string) => this.events$.next({ type: 'SEARCH', query }),
    next: () => this.events$.next({ type: 'NEXT', query: '' }),
    prev: () => this.events$.next({ type: 'PREV', query: '' }),
    reset: () => this.events$.next({ type: 'RESET', query: '' }),
    favorite: (id: string) => this.favs.state$.next(id),
  } as const;

  // Pure function to construct URL
  private readonly buildUrl = (query = '') =>
    `https://www.episodate.com/api/search?${query && `q=${query}&`}page=1`;

  // Pure function to handle errors
  private readonly handleError = (): SearchState => ({ total: '-1' });

  // State management using RxJS
  private state$: Observable<SearchState> = this.events$.pipe(
    startWith({ type: 'SEARCH' } as SearchEvent),
    map(event => this.buildUrl(event.query)),
    switchMap(url =>
      this.http.get<SearchState>(url).pipe(
        startWith({} as SearchState),
        tap(val => console.log(val)),
        catchError(() => of(this.handleError())),
      ),
    ),
  );

  // Private signal selector
  private readonly state = toSignal(this.state$);

  // Public signals
  shows: Signal<TVShow[]> = computed(
    () =>
      this.state()?.tv_shows?.map(show => ({
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
