import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-family-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    SelectModule
  ],
  templateUrl: './family-form.component.html',
})
export class FamilyFormComponent {
  @Output() guardar = new EventEmitter<{ email: string; rol: string }>();
  @Output() cerrar = new EventEmitter<void>();

  form: FormGroup;

  roles = [
    { label: 'Administrador', value: 'administrador' },
    { label: 'Cuidador', value: 'cuidador' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      rol: [null, Validators.required],
    });
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
