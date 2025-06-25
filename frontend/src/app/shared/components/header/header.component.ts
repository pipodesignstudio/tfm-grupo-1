import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ThemeService } from '../../services';
import { LogoComponent } from '../logo/logo.component';
import { AuthService } from '../../../features/auth/services';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [LogoComponent, ButtonModule],
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
    '/dashboard': 'Home',
    '/calendar': 'Calendario',
    '/child-profile': 'Perfil del niño',
    '/user-profile': 'Mi perfil',
    '/settings': 'Configuración',
    '/settings/edit-profile': 'Editar perfil',
    '/about-us': 'Sobre nosotros',
  };

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const path = event.urlAfterRedirects;
        this.pageTitle = this.routeTitles[path] || '';
      });
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.authService.logOut();
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
