import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { Status, TVShow } from '../shared/interfaces/tv-show.model';
import { FavoritesService } from '../shared/services/favorites.service';
import { ShowDetailsState } from './interfaces/show.model';

@Injectable()
export class ShowService {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private favs = inject(FavoritesService);

  // selectors:
  show: Signal<TVShow> = computed(() => ({
    ...this.showState().tvShow,
    favorite: this.favs.favorites()?.includes(this.showState().tvShow.id),
  }));

  status: Signal<Status> = computed(() => {
    switch (this.showState().tvShow.id) {
      case undefined:
        return 'no_results';
      case '0':
        return 'loading';
      case '-1':
        return 'error';
      default:
        return 'success';
    }
  });

  // state:
  private url$: Observable<string> = this.route.url.pipe(
    map(seg => `https://www.episodate.com/api/show-details?q=${seg[0].path}`),
  );

  private showState: Signal<ShowDetailsState> = toSignal(
    this.url$.pipe(
      tap(url => console.log(url)),
      switchMap(url => this.http.get<ShowDetailsState>(url)),
      catchError(() => of({ tvShow: { id: '-1' } } as ShowDetailsState)),
    ),
    { initialValue: { tvShow: { id: '0' } } },
  );

  // actions:
  toggleFavorite = (id: string) => this.favs.state$.next(id);
}
