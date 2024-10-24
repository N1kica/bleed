import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { SearchResultState } from '../interfaces/search-result-page.model';
import { Subject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TVShow } from '../interfaces/tv-show.model';
import { FavoritesService } from '../../shared/services/favorites.service';

@Injectable({
  providedIn: 'root',
})
export class TVShowService {
  private http = inject(HttpClient);
  private favs = inject(FavoritesService);

  // events:
  search$ = new Subject<string>();
  next_page$ = new Subject<void>();
  prev_page$ = new Subject<void>();
  reset$ = new Subject<void>();

  // selectors:
  tvShows: Signal<TVShow[] | undefined> = computed(() =>
    this.searchResultState()?.tv_shows?.map((show) => ({
      ...show,
      favorite: this.favs.favorites()?.includes(show.id),
    })),
  );
  loading: Signal<boolean> = computed(() => !this.tvShows());
  error: Signal<boolean> = computed(
    () => this.searchResultState()?.error === true,
  );
  noResults: Signal<boolean> = computed(
    () => this.searchResultState()?.total === '0',
  );

  // state:
  private url$ = this.search$.pipe(
    map((val) => `https://www.episodate.com/api/search?q=${val}&page=1`),
  );

  private searchResultState: Signal<SearchResultState | undefined> = toSignal(
    this.url$.pipe(
      startWith('https://www.episodate.com/api/search?page=1'),
      switchMap((url) =>
        this.http.get<SearchResultState>(url).pipe(
          startWith({} as SearchResultState),
          tap((val) => console.log(val)),
          catchError(() => of({ error: true } as SearchResultState)),
        ),
      ),
    ),
  );

  // actions:
  toggleFavorite(id: string) {
    this.favs.state$.next(id);
  }
}
