// src/app/pages/public/login-page/login-page.component.ts
import { Component, inject, OnInit } from '@angular/core';
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
import { AutoFocusModule } from 'primeng/autofocus';
import { AuthService, TokenService } from '../../services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  providers: [MessageService],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ButtonModule,
    MessageModule,
    AutoFocusModule,
    ToastModule
  ],
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder) {}

  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public isLoading =  false;

  get f() {
    return this.loginForm.controls;
  }

  async onLogin(): Promise<void> {
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    const response = await this.authService.login(email, password);
    if (response?.token) {
      this.tokenService.setToken(response.token);
      this.router.navigate(['/dashboard']);
    } else {
     this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response?.message || 'Error al iniciar sesión.',
      });
      if (response?.message?.toLocaleLowerCase() === 'credenciales incorrectas.') {
        this.f['password'].reset()
      }
    }
    this.isLoading = false;
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
