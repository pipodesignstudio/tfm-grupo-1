import { IUser } from './../../../../../shared/interfaces/iuser.interface';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

import { ISettingItem } from '../../../../../shared/interfaces/isetting-item.interface';
import { ThemeService } from '../../../../../shared/services/theme.service';

import { UserFormComponent } from '../../../../../components/user-form/user-form.component';
import { UsersService } from '../../../../../shared/services/users.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, InputSwitchModule, UserFormComponent],
  templateUrl: './settings-profile.component.html',
})
export class SettingsComponent {
  private themeService = inject(ThemeService);
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
    console.log('Logging out...');
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
      onClick: () => this.router.navigate(['/about-us']),
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
        this.closeUserFormModal(); // Cerrar el modal después de editar
        console.log('Usuario editado con éxito', result);
        this.closeUserFormModal(); // Cerrar el modal después de editar
        console.log(this.userInfo); // Actualizar la información del usuario
        if (this.userInfo) {
          this.userInfo = {
            ...this.userInfo,
            nick: userData.nick ?? this.userInfo.nick,
            nombre: userData.nombre ?? this.userInfo.nombre,
            apellido: userData.apellido ?? this.userInfo.apellido,
          };
        }
        this.changeDetector.detectChanges(); // Asegurarse de que los cambios se reflejen en la vista
      } else {
        console.error('Error al editar el usuario:', result?.message);
      }
    });
  }
}
