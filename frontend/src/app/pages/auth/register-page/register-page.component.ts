import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profileImageUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';

  constructor(private router: Router) {}

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
    // Validaciones básicas
    if (
      !this.username ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    this.router.navigate(['/create-family']);
  }
}
