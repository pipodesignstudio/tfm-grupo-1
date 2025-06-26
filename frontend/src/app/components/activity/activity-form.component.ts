import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IActivity } from '../../shared/interfaces/iactivity.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { IChild } from '../../shared/interfaces';
import { IFamiliaUsuario } from '../../shared/interfaces/ifamily-users.interface';

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
  @Input() children: IChild[] = [];
  @Input() usersFamily: IFamiliaUsuario[] = [];

  @Output() editar = new EventEmitter<Partial<IActivity>>();
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Partial<IActivity>>();

  isMobile = window.innerWidth < 768;

  editMode = false;

  filtroOpciones: { label: string; value: number | null }[] = [];

  usuariosResponsables: { label: string; value: number | null }[] = [];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        titulo: ['', Validators.required],
        descripcion: [''],
        ninos_id: [null, Validators.required],
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
    this.filtroOpciones = this.children.map((child) => ({
      label: child.nombre,
      value: Number(child.id),
    }));

    this.usuariosResponsables = this.usersFamily.map((user) => ({
      label: user.usuarios.nick,
      value: Number(user.usuarios.id),
    }));

    if (this.actividadInfo) {
      const data = { ...this.actividadInfo };

      // Transformar strings ISO en objetos Date
      data.fecha_realizacion = new Date(data.fecha_realizacion);
      data.hora_inicio = new Date(data.hora_inicio);
      data.hora_fin = new Date(data.hora_fin);

      this.form.get('ninos_id')?.disable();

      this.form.patchValue(data);
      this.editMode = true;
      console.log('values form', this.form.value);
    }
  }

  onSubmit() {
    if (this.editMode) {
      this.editarActividad();
    } else {
      this.guardarEvento();
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
    console.log(this.actividadInfo);
    if (this.form.valid) {
      console.log('Editar actividad:', this.form.value);
      this.editar.emit({
        ...this.form.value,
        id: this.actividadInfo ? this.actividadInfo.id : undefined,
        tipo:
          this.tipo == 'evento'
            ? 'Evento'
            : this.tipo == 'objetivo'
            ? 'Objetivo'
            : undefined,
      });
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
