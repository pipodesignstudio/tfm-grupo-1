import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services';

export const onboardingGuard: CanActivateFn = async () => {
  const userService = inject(UsersService);
  const router = inject(Router);

  const response = await userService.getUser();
  console.log('ONBOARDING GUARD', response?.user?.primera_sesion);

  if (!response?.user) {
    await router.navigate(['/auth/login']);
    return false;
  }

  if (!response.user.primera_sesion) {
    console.log('Onboarding completado');
    await router.navigate(['/dashboard']);
    return true;
  }

  return true;
};
