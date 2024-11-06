import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TVShow } from '../../shared/interfaces/tv-show.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterLink],
  template: `
    <ul>
      @for (show of shows(); track show.id) {
        <li [class]="show.favorite ? 'bg-red-500' : ''">
          <a routerLink="/show/{{ show.id }}">{{ show.name }}</a>
          <button (click)="toggle.emit(show.id)">
            {{ show.favorite ? 'REMOVE' : 'ADD' }}
          </button>
        </li>
      } @empty {
        No results found!
      }
    </ul>
  `,
})
export class SearchResultsComponent {
  shows = input<TVShow[]>();
  toggle = output<string>();
}
