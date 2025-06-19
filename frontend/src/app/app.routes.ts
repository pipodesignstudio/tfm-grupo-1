import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { CalendarPageComponent } from './pages/routines/calendar-page/calendar-page.component';
import { WelcomePageComponent } from './public/welcome-page/welcome-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page/dashboard-page.component';
import { CreateFamilyComponent } from './pages/auth/create-family/create-family.component';
import { UserProfileComponent } from './pages/profiles/user-profile/user-profile.component';
import { ChildProfileComponent } from './pages/profiles/child-profile/child-profile.component';
import { SettingsComponent } from './pages/profiles/settings/settings-profile.component';
import { MyFamilyComponent } from './pages/auth/my-family/my-family.component';
import { AboutUsPageComponent } from './pages/others/about-us-page/about-us-page.component';
import { EditProfileComponent } from './pages/profiles/edit-profile/edit-profile.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent, title: 'Bienvenido a Nido' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'create-family', component: CreateFamilyComponent },
  { path: 'my-family', component: MyFamilyComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: 'child-profile', component: ChildProfileComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/edit-profile', component: EditProfileComponent },
  { path: 'about-us', component: AboutUsPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
