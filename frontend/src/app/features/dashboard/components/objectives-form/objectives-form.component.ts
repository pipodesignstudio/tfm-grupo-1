import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
  selector: 'app-objectives-form',
  standalone: true,
  templateUrl: './objectives-form.component.html',
  styleUrls: ['./objectives-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    CalendarModule,
    ButtonModule,
    ColorPickerModule,
    DatePickerModule
  ],
})
export class ObjectivesFormComponent implements OnChanges {
  @Input() objectiveInfo: any = null;
  @Input() children: { label: string; value: number }[] = [];

  @Output() guardar = new EventEmitter<{ idNino: number; data: any }>();
  @Output() cerrar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<{ idNino: number; idObjetivo: number; data: any }>();

  form!: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    this.editMode = !!this.objectiveInfo;

    const defaultChild = this.children.length > 0 ? this.children[0].value : null;

    const fecha = this.objectiveInfo?.fecha_fin;
    const parsedFecha = fecha ? new Date(fecha) : null;

    this.form = this.fb.group({
      nombre: [this.objectiveInfo?.nombre ?? '', Validators.required],
      tipo: [this.objectiveInfo?.tipo ?? '', Validators.required],
      color: [this.objectiveInfo?.color ?? '#3b82f6', Validators.required],
      fecha_fin: [parsedFecha],
      ninos_id: [
        {
          value: this.objectiveInfo?.ninos_id ?? defaultChild,
          disabled: this.editMode,
        },
        Validators.required,
      ],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { nombre, tipo, color, fecha_fin } = this.form.getRawValue(); // getRawValue para incluir campos deshabilitados
    const data = {
      nombre,
      tipo,
      color,
      fecha_fin: fecha_fin ? new Date(fecha_fin).toISOString() : null,
    };

    const idNino = this.form.getRawValue().ninos_id;

    if (this.editMode && this.objectiveInfo) {
      this.editar.emit({
        idNino: this.objectiveInfo.ninos_id,
        idObjetivo: this.objectiveInfo.id,
        data,
      });
    } else {
      this.guardar.emit({ idNino, data: { ...data, ninos_id: idNino } });
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
