import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to TV Show Page!</h1>
    <p>id: {{ id() ?? 'not found' }}</p>
  `,
  styles: ``,
})
export class ShowComponent {
  id = input<string>();
}
