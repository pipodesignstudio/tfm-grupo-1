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
  selector: 'app-message1',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ButtonModule,
    MessageModule,
    AutoFocusModule,
    ToastModule,
  ],
  templateUrl: './message1.component.html',
})
export class Message1Component {
  constructor(private router: Router) {}

  continueToCreateFamily(): void {
    this.router.navigate(['/auth/create-family']);
  }
}
