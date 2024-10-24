import { Component, inject } from '@angular/core';
import { TVShowService } from './services/tv-show.service';
import { SearchBoxComponent } from './ui/search-box.component';
import { SearchResultsComponent } from './ui/search-results.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBoxComponent, SearchResultsComponent],
  template: `
    <h1>Welcome to Search Page!</h1>

    <app-search-box (toggle)="tvs.search$.next($event)" />

    @switch (tvs.status()) {
      @case ('loading') {
        loading...
      }

      @case ('no_results') {
        No results found!
      }

      @case ('success') {
        <app-search-results
          [shows]="tvs.shows()"
          (toggle)="tvs.toggleFavorite($event)"
        />
      }

      @case ('error') {
        Error!
      }
    }
  `,
  styles: ``,
})
export class SearchComponent {
  public tvs = inject(TVShowService);
}
