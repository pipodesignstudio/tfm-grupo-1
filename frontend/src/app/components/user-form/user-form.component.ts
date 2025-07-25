import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { ThemeService } from '../../shared/services/theme.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    DatePickerModule,
    DropdownModule,
    MessageModule,
    ColorPickerModule,
    TextareaModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  @Input() userInfo: any = null;
  @Input() tipo: 'login' | 'register' | 'edit' | null = null;

  @Output() login = new EventEmitter<any>();
  @Output() register = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<void>();

  form!: FormGroup;
  profileImageUrl: string | null = null;

  private themeService = inject(ThemeService);
  isDarkMode = this.themeService.darkTheme;
  imgFromDB: boolean = false;
  base64String: string = '';

  constructor(
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.createForm();
    if (this.tipo === 'edit' && this.userInfo) {
      console.log(this.userInfo);
      this.form.patchValue(this.userInfo);
      this.form.get('email')?.disable();
      if(this.userInfo.img_perfil) {
        this.imgFromDB = true;
      }
      this.profileImageUrl = this.userInfo.img_perfil;
    }
  }

  createForm() {
    const base = {
      email: ['', [Validators.required, Validators.email]],
    };

    const loginExtras = {
      password: ['', [Validators.required, Validators.minLength(6)]],
    };

    const registerExtras = {
      nick: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required],
    };

    const editExtras = {
      nick: ['', [Validators.required, Validators.minLength(3)]],
      nombre: [''],
      apellido: [''],
      img_perfil: [null],
    };

    let groupConfig: any = base;
    if (this.tipo === 'login') {
      groupConfig = { ...base, ...loginExtras };
    }

    if (this.tipo === 'register') {
      groupConfig = { ...registerExtras, ...base };
    }

    if (this.tipo === 'edit') {
      groupConfig = { ...editExtras, ...base };
    }

    this.form = this.fb.group(groupConfig, {
      validators: this.tipo !== 'login' ? this.passwordsMatch : null,
    });
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = { ...this.form.value };

    if(this.tipo === 'edit' && this.imgFromDB) {
      value.img_perfil = this.base64String;
    }

    if (this.tipo === 'login') {
      this.login.emit(value);
    } else if (this.tipo === 'register') {
      delete value.confirmPassword;
      this.register.emit(value);
    } else if (this.tipo === 'edit') {
      console.log('value', value);
      this.edit.emit(value);
    }
  }

  onFileSelected(event: Event) {
    this.imgFromDB = false;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string;

        const base64Data = (reader.result as string).split(',')[1];
        this.form.patchValue({ img_perfil: base64Data });
        this.changeDetector.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  formatImgPerfil(img: string | Uint8Array | null | undefined): SafeUrl | null {
    if (!img) return null;

    const byteArray = Object.values(img) as number[];
    const uint8Array = new Uint8Array(byteArray);
    this.base64String = btoa(String.fromCharCode(...uint8Array));
    const imgURL = `data:image/jpeg;base64,${this.base64String}`;
    return this.sanitizer.bypassSecurityTrustUrl(imgURL);
  }

  cerrarModal() {
    this.cerrar.emit();
  }
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
