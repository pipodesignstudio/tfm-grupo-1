import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ThemeService } from '../../services';
import { LogoComponent } from '../logo/logo.component';
import { AuthService } from '../../../features/auth/services';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, LogoComponent, ButtonModule, OverlayPanelModule],
})
export class HeaderComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private location = inject(Location);
  private authService = inject(AuthService);

  isDarkMode = this.themeService.darkTheme;

  pageTitle: string = '';

  // 👇 Mapa de rutas a títulos personalizados
  private routeTitles: { [key: string]: string } = {
    '/create-family': 'Crear familia',
    '/my-family': 'Mi familia',
    '/dashboard': 'Inicio',
    '/calendar': 'Calendario',
    '/child-profile': 'Perfil del niño',
    '/dashboard/user-profile': 'Mi perfil',
    '/dashboard/settings': 'Configuración',
    '/dashboard/settings/edit-profile': 'Editar perfil',
    '/dashboard/about-us': 'Sobre nosotros',
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

  goBack() {
    this.location.back();
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/']); // DANI: Redirige después del logout
  }
  goToHome() {
  this.router.navigate(['/dashboard']);
 }
  goToProfile() {
  this.router.navigate(['/dashboard/user-profile']);
 }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  goToSettings() {
  this.router.navigate(['/dashboard/settings']);
  }

  goToDashboard() {
  this.router.navigate(['/dashboard']);
 }

  goToAboutUs() {
  this.router.navigate(['/dashboard/about-us']);
 }

}
