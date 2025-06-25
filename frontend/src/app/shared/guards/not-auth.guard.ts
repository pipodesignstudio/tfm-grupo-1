import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../features/auth/services';

export const noAuthGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.token()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
