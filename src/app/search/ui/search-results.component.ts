import { NgStyle } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TVShow } from '../interfaces/tv-show.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [NgStyle],
  template: `
    <ul>
      @for (show of shows(); track show.id) {
        <li [ngStyle]="{ 'background-color': show.favorite ? 'red' : '' }">
          {{ show.name }}
          <button (click)="toggle.emit(show.id)">
            {{ show.favorite ? 'REMOVE' : 'ADD' }}
          </button>
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class SearchResultsComponent {
  shows = input<TVShow[]>();
  toggle = output<string>();
}
