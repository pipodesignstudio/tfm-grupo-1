import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services';
import { LogoComponent } from '../logo/logo.component';
import { AuthService } from '../../../features/auth/services';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, LogoComponent, ButtonModule, PopoverModule],
})
export class HeaderComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);

  isDarkMode = this.themeService.darkTheme;

  pageTitle: string = '';

  // 👇 Mapa de rutas a títulos personalizados
  private routeTitles: { [key: string]: string } = {
    '/create-family': 'Crear familia',
    '/my-family': 'Mi familia',
    '/dashboard': 'Inicio',
    '/dashboard/calendar': 'Calendario',
    '/dashboard/child-profile': 'Perfil del niño',
    '/dashboard/user-profile': 'Mi perfil',
    '/dashboard/settings': 'Configuración',
    '/dashboard/settings/edit-profile': 'Editar perfil',
    '/dashboard/about-us': 'Sobre nosotros',
    '/dashboard/notes': 'Notas',
    '/dashboard/objectives': 'Objetivos',
    '/dashboard/downloads': 'Descargas',
  };

  currentPath: string = '';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.urlAfterRedirects;
        this.pageTitle = this.routeTitles[this.currentPath] || '';
      });
  }

  isOnRoute(path: string): boolean {
    return this.currentPath === path;
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }

  goToProfile() {
    console.log('Navegando a perfil');
    this.router.navigate(['/dashboard/user-profile']);
  }

  goToHome() {
  this.router.navigate(['/dashboard']);
 }
 
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  goToSettings() {
    this.router.navigate(['/dashboard/settings']);
  }

  goToAboutUs() {
  this.router.navigate(['/dashboard/about-us']);
 }
 goToDownloads() {
  this.router.navigate(['/dashboard/downloads']);
 }

}
