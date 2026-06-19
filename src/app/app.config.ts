import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { routes } from './app.routes';

// Configuración de la aplicación Angular
export const appConfig: ApplicationConfig = {
  providers: [ // Proveedores de servicios y configuraciones de la aplicación
    provideBrowserGlobalErrorListeners(), // Proveedor para escuchar errores globales en el navegador
    provideRouter(routes), // Proveedor para configurar las rutas de la aplicación
    importProvidersFrom(FormsModule) // Proveedor para importar el módulo FormsModule, que permite el uso de formularios en la aplicación 
  ]
};