import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.getUsername()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const loginGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.getUsername()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
