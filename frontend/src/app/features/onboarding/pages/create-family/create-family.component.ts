import { Component, Inject, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AutoFocusModule } from 'primeng/autofocus';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { NinosapiService } from '../../../../shared/services/ninosapi.service';

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
    private ninosApi: NinosapiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser')!);

    this.childProfileForm = this.fb.group({
      name: ['', Validators.required],
      apellido: ['', Validators.required],
      dob: [null, Validators.required],
      gender: [null],
      heightCm: [null, [Validators.min(1), Validators.max(300)]],
      weightKg: [null, [Validators.min(0.1), Validators.max(200)]],
    });
    this.perfiles_aprendizaje_id = user.perfiles_aprendizaje_id;
    this.familia_id = user.familia_id;
  }

  get f() {
    return this.childProfileForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    if (this.childProfileForm.invalid) {
      this.childProfileForm.markAllAsTouched();
      this.errorMessage = 'Por favor, rellena los campos obligatorios.';
      this.isLoading = false;
      return;
    }

    const formValue = this.childProfileForm.value;

    const payload = {
      perfiles_aprendizaje_id: this.perfiles_aprendizaje_id,
      familia_id: this.familia_id,
      nombre: formValue.name,
      apellido: formValue.apellido,
      fecha_nacimiento: this.formatDate(formValue.dob),
      genero: formValue.gender || null,
      altura: formValue.heightCm ? Number(formValue.heightCm) : null,
      peso: formValue.weightKg ? Number(formValue.weightKg) : null,
      img_perfil: null, // Si tienes lógica de imagen, ponla aquí
      descripcion: '',
    };

    this.ninosApi.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/onboarding/my-family']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al crear el niño';
      },
    });
  }

  private formatDate(date: Date): string {
    // Devuelve YYYY-MM-DD
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : '';
  }
}
