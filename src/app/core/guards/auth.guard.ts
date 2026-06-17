//Comprueba si el usuario está logado. 

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await authService.getUser();

  if (user) {
    return true;
  }

  return router.createUrlTree(['/']);
};