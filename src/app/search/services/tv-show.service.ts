import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { Subject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { State, TVShow, TVShowResultState } from '../interfaces/tv-show.model';
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
  shows: Signal<TVShow[] | undefined> = computed(() =>
    this.searchResultState()?.tv_shows?.map((show) => ({
      ...show,
      favorite: this.favs.favorites()?.includes(show.id),
    })),
  );
  state: Signal<State> = computed(() => {
    switch (this.searchResultState()?.total) {
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

  private searchResultState: Signal<TVShowResultState | undefined> = toSignal(
    this.url$.pipe(
      startWith('https://www.episodate.com/api/search?page=1'),
      switchMap((url) =>
        this.http.get<TVShowResultState>(url).pipe(
          startWith({} as TVShowResultState),
          tap((val) => console.log(val)),
          catchError(() => of({ total: '-1' } as TVShowResultState)),
        ),
      ),
    ),
  );

  // actions:
  toggleFavorite(id: string) {
    this.favs.state$.next(id);
  }
}
