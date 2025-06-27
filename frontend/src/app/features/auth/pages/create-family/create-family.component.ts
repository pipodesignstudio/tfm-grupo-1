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
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AutoFocusModule } from 'primeng/autofocus';
import { ChildProfile, ChildService } from '../../../../shared/services';
import { Calendar } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

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
    Calendar,
    DropdownModule,
  ],
  templateUrl: './create-family.component.html',
})
export class CreateFamilyComponent implements OnInit {
  childProfileForm!: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  maxDate: Date;

  genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
    { label: 'Prefiero no especificar', value: null },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    @Inject(ChildService) private childService: ChildService
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.childProfileForm = this.fb.group({
      name: ['', Validators.required],
      dob: [null, Validators.required],
      gender: [null],
      heightCm: ['', [Validators.min(1), Validators.max(300)]],
      weightKg: ['', [Validators.min(0.1), Validators.max(200)]],
    });
  }

  get f() {
    return this.childProfileForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.childProfileForm.invalid) {
      this.childProfileForm.markAllAsTouched();
      this.errorMessage =
        'Por favor, rellena los campos obligatorios y corrige los errores.';
      return;
    }

    const newChild: Omit<ChildProfile, 'id'> = {
      ...this.childProfileForm.value,
      profileImageUrl: this.profileImageUrl as string,
    };

    this.childService.addChild(newChild);

    console.log('Niño añadido:', newChild);
    this.router.navigate(['/dashboard/my-family']);
  }
}
