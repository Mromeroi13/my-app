import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

import { ProfileService } from '../services/profile.service';

export const roleGuard: CanActivateFn = async (route) => {

  const profileService = inject(ProfileService);
  const router = inject(Router);

  let profile = profileService.profile();

  if (!profile) {

    profile = await profileService.loadProfile();

    if (!profile) {
      return router.createUrlTree(['/']);
    }
  }

  const roles =
    route.data?.['roles'] ?? [];

  if (roles.includes(profile.role)) {
    return true;
  }

  return router.createUrlTree([
    '/dashboard/inicio'
  ]);
};