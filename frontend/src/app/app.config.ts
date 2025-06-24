import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { NidoTheme } from './shared/components/theme/nido-theme';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: NidoTheme,
        options: {
          darkModeSelector: '.dark', // Hace override de las preferencias de usuario
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng', // Hace que todo conviva
          },
        },
      },
    }),
    provideHttpClient()
  ],
    
};
