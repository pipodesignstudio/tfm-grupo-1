import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { AutoFocusModule } from 'primeng/autofocus';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login-form-popup',
  imports: [CommonModule, FormsModule,  InputTextModule, AutoFocusModule, MessageModule, PasswordModule,  ReactiveFormsModule, ToastModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './login-form-popup.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormPopupComponent { 
  @Input({required: true}) email!: string;
  @Output() onNewToken = new EventEmitter<string>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  errorMessage: string = '';
  public isLoading =  false;

  get f() {
    return this.loginForm.controls;
  }

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.loginForm.get('email')?.setValue(this.email);
  }

  async handleSubmit() {
    const { email, password } = this.loginForm.value;
    
    try {
      const response = await this.authService.login(email!, password!);
      if (!response?.token) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.message || 'Error al iniciar sesión' });
        return;
      }
      this.onNewToken.emit(response.token);
    } catch (error: any) {
      console.error('Error logging in', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al iniciar sesión' });
    }
  }

  
}
