import { Component, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-create-activity',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, ReactiveFormsModule, DatePickerModule, DropdownModule, UbicacionComponent,ColorPickerModule,TextareaModule, InputTextModule],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.css',
})
export class CreateActivityComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Partial<IActivity>>();



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
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      nino_id: [null, Validators.required],
      fecha_realizacion: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      usuario_responsable: [null, Validators.required],
      color: ['#7c3aed'],
      tipo: ['Evento'],
      ubicacion: [null],
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarEvento() {
    if (this.form.valid) {
      this.guardar.emit({
        ...this.form.value,
        tipo: 'Evento',
        id_nino: 0, // Puedes ajustarlo si es dinámico
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
