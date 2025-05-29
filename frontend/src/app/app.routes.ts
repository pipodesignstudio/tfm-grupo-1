import { Routes } from '@angular/router';

import { LandinPageComponent } from './pages/public/landin-page/landin-page.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { CalendarPageComponent } from './pages/routines/calendar-page/calendar-page.component';

export const routes: Routes = [
    {path: "", pathMatch: "full", component: LandinPageComponent},
    {path: "login", component: LoginPageComponent},
    {path: "register", component: RegisterPageComponent},
    {path: "calendar", component: CalendarPageComponent},
    {path: "**", redirectTo: "", pathMatch: "full"}
];;
