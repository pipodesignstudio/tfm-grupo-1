import { Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  userEditForm!: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userEditForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        apellido: ['', [Validators.required, Validators.minLength(3)]],
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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { mismatch: true };
    }
    return null;
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
    if (this.userEditForm.invalid) {
      this.userEditForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.userEditForm.value;
    console.log('Registrando usuario:', username, email);

    this.router.navigate(['/create-family']);
  }

}