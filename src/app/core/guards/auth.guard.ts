import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../services/auth.service';

//Comprueba si el usuario está logado. 
export const authGuard: CanActivateFn = async () => {

  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const router = inject(Router); // Inyecta el router para redirigir al usuario si no está autenticado

  const user = await authService.getUser(); // Obtiene el usuario actual

  // Si el usuario está logado, permite el acceso a la ruta
  if (user) { 
    return true;
  }

  return router.createUrlTree(['/']); // Si el usuario no está logado, redirige al login
};