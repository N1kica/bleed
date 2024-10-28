import { NgStyle } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TVShow } from '../../shared/interfaces/tv-show.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [NgStyle, RouterLink],
  template: `
    <ul>
      @for (show of shows(); track show.id) {
        <li [ngStyle]="{ 'background-color': show.favorite ? 'red' : '' }">
          <a routerLink="/show/{{ show.id }}">{{ show.name }}</a>
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
