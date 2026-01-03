import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard = (expectedRole: string): CanActivateFn => {
  return () => {
    const router = inject(Router);

    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');

    // ❌ No token
    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    // ❌ Role mismatch
    if (role !== expectedRole) {
      router.navigate(['/login']);
      return false;
    }

    // ✅ Allowed
    return true;
  };
};
