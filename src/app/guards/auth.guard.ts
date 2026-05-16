import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // onAuthStateChanged fires exactly once with the resolved state (User or null),
  // avoiding the undefined tick that authState() emits while Firebase restores
  // the session — which caused a blank screen on hard refresh (F5).
  return new Promise<boolean>(resolve => {
    const unsub = onAuthStateChanged(auth, user => {
      unsub();
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
