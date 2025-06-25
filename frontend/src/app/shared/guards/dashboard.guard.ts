import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services';

export const dashboardGuard: CanActivateFn = async () => {
  const userService = inject(UsersService);
  const router = inject(Router);

  const response = await userService.getUser();

  if (!response?.user) {
    await router.navigate(['/auth/login']);
    return false;
  }

  if (response.user.primera_sesion === false) {
    // Onboarding ya completado: se deja pasar
    return true;
  }

  // Onboarding pendiente
  await router.navigate(['/onboarding/complete']);
  return false;
};
