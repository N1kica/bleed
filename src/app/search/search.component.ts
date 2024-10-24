import { Component, inject } from '@angular/core';
import { TVShowService } from './services/tv-show.service';
import { AsyncPipe, NgStyle } from '@angular/common';
import { SearchBoxComponent } from './ui/search-box.component';
import { SearchResultsComponent } from './ui/search-results.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe, NgStyle, SearchBoxComponent, SearchResultsComponent],
  template: `
    <h1>Welcome to Search Page!</h1>

    <app-search-box (toggle)="tvs.search$.next($event)" />

    @if (tvs.loading()) {
      loading...
    }

    @if (tvs.noResults()) {
      No results found!
    }

    <app-search-results
      [shows]="tvs.tvShows()"
      (toggle)="tvs.toggleFavorite($event)"
    />

    @if (tvs.error()) {
      Error!
    }
  `,
  styles: ``,
})
export class SearchComponent {
  public tvs = inject(TVShowService);
}
