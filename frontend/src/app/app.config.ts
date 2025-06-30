import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { NidoTheme } from './shared/components/theme/nido-theme';
import { provideHttpClient } from '@angular/common/http';

// Definir la app en castellano
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';

import { LOCALE_ID } from '@angular/core';
import { primengTranslation } from './shared/translations/primeng.translation';

registerLocaleData(localeEs, 'es-ES', localeEsExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
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
      translation: primengTranslation,
    }),
    provideHttpClient()
  ],
    
};
