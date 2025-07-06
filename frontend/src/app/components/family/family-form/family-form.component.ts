import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { IFamiliaUsuario } from '../../../shared/interfaces/ifamily-users.interface';


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

  @Input() familiar: IFamiliaUsuario | null = null;

  @Output() guardar = new EventEmitter<IFamiliaUsuario>();
  @Output() editar = new EventEmitter<IFamiliaUsuario>();
  @Output() eliminar = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  editMode = false;

  form: FormGroup;

  roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Cuidador', value: 'cuidador' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      emailDestinatario: ['', [Validators.required, Validators.email]],
      rol: [null, Validators.required],
    });
  }

  ngOnInit() {

    console.log(this.familiar, 'familiar en el formulario');
  if (this.familiar) {

    console.log("first")
    this.editMode = true;

    // Patch values al formulario
    this.form.patchValue({
      emailDestinatario: this.familiar.usuarios.email,
      rol: this.familiar.rol,
    });

    // Deshabilita el campo email
    this.form.get('emailDestinatario')?.disable();
  } else {
    // Asegúrate de que el campo esté habilitado si no estás en modo edición
    this.form.get('emailDestinatario')?.enable();
  }
}

  onSubmit() {
    if (this.form.valid) {
      if (this.editMode) {
        this.editar.emit(this.form.value);
      } else {
        this.guardar.emit(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
