import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { CalendarDay } from '../models/calendar-day.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  async getMonth(userId: string, start: string, end: string): Promise<CalendarDay[]> {
    const { data, error } = await supabase
      .from('calendar_days')
      .select('*')
      .eq('user_id', userId)
      .gte('day', start)
      .lte('day', end)
      .order('day');

    if (error) throw error;
    return data ?? [];
  }

  async setDay(userId: string, day: string, templateId: string) {
    const { data, error } = await supabase
      .from('calendar_days')
      .upsert({
        user_id: userId,
        day,
        template_id: templateId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDay(userId: string, day: string) {
    const { error } = await supabase
      .from('calendar_days')
      .delete()
      .eq('user_id', userId)
      .eq('day', day);

    if (error) throw error;
  }
}