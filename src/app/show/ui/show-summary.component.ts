import { Component, input, output } from '@angular/core';
import { TVShow } from '../../shared/interfaces/tv-show.model';

@Component({
  selector: 'app-show-summary',
  imports: [],
  template: `
    <ul>
      <li [class]="show().favorite ? 'bg-red-500' : ''">
        name: {{ show().name ?? 'not found' }}
        <button (click)="toggle.emit(show().id)">
          {{ show().favorite ? 'REMOVE' : 'ADD' }}
        </button>
      </li>
      <li>desc: {{ show().description }}</li>
      <li>rating: {{ show().rating }}</li>
    </ul>
  `,
})
export class ShowSummaryComponent {
  show = input.required<TVShow>();
  toggle = output<string>();
}
