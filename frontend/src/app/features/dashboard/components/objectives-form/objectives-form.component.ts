import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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
  @Input() selectedChildId: number | null = null;

  @Output() guardar = new EventEmitter<{ idNino: number; data: any }>();
  @Output() cerrar = new EventEmitter<number | undefined>();
  @Output() editar = new EventEmitter<{ idNino: number; idObjetivo: number; data: any }>();

  form!: FormGroup;
  editMode = false;
  minDate: Date;

  tipos = [
    { label: 'Salud', value: 'Salud' },
    { label: 'Educación', value: 'Educación' },
    { label: 'Alimentación', value: 'Alimentación' },
    { label: 'Social', value: 'Social' },
    { label: 'Actividades', value: 'Actividades' },
    { label: 'Cuidado Diario', value: 'Cuidado Diario' },
    { label: 'Otros', value: 'Otros' },
  ];

  constructor(private fb: FormBuilder) {
    const now = new Date();
    this.minDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1
    ));
  }

  ngOnChanges(): void {
    this.editMode = !!this.objectiveInfo;
    const fecha = this.objectiveInfo?.fecha_fin;
    const parsedFecha = fecha ? new Date(fecha) : null;

    const defaultChild =
      this.objectiveInfo?.ninos_id ??
      this.selectedChildId ??
      (this.children.length > 0 ? this.children[0].value : null);

    this.form = this.fb.group({
      nombre: [this.objectiveInfo?.nombre ?? '', Validators.required],
      tipo: [this.objectiveInfo?.tipo ?? null, Validators.required],
      color: [this.objectiveInfo?.color ?? '#3b82f6', Validators.required],
      fecha_fin: [parsedFecha],
      ninos_id: [
        {
          value: defaultChild,
          disabled: this.editMode,
        },
        Validators.required,
      ],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { nombre, tipo, color, fecha_fin } = this.form.getRawValue();

    let fechaFinUTC: string | null = null;
    if (fecha_fin) {
      const utcDate = new Date(Date.UTC(
        fecha_fin.getFullYear(),
        fecha_fin.getMonth(),
        fecha_fin.getDate()
      ));
      fechaFinUTC = utcDate.toISOString();
    }

    const data = {
      nombre,
      tipo,
      color,
      fecha_fin: fechaFinUTC,
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
      this.cerrar.emit(idNino);
    }
  }

  cerrarModal(): void {
    const idNino = this.form.getRawValue().ninos_id;
    this.cerrar.emit(idNino ?? undefined);
  }
}
