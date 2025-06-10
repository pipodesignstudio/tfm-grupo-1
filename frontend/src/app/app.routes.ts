import { Routes } from '@angular/router';

import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { CalendarPageComponent } from './pages/routines/calendar-page/calendar-page.component';
import { WelcomePageComponent } from './public/welcome-page/welcome-page.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent, title: 'Bienvenido a Nido' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
