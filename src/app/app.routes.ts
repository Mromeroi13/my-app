import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

import { roleGuard } from './core/guards/role.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // Rutas públicas
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // Dashboard
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },

      {
        path: 'inicio',
        component: InicioComponent
      },

      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['admin']
        }
      }

    ]
  },

  // Ruta no encontrada
  {
    path: '**',
    redirectTo: ''
  }

];