import { Component, inject } from '@angular/core';
import { ShowSummaryComponent } from './ui/show-summary.component';
import { ShowStore } from './show.store';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [ShowSummaryComponent],
  providers: [ShowStore],
  template: `
    <h1>Welcome to TV Show Page!</h1>
    @switch (store.status()) {
      @case ('loading') {
        loading...
      }
      @case ('success') {
        <app-show-summary
          [show]="store.show()"
          (toggle)="store.favorite($event)"
        />
      }
      @default {
        no results!
      }
    }
  `,
})
export class ShowComponent {
  store = inject(ShowStore);
}
