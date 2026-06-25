import { Injectable, signal } from '@angular/core';
import { supabase } from '../supabase.client';

import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})

// La clase ProfileService proporciona métodos para manejar el perfil de usuario
export class ProfileService {

  profile = signal<Profile | null>(null); // Señal para almacenar el perfil de usuario

  // Método para cargar el perfil de usuario desde Supabase
  async loadProfile(): Promise<Profile | null> {

    // Obtener el usuario autenticado desde Supabase
    const { data: auth } =
      await supabase.auth.getUser();

    // Si no hay un usuario autenticado, se establece el perfil como null y se retorna null
    if (!auth.user) {
      this.profile.set(null);
      return null;
    }

    // Si hay un usuario autenticado, se realiza una consulta a la tabla 'profiles' en Supabase para obtener el perfil correspondiente al ID del usuario autenticado
    const { data } = await supabase 
      .from('profiles') // Seleccionar la tabla 'profiles' en Supabase
      .select('*') // Seleccionar todos los campos del perfil
      .eq('id', auth.user.id) // Filtrar por el ID del usuario autenticado
      .single(); // Se espera que la consulta retorne un solo registro

    this.profile.set(data); // Se establece el perfil obtenido en la señal 'profile'

    return data;
  }

  // Método para limpiar el perfil de usuario, estableciendo la señal 'profile' como null
  clearProfile(): void {
    this.profile.set(null);
  }
 
  // Método para actualizar el perfil
  async updateProfile(
    id: string,
    data: {
      full_name: string;
      email: string;
      avatar_url: string;
      first_name: string;
      last_name_1: string;
      last_name_2: string;
    }
  ): Promise<void> {

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

}