import { Component, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecipesService, Recipe } from '../../services/recipes.service';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnDestroy {
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private recipesService = inject(RecipesService);
  private favoritesService = inject(FavoritesService);
  private ngZone = inject(NgZone);

  recipe: Recipe | null = null;
  isFavorite = false;
  isLoading = true;
  isTogglingFavorite = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  imageError = false;

  private recipeSub?: Subscription;

  // ionViewWillEnter fires every time the view becomes active in Ionic,
  // even when IonicRouteStrategy keeps the component alive in the cache.
  // ngOnInit only fires once on creation, so it misses subsequent navigations.
  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.navCtrl.navigateBack('/favorites');
      return;
    }

    // Reset state for the incoming recipe
    this.isLoading = true;
    this.recipe = null;
    this.imageError = false;

    this.recipeSub?.unsubscribe();
    this.favoritesService.initDB().then(() => {
      this.recipeSub = this.recipesService.getRecipeById(id).subscribe(recipe => {
        this.favoritesService.isFavorite(id).then(fav => {
          this.ngZone.run(() => {
            this.recipe = recipe;
            this.isFavorite = fav;
            this.isLoading = false;
          });
        });
      });
    });
  }

  ngOnDestroy() {
    this.recipeSub?.unsubscribe();
  }

  toggleFavorite() {
    if (!this.recipe || this.isTogglingFavorite) return;
    this.isTogglingFavorite = true;
    const name = this.recipe.name;
    this.favoritesService.toggleFavorite(this.recipe.id).then(newState => {
      this.ngZone.run(() => {
        this.isFavorite = newState;
        this.toastMessage = newState
          ? `"${name}" añadida a favoritos`
          : `"${name}" eliminada de favoritos`;
        this.toastColor = newState ? 'success' : 'medium';
        this.showToast = true;
        this.isTogglingFavorite = false;
        setTimeout(() => this.ngZone.run(() => this.showToast = false), 2500);
      });
    }).catch(err => {
      console.error('Error toggling favorite:', err);
      this.ngZone.run(() => {
        this.toastMessage = 'Error al actualizar favoritos';
        this.toastColor = 'danger';
        this.showToast = true;
        this.isTogglingFavorite = false;
        setTimeout(() => this.ngZone.run(() => this.showToast = false), 2500);
      });
    });
  }

  onImageError() {
    this.imageError = true;
  }

  goBack() {
    this.navCtrl.navigateBack('/favorites');
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

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'fácil':   return 'happy-outline';
      case 'medium':
      case 'media':   return 'flame-outline';
      case 'hard':
      case 'difícil': return 'skull-outline';
      default:        return 'help-circle-outline';
    }
  }
}
