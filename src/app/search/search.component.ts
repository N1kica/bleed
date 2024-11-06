import { Component, inject } from '@angular/core';
import { SearchService } from './search.service';
import { SearchBoxComponent } from './ui/search-box.component';
import { SearchResultsComponent } from './ui/search-results.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBoxComponent, SearchResultsComponent],
  providers: [SearchService],
  template: `
    <h1>Welcome to Search Page!</h1>

    <app-search-box (search)="tvs.actions.search($event)" />

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
          (toggle)="tvs.actions.favorite($event)"
        />
      }

      @case ('error') {
        Error!
      }
    }
  `,
})
export class SearchComponent {
  public tvs = inject(SearchService);
}
