import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  async getTasks(page: number = 1, pageSize: number = 10, search: string = '') {

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' });

    if (search.trim()) {
      query = query.ilike('name', `%${search}%`);
    }

const { data, error, count } = await query
  .order('name')
  .range(from, to);

    if (error) throw error;

    return {
      tasks: data ?? [],
      total: count ?? 0
    };

  }

  async createTask(task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(id: string, task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

}