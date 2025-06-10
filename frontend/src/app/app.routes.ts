import { Routes } from '@angular/router';

import { LandinPageComponent } from './public/landin-page/landin-page.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { CalendarPageComponent } from './pages/routines/calendar-page/calendar-page.component';
import { WelcomePageComponent } from './public/welcome-page/welcome-page.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent, title: 'Bienvenido a Nido' },
  { path: 'home', component: LandinPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
