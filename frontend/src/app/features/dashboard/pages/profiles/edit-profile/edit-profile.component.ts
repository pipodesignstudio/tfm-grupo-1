import { Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from "../../../../../components/user-form/user-form.component";
import { UsersService } from '../../../../../shared/services/users.service';
@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule, UserFormComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  userEditForm!: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';

userService = inject(UsersService);
  user = this.userService.user();

  constructor(private router: Router, private fb: FormBuilder) {}
ngOnInit() {
    console.log("user info", this.user);
  }
  
  editarUsuario( userData: any ) {
    console.log('Usuario editado:', userData);
  }
}