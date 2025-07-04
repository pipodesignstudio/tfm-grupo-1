import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page/register-page.component';
import { CalendarPageComponent } from './features/dashboard/pages/routines/calendar-page/calendar-page.component';
import { CreateFamilyComponent } from './features/onboarding/pages/create-family/create-family.component';
import { ChildProfileComponent } from './features/dashboard/pages/profiles/child-profile/child-profile.component';
import { AboutUsPageComponent } from './features/dashboard/pages/about-us-page/about-us-page.component';
import { ObjectivesPageComponent } from './features/dashboard/pages/objectives-page/objectives-page.component';
import { ObjectivesFormComponent } from './features/dashboard/components/objectives-form/objectives-form.component';
import { LandingPageComponent } from './features/landing-page/pages/landing-page/landing-page.component';
import { CreateRoutineComponent } from './features/auth/pages/create-routine/create-routine.component';
import { RoutineFormPageComponent } from './features/dashboard/pages/routines/routine-form-page/routine-form-page.component';
import { RoutineListPageComponent } from './features/dashboard/pages/routines/routine-list-page/routine-list-page.component';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout/auth-layout.component';
import { UserProfileComponent } from './features/dashboard/pages/profiles/user-profile/user-profile.component';
import { VerifyEmailPageComponent } from './features/auth/pages/verify-email-page/verify-email-page.component';
import { SettingsComponent } from './features/dashboard/pages/profiles/settings/settings-profile.component';
import { OnboardingLayoutComponent } from './features/onboarding/layouts/onboarding-layout/onboarding-layout.component';
import { CompleteOnboardingComponent } from './features/onboarding/pages/complete-onboarding/complete-onboarding.component';
import { DashboardLayoutComponent } from './features/dashboard/layout/dashboard-layout/dashboard-layout.component';
import { noAuthGuard } from './shared/guards/not-auth.guard';
import { authGuard, onboardingGuard, redirectGuard } from './shared/guards';
import { dashboardGuard } from './shared/guards/dashboard.guard';
import { DashboardHomeComponent } from './features/dashboard/pages/dashboard-home/dashboard-home.component';
import { NotesPageComponent } from './features/dashboard/pages/notes-page/notes-page.component';
import { ActivityFormComponent } from './components/activity/activity-form.component';
import { SettingsFamilyComponent } from './features/dashboard/pages/profiles/settings-family/settings-family.component';
import { InitOnboardingPageComponent } from './features/onboarding/pages/init-onboarding-page/init-onboarding-page.component';
import { CreateNinoPageComponent } from './features/onboarding/pages/create-nino-page/create-nino-page.component';
import { CreateFirstObjetivoPageComponent } from './features/onboarding/pages/create-first-objetivo-page/create-first-objetivo-page.component';
import { CreateFirstActividadPageComponent } from './features/onboarding/pages/create-first-actividad-page/create-first-actividad-page.component';
import { DownloadActivitiesPageComponent } from './features/dashboard/pages/download-activities-page/download-activities-page.component';

export const routes: Routes = [
  {
    path: 'landing',
    component: LandingPageComponent,
    title: 'Bienvenido a Nido',
  },
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [noAuthGuard],
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [noAuthGuard],
      },
      {
        path: 'verificar/:email',
        component: VerifyEmailPageComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  // TODO: Esto es solo para simular el acceso completo, hace falta crear familias etc
  {
    path: 'onboarding',
    component: OnboardingLayoutComponent,
    canActivate: [authGuard, onboardingGuard],
    children: [
      {
        path: '',
        component: InitOnboardingPageComponent,
      },
      {
        path: 'create-family',
        component: CreateFamilyComponent,
      },
      {
        path: 'create-nino',
        component: CreateNinoPageComponent,
      },
      {
        path: 'create-objetivo',
        component: CreateFirstObjetivoPageComponent,
      },
      {
        path: 'create-actividad',
        component: CreateFirstActividadPageComponent,
      },
      {
        path: 'complete',
        component: CompleteOnboardingComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [dashboardGuard],
    children: [
      {
        path: '',
        component: DashboardHomeComponent,
      },
      {
        path: 'calendar',
        component: CalendarPageComponent,
      },
      {
        path: 'child-profile',
        component: ChildProfileComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'about-us',
        component: AboutUsPageComponent,
      },
      {
        path: 'child-profile',
        component: ChildProfileComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'settings-family',
        component: SettingsFamilyComponent,
      },
      {
        path: 'objectives',
        component: ObjectivesPageComponent,
      },
      {
        path: 'objectives-form',
        component: ObjectivesFormComponent,
      },
      {
        path: 'downloads',
        component: DownloadActivitiesPageComponent,
      },
      {
        path: 'activity-form',
        component: ActivityFormComponent,
      },
      {
        path: 'routine-list',
        component: RoutineListPageComponent,
      },
      {
        path: 'notes',
        component: NotesPageComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: 'landing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
