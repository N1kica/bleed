import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [],
  template: `
    <input #input (keydown.enter)="toggle.emit(input.value)" type="text" />
    <button (click)="toggle.emit(input.value)">SEARCH</button>
  `,
  styles: ``,
})
export class SearchBoxComponent {
  toggle = output<string>();
}
