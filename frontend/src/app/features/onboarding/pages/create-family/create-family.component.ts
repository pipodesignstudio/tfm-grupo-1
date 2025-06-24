import { Component, OnInit, Inject } from '@angular/core';
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
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ChildProfile, ChildService } from '../../../../shared/services/child.service';

@Component({
  selector: 'app-create-family',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './create-family.component.html',
  styleUrl: './create-family.component.css',
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

  // OPCIONAL: Añadir foto de perfil niño
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
    this.router.navigate(['/my-family']);
  }
}
