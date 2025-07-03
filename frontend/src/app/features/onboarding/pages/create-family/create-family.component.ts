import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AutoFocusModule } from 'primeng/autofocus';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ChildService } from '../../../../shared/services/child.service';

@Component({
  selector: 'app-create-family',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    RouterModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    AutoFocusModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './create-family.component.html',
})
export class CreateFamilyComponent implements OnInit {
  childProfileForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  perfiles_aprendizaje_id!: number;
  familia_id!: number;

  maxDate: Date = new Date();

  genderOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
  ];

  constructor(
    private fb: FormBuilder,
    private childService: ChildService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.familia_id = Number(localStorage.getItem('familia_id'));

    this.childProfileForm = this.fb.group({
      name: ['', Validators.required],
      apellido: ['', Validators.required],
      dob: [null, Validators.required],
      gender: [null],
      heightCm: [null, [Validators.min(1), Validators.max(300)]],
      weightKg: [null, [Validators.min(0.1), Validators.max(200)]],
    });
  }

  get f() {
    return this.childProfileForm.controls;
  }

  async onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    if (this.childProfileForm.invalid) {
      this.childProfileForm.markAllAsTouched();
      this.errorMessage = 'Por favor, rellena los campos obligatorios.';
      this.isLoading = false;
      return;
    }

    const formValue = this.childProfileForm.value;

    // Asigna el valor por defecto a perfiles_aprendizaje_id (puedes cambiarlo según tu lógica)
    const payload = {
      perfiles_aprendizaje_id: 1,
      familia_id: this.familia_id,
      nombre: formValue.name,
      apellido: formValue.apellido,
      fecha_nacimiento: this.formatDate(formValue.dob),
      genero: formValue.gender || null,
      altura: formValue.heightCm ? Number(formValue.heightCm) : null,
      peso: formValue.weightKg ? Number(formValue.weightKg) : null,
      img_perfil: null,
      descripcion: '',
    };

    try {
      await this.childService.addChild(payload);
      this.isLoading = false;
      this.router.navigate(['/onboarding/my-family']);
    } catch (err: any) {
      this.isLoading = false;
      this.errorMessage =
        err?.response?.data?.message || 'Error al crear el niño';
    }
  }

  private formatDate(date: Date): string {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : '';
  }
}
