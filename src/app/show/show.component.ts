import { Component, inject } from '@angular/core';
import { ShowService } from './show.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [NgStyle],
  providers: [ShowService],
  template: `
    <h1>Welcome to TV Show Page!</h1>
    <ul>
      <li [ngStyle]="{ 'background-color': ss.show().favorite ? 'red' : '' }">
        name: {{ ss.show().name ?? 'not found' }}
        <button (click)="ss.toggleFavorite(ss.show().id)">
          {{ ss.show().favorite ? 'REMOVE' : 'ADD' }}
        </button>
      </li>
    </ul>
  `,
  styles: ``,
})
export class ShowComponent {
  ss = inject(ShowService);
}
