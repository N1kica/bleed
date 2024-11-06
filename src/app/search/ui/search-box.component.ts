import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="form.valid && search.emit('q=' + searchQuery.value + '&')"
      aria-labelledby="searchBoxLabel"
    >
      <label id="searchBoxLabel" for="searchQuery" class="sr-only">
        Search
      </label>

      <input
        #searchQuery
        id="searchQuery"
        formControlName="search"
        type="text"
        placeholder="Example"
        aria-required="true"
        [attr.aria-invalid]="form.controls['search'].invalid"
      />

      <button type="submit" [disabled]="form.invalid" aria-label="Search">
        SEARCH
      </button>
    </form>
  `,
})
export class SearchBoxComponent {
  search = output<string>();

  form = new FormGroup({
    search: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
}
