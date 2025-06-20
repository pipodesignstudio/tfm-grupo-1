import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IActivity } from '../../interfaces/iactivity.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { UbicacionComponent } from '../ubicacion/ubicacion.component';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    DatePickerModule,
    DropdownModule,
    UbicacionComponent,
    ColorPickerModule,
    TextareaModule,
    InputTextModule,
  ],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.css',
})
export class ActivityFormComponent {
  @Input() actividadInfo: IActivity | null = null;
  @Input() tipo: 'evento' | 'objetivo' | 'rutina' | null = null;

  @Output() editar = new EventEmitter<Partial<IActivity>>();
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Partial<IActivity>>();

  isMobile = window.innerWidth < 768;

  editMode = false;

  filtroOpciones = [
    { label: 'Selecciona Niño', value: null },
    { label: 'Lucas', value: 1 },
    { label: 'Sofía', value: 2 },
  ];
  usuariosResponsables = [
    { label: 'Selecciona Usuario', value: null },
    { label: 'Usuario 1', value: 1 },
    { label: 'Usuario 2', value: 2 },
    { label: 'Usuario 3', value: 3 },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        titulo: ['', Validators.required],
        descripcion: [''],
        nino_id: [null, Validators.required],
        fecha_realizacion: ['', Validators.required],
        hora_inicio: ['', Validators.required],
        hora_fin: ['', Validators.required],
        usuario_responsable: [null, Validators.required],
        color: ['#7c3aed'],
        tipo: [this.tipo],
        ubicacion: [null],
      },
      {
        validators: this.validarHoras,
      }
    );
  }

  ngOnInit() {
    if (this.actividadInfo) {
      this.form.patchValue(this.actividadInfo);
      this.editMode = true;
    }
  }

  onSubmit() {
    if (this.editMode) {
      this.guardarEvento();
    } else {
      this.editarActividad();
    }
  }

  validarHoras(group: FormGroup) {
    const inicio = group.get('hora_inicio')?.value;
    const fin = group.get('hora_fin')?.value;
    if (inicio && fin && inicio >= fin) {
      return { horaInvalida: true };
    }
    return null;
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  editarActividad() {
    if (this.form.valid) {
      this.editar.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }

  guardarEvento() {
    if (this.form.valid) {
      this.guardar.emit({
        ...this.form.value,
        tipo: 'Evento',
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
