import { Component, inject } from '@angular/core';
import { ShowService } from './show.service';
import { ShowSummaryComponent } from './ui/show-summary.component';

@Component({
  selector: 'app-show',
  imports: [ShowSummaryComponent],
  providers: [ShowService],
  template: `
    <h1>Welcome to TV Show Page!</h1>
    @switch (ss.status()) {
      @case ('loading') {
        loading...
      }
      @case ('success') {
        <app-show-summary
          [show]="ss.show()"
          (toggle)="ss.toggleFavorite($event)"
        />
      }
      @default {
        no results!
      }
    }
  `,
})
export class ShowComponent {
  ss = inject(ShowService);
}
