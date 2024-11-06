import { Component, inject } from '@angular/core';
import { SearchBoxComponent } from './ui/search-box.component';
import { SearchResultsComponent } from './ui/search-results.component';
import { SearchStore } from './search.store';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBoxComponent, SearchResultsComponent],
  providers: [SearchStore],
  template: `
    <h1>Welcome to Search Page!</h1>

    <app-search-box (toggle)="store.search($event)" />

    @switch (store.status()) {
      @case ('loading') {
        loading...
      }

      @case ('success') {
        <app-search-results
          [shows]="store.shows()"
          (toggle)="store.favorite($event)"
        />
      }

      @case ('error') {
        Error!
      }
    }
  `,
})
export class SearchComponent {
  public store = inject(SearchStore);
}
