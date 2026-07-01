import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { TemplateItem } from '../models/template-item.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateItemService {

  async getItems(templateId: string): Promise<TemplateItem[]> {
    const { data, error } = await supabase
      .from('template_items')
      .select('*')
      .eq('template_id', templateId)
      .order('start_time');

    if (error) throw error;
    return data ?? [];
  }

  async addItem(item: Partial<TemplateItem>) {
    const { data, error } = await supabase
      .from('template_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateItem(id: string, item: Partial<TemplateItem>) {
    const { data, error } = await supabase
      .from('template_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteItem(id: string) {
    const { error } = await supabase
      .from('template_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}