import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page/register-page.component';
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
import { ObjectivesPageComponent } from './pages/objectives/objectives-page/objectives-page.component';
import { ObjectivesFormComponent } from './pages/objectives/objectives-form/objectives-form.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CreateRoutineComponent } from './create-routine/create-routine.component';
import { Mensaje2Component } from './mensaje2/mensaje2.component';
import { RoutineFormPageComponent } from './pages/routines/routine-form-page/routine-form-page.component';
import { RoutineListPageComponent } from './pages/routines/routine-list-page/routine-list-page.component';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, title: 'Bienvenido a Nido' },
  { path: 'auth', component: AuthLayoutComponent, children: [
    {
      path: 'login', component: LoginPageComponent
    },
    {
      path: 'register', component: RegisterPageComponent
    }, 
    {
      path: '**' , redirectTo: 'login', pathMatch: 'full'
    }
  ]},
  { path: 'message1', component: WelcomePageComponent },
  { path: 'create-family', component: CreateFamilyComponent },
  { path: 'my-family', component: MyFamilyComponent },
  { path: 'message2', component: Mensaje2Component },
  { path: 'create-routine', component: CreateRoutineComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: 'child-profile', component: ChildProfileComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/edit-profile', component: EditProfileComponent },
  { path: 'about-us', component: AboutUsPageComponent },
  { path: 'objectives', component: ObjectivesPageComponent },
  { path: 'objectives-form', component: ObjectivesFormComponent },
  { path: 'routine-form', component: RoutineFormPageComponent },
  { path: 'routine-list', component: RoutineListPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
