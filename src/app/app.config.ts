import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular'; // <-- Importamos IonicModule desde la ruta principal

// Importa tus rutas aquí (seguramente ya lo tienes)
// import { routes } from './app.routes'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(IonicModule.forRoot({}))
  ]
};