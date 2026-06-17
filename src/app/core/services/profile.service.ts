import { Injectable, signal } from '@angular/core';
import { supabase } from '../supabase.client';

import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile = signal<Profile | null>(null);

  async loadProfile(): Promise<Profile | null> {

    const { data: auth } =
      await supabase.auth.getUser();

    if (!auth.user) {
      this.profile.set(null);
      return null;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', auth.user.id)
      .single();

    this.profile.set(data);

    return data;
  }

  clearProfile(): void {
    this.profile.set(null);
  }

}