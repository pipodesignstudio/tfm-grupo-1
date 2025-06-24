import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TokenService } from "../../features/auth/services";
import { UsersService } from "../services";

export const redirectGuard: CanActivateFn = async () => {
    const tokenService = inject(TokenService);
    const usersService = inject(UsersService);
    const router = inject(Router);
  
    const token = tokenService.token();
  
    if (!token) {
      // No hay token: deja pasar para mostrar landing
      return true;
    }
  
    const response = await usersService.getUser();
    const user = response?.user;
  
    if (!user) {
      tokenService.clearToken();
      // Sin usuario y con token inválido → ir a landing y bloquear acceso a la ruta actual
      await router.navigate(['/landing']);
      return false;
    }
  
    if (user.primera_sesion === true) {
      // Usuario sin onboarding completo → redirige a onboarding y bloquea la ruta actual
      await router.navigate(['/onboarding']);
      return false;
    }
  
    if (user.primera_sesion === false) {
      // Usuario onboardeado → redirige a dashboard y bloquea la ruta actual
      await router.navigate(['/dashboard']);
      return false;
    }
  
    // Por si acaso, deja pasar (o puedes bloquear según caso)
    return true;
  };
  