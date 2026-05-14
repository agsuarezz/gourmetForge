import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RecipesService, Recipe } from '../../services/recipes.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private recipesService = inject(RecipesService);
  private favoritesService = inject(FavoritesService);

  recipe: Recipe | null = null;
  isFavorite = false;
  isLoading = true;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.navCtrl.navigateBack('/favorites');
      return;
    }

    this.recipesService.getRecipeById(id).subscribe(async recipe => {
      this.recipe = recipe;
      this.isFavorite = await this.favoritesService.isFavorite(id);
      this.isLoading = false;
    });
  }

  async toggleFavorite() {
    if (!this.recipe) return;
    this.isFavorite = await this.favoritesService.toggleFavorite(this.recipe.id);
  }

  goBack() {
    this.navCtrl.navigateBack('/favorites');
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