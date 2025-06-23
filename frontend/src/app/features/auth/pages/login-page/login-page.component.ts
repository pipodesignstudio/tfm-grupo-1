// src/app/pages/public/login-page/login-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ButtonModule,
    MessageModule
  ],
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onLogin(): void {
    this.errorMessage = '';


    const { email, password } = this.loginForm.value;
    console.log('Intentando iniciar sesión con:', email, password);

    if (email === 'test@example.com' && password === 'password123') {
      console.log('Inicio de sesión exitoso!');
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } else {
      console.log('Credenciales incorrectas.');
      this.errorMessage = 'El email o la contraseña son incorrectos.';
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
