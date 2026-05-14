import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Recipe {
  id: string;
  name: string;
  category: string;
  description: string;
  prepTime: number;   // minutes
  difficulty: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private firestore = inject(Firestore);

  getRecipes(): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    return collectionData(recipesRef, { idField: 'id' }) as Observable<Recipe[]>;
  }

  getRecipeById(id: string): Observable<Recipe> {
    const recipeDocRef = doc(this.firestore, `recipes/${id}`);
    return docData(recipeDocRef, { idField: 'id' }) as Observable<Recipe>;
  }
}
