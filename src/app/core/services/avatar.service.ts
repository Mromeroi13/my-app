import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export interface Avatar {
  id: number;
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  async getAvatars(): Promise<Avatar[]> {
    const { data, error } = await supabase
      .from('avatars')
      .select('*')
      .order('id');

    if (error) throw error;

    return data ?? [];
  }
}