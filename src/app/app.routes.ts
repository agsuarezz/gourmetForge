import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.page').then(m => m.RegistrationPage),
  },
  {
    path: '',
    redirectTo: 'registration',
    pathMatch: 'full',
  },
];
