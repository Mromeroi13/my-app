import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

import { ProfileService } from '../services/profile.service';

// Comprueba si el usuario tiene el rol necesario para acceder a la ruta
export const roleGuard: CanActivateFn = async (route) => {

  const profileService = inject(ProfileService); // Inyecta el servicio de perfil para acceder a la información del usuario
  const router = inject(Router); // Inyecta el enrutador para redirigir al usuario si no tiene el rol necesario

  let profile = profileService.profile(); // Obtiene el perfil del usuario desde el servicio de perfil

  // Si no hay perfil cargado, intenta cargarlo desde el servicio
  if (!profile) {

    profile = await profileService.loadProfile(); // Intenta cargar el perfil del usuario desde el servicio de perfil

    // Si no se pudo cargar el perfil, redirige al usuario a la página de inicio
    if (!profile) {
      return router.createUrlTree(['/']);
    }
  }

  // Obtiene los roles permitidos para la ruta desde los datos de la ruta
  const roles =
    route.data?.['roles'] ?? []; // Obtiene los roles permitidos para la ruta desde los datos de la ruta

  // Comprueba si el rol del usuario está incluido en los roles permitidos para la ruta
  if (roles.includes(profile.role)) {
    return true;
  }

  // Si el rol del usuario no está incluido en los roles permitidos para la ruta, redirige al usuario a la página de inicio del dashboard
  return router.createUrlTree([
    '/dashboard/inicio'
  ]);
};