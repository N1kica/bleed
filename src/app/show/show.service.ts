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

  // Action creators
  readonly actions = {
    favorite: (id: string) => this.favs.update(id),
  } as const;

  // State management using RxJS
  private state$: Observable<ShowDetailsState> = this.route.url.pipe(
    map((seg) => `https://www.episodate.com/api/show-details?q=${seg[0].path}`),
    tap((url) => console.log(url)),
    switchMap((url) => this.http.get<ShowDetailsState>(url)),
    catchError(() => of({ tvShow: { id: '-1' } } as ShowDetailsState)),
  );

  // Private signal selector
  private readonly state = toSignal(this.state$, {
    initialValue: { tvShow: { id: '0' } },
  });

  // Public signals
  show: Signal<TVShow> = computed(() => ({
    ...this.state().tvShow,
    favorite: this.favs.favorites()?.includes(this.state().tvShow.id),
  }));

  status: Signal<Status> = computed(() => {
    switch (this.state().tvShow.id) {
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
}
