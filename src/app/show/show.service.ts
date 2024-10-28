import { Injectable, Signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShowDetailsState, TVShow } from '../shared/interfaces/tv-show.model';
import { FavoritesService } from '../shared/services/favorites.service';

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

  // state:
  private url$: Observable<string> = this.route.url.pipe(
    map((seg) => `https://www.episodate.com/api/show-details?q=${seg[0].path}`),
  );

  private showState: Signal<ShowDetailsState> = toSignal(
    this.url$.pipe(
      tap((url) => console.log(url)),
      switchMap((url) => this.http.get<ShowDetailsState>(url)),
    ),
    { initialValue: { tvShow: { id: '-1' } } },
  );

  // actions:
  toggleFavorite = (id: string) => this.favs.state$.next(id);
}
