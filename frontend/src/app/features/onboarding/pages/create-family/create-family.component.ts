import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ChildService } from '../../../../shared/services/child.service';
import { FamilyService } from '../../../../shared/services/family.service';
import { AutoFocusModule } from 'primeng/autofocus';
import { UsersService } from '../../../../shared/services';

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
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './create-family.component.html',
})
export class CreateFamilyComponent {
  private familyService = inject(FamilyService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
    private readonly usersService = inject(UsersService);

  public currentUser$ = computed(() => this.usersService.user());

  familyForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(3)]],
    
  })

  isLoading = false;

  async onSubmit() {
    this.isLoading = true;
    const { description } = this.familyForm.value;
    const response = await this.familyService.createFamily(description!);
    if (response?.data) {
      this.router.navigate(['onboarding', 'create-nino']);
    }
    this.isLoading = false;
    }

}
