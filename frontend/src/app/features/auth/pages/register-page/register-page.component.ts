import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
import { AuthService } from '../../services';
import { RegisterDto } from '../../interfaces';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  standalone: true,
  providers: [MessageService],
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
  ],
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  public isLoading: boolean = false;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
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

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password } = this.registerForm.value;
    const dto: RegisterDto = { nick: username, email, contrasena: password };

    const response = await this.authService.register(dto);
    this.isLoading = false;

    if (!response?.data) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response?.message ?? 'Error al registrar',
      });
      return;
    }

    this.router.navigate([`auth/verificar/${dto.email}`]);
  }
}
