import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(LocalStorageService);
  const router = inject(Router);

  const token = storageService.get('auth-key');
  console.log('Guard Auth Key:', token);

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
