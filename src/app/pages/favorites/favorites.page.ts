import { Component, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { RecipesService, Recipe } from '../../services/recipes.service';
import { FavoritesService } from '../../services/favorites.service';
import { Auth, authState } from '@angular/fire/auth';
import { from, switchMap, Subscription } from 'rxjs';
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
export class FavoritesPage implements OnInit, OnDestroy {
  private recipesService = inject(RecipesService);
  private favoritesService = inject(FavoritesService);
  private navCtrl = inject(NavController);   // use NavController instead of Router
  private auth = inject(Auth);
  private ngZone = inject(NgZone);

  recipes: RecipeWithFavorite[] = [];
  isLoading = true;
  userEmail: string | null = null;

  private subs: Subscription[] = [];

  ngOnInit() {
    this.favoritesService.initDB().then(() => {
      this.ngZone.run(() => {
        const authSub = authState(this.auth).subscribe(user => {
          this.userEmail = user?.email ?? null;
        });
        this.subs.push(authSub);

        const recipesSub = this.recipesService.getRecipes().pipe(
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
        this.subs.push(recipesSub);
      });
    });
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  async toggleFavorite(event: Event, recipe: RecipeWithFavorite) {
    event.stopPropagation();
    const newState = await this.favoritesService.toggleFavorite(recipe.id);
    this.ngZone.run(() => { recipe.isFavorite = newState; });
  }

  goToDetail(recipe: RecipeWithFavorite) {
    // NavController.navigateForward triggers Ionic's route lifecycle correctly,
    // ensuring ngOnInit runs on the detail page every time.
    this.navCtrl.navigateForward(['/recipe-detail', recipe.id]);
  }

  async logout() {
    await this.auth.signOut();
    this.navCtrl.navigateRoot('/login');
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy':    return 'success';
      case 'fácil':   return 'success';
      case 'medium':  return 'warning';
      case 'media':   return 'warning';
      case 'hard':    return 'danger';
      case 'difícil': return 'danger';
      default:        return 'medium';
    }
  }
}
