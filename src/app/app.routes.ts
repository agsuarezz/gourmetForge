import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginPage),
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.page').then(m => m.RegistrationPage),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage),
    canActivate: [authGuard],
  },
  {
    path: 'recipe-detail/:id',
    loadComponent: () => import('./pages/recipe-detail/recipe-detail.page').then(m => m.RecipeDetailPage),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];