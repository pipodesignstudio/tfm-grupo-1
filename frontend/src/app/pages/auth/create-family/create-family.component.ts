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
import { ChildService, ChildProfile } from '../../../service/child.service';

@Component({
  selector: 'app-create-family',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-family.component.html',
  styleUrl: './create-family.component.css',
})
export class CreateFamilyComponent implements OnInit {
  childProfileForm!: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  maxDate: string;

  genderOptions = [
    { value: 'male', viewValue: 'Masculino' },
    { value: 'female', viewValue: 'Femenino' },
    { value: 'other', viewValue: 'Otro' },
    { value: null, viewValue: 'Prefiero no especificar' },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    @Inject(ChildService) private childService: ChildService
  ) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.childProfileForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      gender: [null],
      heightCm: ['', [Validators.min(1), Validators.max(300)]],
      weightKg: ['', [Validators.min(0.1), Validators.max(200)]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.profileImageUrl = reader.result;
      };

      reader.readAsDataURL(file);
    } else {
      this.profileImageUrl = null;
    }
  }

  onSubmit(): void {
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
