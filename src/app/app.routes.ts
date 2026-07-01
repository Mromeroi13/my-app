import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import {AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TasksComponent } from './pages/tasks/tasks.component';


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
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

  // Dashboard
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard], // Protege las rutas del dashboard para que solo usuarios autenticados puedan acceder
    children: [

      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full' // Redirige a la ruta 'inicio' si el usuario accede a '/dashboard' sin especificar una ruta hija
      },

      {
        path: 'inicio',
        component: InicioComponent
      },

      {
        path: 'usuarios',
        component: AdminUsersComponent,
        canActivate: [roleGuard], // Protege la ruta 'usuarios' para que solo usuarios con el rol 'admin' puedan acceder
        data: {
          roles: ['admin']
        }
      },

      {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [roleGuard], // Protege la ruta 'usuarios' para que solo usuarios con el rol 'admin' puedan acceder
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