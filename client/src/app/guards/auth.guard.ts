import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.waitUntilReady().pipe(
    map(() => {
      if (authService.isLoggedIn()) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};

// Here:
// waitUntilReady() returns an observable.
// .pipe(map(...)) transforms the value into true or false.
// The guard returns an observable that resolves once waitUntilReady() emits.
// The router subscribes automatically and handles the result.
//❌ Wrong pattern (if you used subscribe inside the guard)
//  This would cause the guard to return undefined immediately, and the router would fail or not wait for the async check.

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.waitUntilReady().pipe(
    map(() => {
      if (!authService.isLoggedIn()) return true;
      router.navigate(['/']);
      return false;
    })
  );
};
