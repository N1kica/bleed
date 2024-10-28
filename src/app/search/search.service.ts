import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { Subject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Status,
  TVShow,
  SearchState,
} from '../shared/interfaces/tv-show.model';
import { FavoritesService } from '../shared/services/favorites.service';

@Injectable()
export class SearchService {
  private http = inject(HttpClient);
  private favs = inject(FavoritesService);

  // events:
  search$ = new Subject<string>();
  next_page$ = new Subject<void>();
  prev_page$ = new Subject<void>();
  reset$ = new Subject<void>();

  // selectors:
  shows: Signal<TVShow[] | undefined> = computed(() =>
    this.searchState()?.tv_shows?.map((show) => ({
      ...show,
      favorite: this.favs.favorites()?.includes(show.id),
    })),
  );

  status: Signal<Status> = computed(() => {
    switch (this.searchState()?.total) {
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

  // state:
  private url$ = this.search$.pipe(
    map((val) => `https://www.episodate.com/api/search?q=${val}&page=1`),
  );

  private searchState: Signal<SearchState | undefined> = toSignal(
    this.url$.pipe(
      startWith('https://www.episodate.com/api/search?page=1'),
      switchMap((url) =>
        this.http.get<SearchState>(url).pipe(
          startWith({} as SearchState),
          tap((val) => console.log(val)),
          catchError(() => of({ total: '-1' } as SearchState)),
        ),
      ),
    ),
  );

  // actions:
  public toggleFavorite = (id: string) => this.favs.state$.next(id);
}
