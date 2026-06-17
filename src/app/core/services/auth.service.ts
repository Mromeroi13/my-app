import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password
    });
  }

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async getSession() {
    return await supabase.auth.getSession();
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
  }
}