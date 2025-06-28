import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef, inject, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ChildService } from '../../../shared/services/child.service';
import { FamiliesStore } from '../../../shared/services/familiesStore.service';
import { IChild } from '../../../shared/interfaces';

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
    SelectModule
  ]
})
export class NotesFiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<{
    search: string;
    date: Date | null;
    childId: number | null;
  }>();

  form!: FormGroup;

  filtroOpciones: { label: string; value: number | null }[] = [];

  childService = inject(ChildService);
  familiesStore = inject(FamiliesStore);
  changeDetector = inject(ChangeDetectorRef);

  private familiaEffect = effect(async () => {
    const familia = this.familiesStore.familiaSeleccionada();
    if (!familia) return;

    try {
      const children = await this.childService.getChildrenByFamily(String(familia.id));
      this.filtroOpciones = children.map((child: IChild) => ({
        label: child.nombre,
        value: Number(child.id),
      }));
      this.changeDetector.detectChanges();
    } catch (error) {
      console.error('Error al cargar niños:', error);
    }
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      search: [''],
      date: [null],
      childId: [null]
    });

    this.form.valueChanges.subscribe(value => {
      this.filtersChange.emit(value);
    });
  }

  clearFilters(): void {
    this.form.reset();
  }
}