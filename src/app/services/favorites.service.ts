import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

// Uses @capacitor-community/sqlite for real device/emulator
// Falls back to localStorage for browser development
declare var CapacitorSQLite: any;

export interface FavoriteRecord {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private dbName = 'favorites.db';
  private isNative = Capacitor.isNativePlatform();

  // In-memory fallback for browser environment
  private browserFavorites: Set<string> = new Set(
    JSON.parse(localStorage.getItem('favorites') || '[]')
  );

  async initDB(): Promise<void> {
    if (!this.isNative) return;

    await CapacitorSQLite.createConnection({ database: this.dbName });
    await CapacitorSQLite.open({ database: this.dbName });
    await CapacitorSQLite.execute({
      database: this.dbName,
      statements: `
        CREATE TABLE IF NOT EXISTS favorites (
          id TEXT PRIMARY KEY NOT NULL
        );
      `
    });
  }

  async addFavorite(id: string): Promise<void> {
    if (!this.isNative) {
      this.browserFavorites.add(id);
      localStorage.setItem('favorites', JSON.stringify([...this.browserFavorites]));
      return;
    }
    await CapacitorSQLite.run({
      database: this.dbName,
      statement: 'INSERT OR IGNORE INTO favorites (id) VALUES (?);',
      values: [id]
    });
  }

  async removeFavorite(id: string): Promise<void> {
    if (!this.isNative) {
      this.browserFavorites.delete(id);
      localStorage.setItem('favorites', JSON.stringify([...this.browserFavorites]));
      return;
    }
    await CapacitorSQLite.run({
      database: this.dbName,
      statement: 'DELETE FROM favorites WHERE id = ?;',
      values: [id]
    });
  }

  async getFavoriteIds(): Promise<Set<string>> {
    if (!this.isNative) {
      return new Set(this.browserFavorites);
    }
    const result = await CapacitorSQLite.query({
      database: this.dbName,
      statement: 'SELECT id FROM favorites;',
      values: []
    });
    const ids = (result.values || []).map((row: any) => row.id as string);
    return new Set(ids);
  }

  async isFavorite(id: string): Promise<boolean> {
    const ids = await this.getFavoriteIds();
    return ids.has(id);
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const fav = await this.isFavorite(id);
    if (fav) {
      await this.removeFavorite(id);
      return false;
    } else {
      await this.addFavorite(id);
      return true;
    }
  }
}
