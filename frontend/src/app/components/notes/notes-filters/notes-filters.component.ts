import {
  Component,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  standalone: true,
  selector: 'app-notes-filters',
  templateUrl: './notes-filters.component.html',
  styleUrls: ['./notes-filters.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
  ]
})
export class NotesFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<{
    search: string;
    date: Date | null;
  }>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      search: [''],
      date: [null],
    });

    this.form.valueChanges.subscribe(value => {
      this.filtersChange.emit(value);
    });
  }

  clearFilters(): void {
    this.form.patchValue({
      search: '',
      date: null,
    });
  }
}
