import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      (confirmPassword.dirty || confirmPassword.touched) &&
      password.value !== confirmPassword.value
    ) {
      return { mismatch: true };
    }
    return null;
  }

  // OPCIONAL: Añadir foto de perfil
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       this.profileImageUrl = reader.result;
  //     };

  //     reader.readAsDataURL(file);
  //   } else {
  //     this.profileImageUrl = null;
  //   }
  // }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrige los errores del formulario.';
      return;
    }

    const { username, email, password } = this.registerForm.value;
    console.log('Registrando usuario:', username, email);

    // Simular un registro exitoso y navegar
    this.router.navigate(['/create-family']);
  }
}
