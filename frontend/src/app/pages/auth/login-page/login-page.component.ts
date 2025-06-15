import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    // --- LÓGICA DE AUTENTICACIÓN REAL PARA TEST ---
    if (email === 'test@nido.com' && password === 'password123') {
      console.log('Login exitoso!');
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Email o contraseña incorrectos.';
    }
  }

  errorMessage: string = '';

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
