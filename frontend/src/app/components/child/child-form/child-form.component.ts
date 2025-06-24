import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';


import { IChild } from '../../../shared/interfaces/ichild.interface';

@Component({
  selector: 'app-child-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    DropdownModule,
    SelectModule
  ],
  templateUrl: './child-form.component.html',
  styleUrl: './child-form.component.css',
})
export class ChildFormComponent {
  @Input() childInfo: Partial<IChild> | null = null;
  @Output() guardar = new EventEmitter<Partial<IChild>>();
  @Output() cerrar = new EventEmitter<void>();

  form: FormGroup;
  editMode = false;

  generos = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'Otro', value: 'otro' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: [null],
      descripcion: [''],
      peso: [null],
      altura: [null],
      imgPerfil: [''],
    });
  }

  ngOnInit() {
    if (this.childInfo) {
      this.form.patchValue(this.childInfo);
      this.editMode = true;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.guardar.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
