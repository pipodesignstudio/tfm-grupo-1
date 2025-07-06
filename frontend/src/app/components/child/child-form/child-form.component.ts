import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';


import { IChild } from '../../../shared/interfaces/ichild.interface';

@Component({
  selector: 'app-child-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    DropdownModule,
  ],
  templateUrl: './child-form.component.html',
  styleUrl: './child-form.component.css',
})
export class ChildFormComponent {
  @Input() childInfo: Partial<IChild> | null = null;
  @Output() addChild = new EventEmitter<Partial<IChild>>();
  @Output() cerrar = new EventEmitter<void>();

  childProfileForm: FormGroup;
  editMode = false;

  errorMessage: string | null = null;

  genderOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
  ];

  maxDate: Date = new Date(); // para evitar fechas futuras

  constructor(private fb: FormBuilder) {
    this.childProfileForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero: [null],
      altura: [null, [Validators.min(1), Validators.max(300)]],
      peso: [null, [Validators.min(0.1), Validators.max(200)]],
    });
  }

  ngOnInit() {
    if (this.childInfo) {
      this.childProfileForm.patchValue(this.childInfo);
      this.editMode = true;
    }
  }

  get f() {
    return this.childProfileForm.controls;
  }

  onSubmit() {
  if (this.childProfileForm.valid) {
    this.addChild.emit(this.childProfileForm.value);
    this.errorMessage = null;
  } else {
    this.errorMessage = 'Por favor, corrige los errores antes de continuar.';
    this.childProfileForm.markAllAsTouched();
  }
}

  cerrarModal() {
    this.cerrar.emit();
  }
}
