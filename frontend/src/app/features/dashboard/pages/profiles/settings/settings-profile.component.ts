import { IUser } from './../../../../../shared/interfaces/iuser.interface';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

import { ISettingItem } from '../../../../../shared/interfaces/isetting-item.interface';
import { ThemeService } from '../../../../../shared/services/theme.service';

import { UserFormComponent } from '../../../../../components/user-form/user-form.component';
import { UsersService } from '../../../../../shared/services/users.service';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, InputSwitchModule, UserFormComponent],
  templateUrl: './settings-profile.component.html',
})
export class SettingsComponent {
  private themeService = inject(ThemeService);
    private authService = inject(AuthService);
  
  isDarkMode = this.themeService.darkTheme;

  darkMode = true;
  notifications = true;
  vacationMode = false;

  userService = inject(UsersService);
  userInfo = this.userService.user();

  showUserFormModal = false;

  constructor(
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  logout() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  toggleNotifications() {
    this.notifications = !this.notifications;
    console.log(
      `Notifications are now ${this.notifications ? 'enabled' : 'disabled'}`
    );
  }

  settingsItems: ISettingItem[] = [
    {
      icon: 'pi pi-user',
      label: 'Editar Perfil',
      hasArrow: true,
      onClick: () => this.openUserFormModal(),
    },
    {
      icon: 'pi pi-cog',
      label: 'Familia',
      hasArrow: true,
      onClick: () => this.router.navigate(['dashboard', 'settings-family']),
    },
    {
      icon: 'pi pi-moon',
      label: 'Modo Oscuro',
      hasToggle: true,
      toggleValue: this.darkMode,
      onToggle: () => this.toggleDarkMode(),
    },
    {
      icon: 'pi pi-bell',
      label: 'Notificaciones',
      hasToggle: true,
      toggleValue: this.notifications,
      onToggle: () => this.toggleNotifications(),
    },
  ];

  aboutItems: ISettingItem[] = [
    {
      icon: 'pi pi-star',
      label: 'Calificar Nido',
      hasArrow: true,
      onClick: () =>
        window.open(
          'https://github.com/pipodesignstudio/tfm-grupo-1',
          '_blank'
        ),
    },
    {
      icon: 'pi pi-share-alt',
      label: 'Compartir con Amigos',
      hasArrow: true,
      onClick: () =>
        window.open(
          'https://github.com/pipodesignstudio/tfm-grupo-1',
          '_blank'
        ),
    },
    {
      icon: 'pi pi-info-circle',
      label: 'Sobre Nosotros',
      hasArrow: true,
      onClick: () => this.router.navigate(['dashboard','about-us']),
    },
    {
      icon: 'pi pi-question-circle',
      label: 'Soporte',
      hasArrow: true,
      onClick: () => console.log('Soporte clicked'),
    },
  ];

  openUserFormModal() {
    this.showUserFormModal = true;
  }

  closeUserFormModal() {
    this.showUserFormModal = false;
  }

  editarUsuario(userData: Partial<IUser>) {
    console.log('Usuario editado:', userData);
    this.userService.editUser(userData).then((result) => {
      if (result?.success) {
        console.log('Usuario editado con éxito', result);
        console.log(this.userInfo); // Actualizar la información del usuario
        const img_usuario_editado = userData.img_perfil;
        if (this.userInfo) {
          this.userInfo = {
            ...this.userInfo,
            nick: userData.nick ?? this.userInfo.nick,
            nombre: userData.nombre ?? this.userInfo.nombre,
            apellido: userData.apellido ?? this.userInfo.apellido,
            img_perfil: typeof img_usuario_editado === 'string'
              ? this.base64ToUint8Array(img_usuario_editado)
              : (img_usuario_editado ?? this.userInfo.img_perfil),
          };
        }
        


        this.closeUserFormModal(); // Cerrar el modal después de editar
        this.changeDetector.detectChanges();
      } else {
        console.error('Error al editar el usuario:', result?.message);
      }
    });
  }

  private base64ToUint8Array(data: string): Uint8Array {
    if (!data) return new Uint8Array();
    // Si viene como "data:image/jpeg;base64,....", quita el prefijo
    const base64 = data.includes(',') ? data.split(',')[1] : data;

    const binary = atob(base64); // decodifica Base‑64
    return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  }
}
