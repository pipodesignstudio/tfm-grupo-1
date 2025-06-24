import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../service/theme.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private location = inject(Location);

  isDarkMode = this.themeService.darkTheme;

  pageTitle: string = '';

  // 👇 Mapa de rutas a títulos personalizados
  private routeTitles: { [key: string]: string } = {
    '/create-family': 'Crear familia',
    '/my-family': 'Mi familia',
    '/dashboard': 'Panel',
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

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
