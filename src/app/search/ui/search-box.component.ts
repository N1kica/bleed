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
      (ngSubmit)="form.valid && toggle.emit(input.value)"
    >
      <input #input formControlName="search" type="text" />
      <button type="submit" [disabled]="form.invalid">SEARCH</button>
    </form>
  `,
})
export class SearchBoxComponent {
  toggle = output<string>();

  form = new FormGroup({
    search: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
}
