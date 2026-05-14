import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { RecipesService, Recipe } from '../../services/recipes.service';
import { FavoritesService } from '../../services/favorites.service';
import { Auth, authState } from '@angular/fire/auth';
import { combineLatest, from, switchMap, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RecipeWithFavorite extends Recipe {
  isFavorite: boolean;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  private recipesService = inject(RecipesService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  private auth = inject(Auth);

  recipes: RecipeWithFavorite[] = [];
  isLoading = true;
  userEmail: string | null = null;

  async ngOnInit() {
    // Initialize SQLite DB
    await this.favoritesService.initDB();

    // Get current user info
    authState(this.auth).subscribe(user => {
      this.userEmail = user?.email ?? null;
    });

    // Load recipes from Firebase and merge with SQLite favorites
    this.recipesService.getRecipes().pipe(
      switchMap(recipes =>
        from(this.favoritesService.getFavoriteIds()).pipe(
          map(favoriteIds =>
            recipes.map(recipe => ({
              ...recipe,
              isFavorite: favoriteIds.has(recipe.id)
            }))
          )
        )
      )
    ).subscribe({
      next: recipes => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading recipes:', err);
        this.isLoading = false;
      }
    });
  }

  async toggleFavorite(event: Event, recipe: RecipeWithFavorite) {
    // Stop click from bubbling to the item (which navigates to detail)
    event.stopPropagation();
    const newState = await this.favoritesService.toggleFavorite(recipe.id);
    recipe.isFavorite = newState;
  }

  goToDetail(recipe: RecipeWithFavorite) {
    this.router.navigate(['/recipe-detail', recipe.id]);
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'medium';
    }
  }
}
