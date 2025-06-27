import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page/register-page.component';
import { CalendarPageComponent } from './features/dashboard/pages/routines/calendar-page/calendar-page.component';
import { CreateFamilyComponent } from './features/auth/pages/create-family/create-family.component';
import { ChildProfileComponent } from './features/dashboard/pages/profiles/child-profile/child-profile.component';
import { MyFamilyComponent } from './features/auth/pages/my-family/my-family.component';
import { AboutUsPageComponent } from './features/dashboard/pages/about-us-page/about-us-page.component';
import { EditProfileComponent } from './features/dashboard/pages/profiles/edit-profile/edit-profile.component';
import { ObjectivesPageComponent } from './features/dashboard/pages/objectives-page/objectives-page.component';
import { ObjectivesFormComponent } from './features/dashboard/components/objectives-form/objectives-form.component';
import { LandingPageComponent } from './features/landing-page/pages/landing-page/landing-page.component';
import { CreateRoutineComponent } from './create-routine/create-routine.component';
import { Mensaje2Component } from './features/auth/pages/mensaje2/mensaje2.component';
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
import { Message1Component } from './features/auth/pages/message1/message1.component';

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
        path: 'message1',
        component: Message1Component,
      },
      {
        path: 'message2',
        component: Mensaje2Component,
      },
      {
        path: 'create-family',
        component: CreateFamilyComponent,
      },
      {
        path: 'my-family',
        component: MyFamilyComponent,
      },
      {
        path: 'create-routine',
        component: CreateRoutineComponent,
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
        path: 'complete',
        component: CompleteOnboardingComponent,
      },
      {
        path: '**',
        redirectTo: 'complete',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    // canActivate: [authGuard],
    // canActivateChild: [dashboardGuard],
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
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'settings/edit-profile',
        component: EditProfileComponent,
      },
      {
        path: 'about-us',
        component: AboutUsPageComponent,
      },
      {
        path: 'create-routine',
        component: CreateRoutineComponent,
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
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'settings/edit-profile',
        component: EditProfileComponent,
      },
      {
        path: 'about-us',
        component: AboutUsPageComponent,
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
        path: 'routine-form',
        component: RoutineFormPageComponent,
      },
      {
        path: 'routine-list',
        component: RoutineListPageComponent,
      },
      {
        path: '**',
        redirectTo: 'create-family',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
