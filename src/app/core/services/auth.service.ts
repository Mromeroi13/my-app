import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

// Inyectable es un decorador que marca esta clase como un servicio que puede ser inyectado en otros componentes o servicios de Angular
@Injectable({
  providedIn: 'root'
})

// La clase AuthService proporciona métodos para manejar la autenticación de usuarios utilizando Supabase
export class AuthService {

  // El constructor de la clase AuthService no realiza ninguna acción específica en este caso
  constructor() {}

  // El método signUp permite registrar un nuevo usuario con un correo electrónico y una contraseña
  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password
    });
  }

  // El método signIn permite iniciar sesión con un correo electrónico y una contraseña
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  // El método signOut permite cerrar la sesión del usuario actual
  async signOut() {
    return await supabase.auth.signOut();
  }

  // El método getUser obtiene la información del usuario actualmente autenticado
  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  // El método getSession obtiene la sesión actual del usuario autenticado
  async getSession() {
    return await supabase.auth.getSession();
  }

  // El método isAuthenticated verifica si hay un usuario autenticado actualmente
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
  }
}