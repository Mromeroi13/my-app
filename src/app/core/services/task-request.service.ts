import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';
import { TaskRequest } from '../models/task-request.model';

@Injectable({
  providedIn: 'root'
})
export class TaskRequestService {

  async getRequests(): Promise<TaskRequest[]> {
    const { data, error } = await supabase
      .from('task_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getMyRequests(userId: string): Promise<TaskRequest[]> {
    const { data, error } = await supabase
      .from('task_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async createRequest(userId: string, name: string) {
    const { data, error } = await supabase
      .from('task_requests')
      .insert({
        user_id: userId,
        name
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async approve(requestId: string) {
    const { error } = await supabase.rpc('approve_task_request', {
      p_request_id: requestId
    });

    if (error) throw error;
  }

  async reject(requestId: string, comment?: string) {
    const { error } = await supabase.rpc('reject_task_request', {
      p_request_id: requestId,
      p_comment: comment ?? null
    });

    if (error) throw error;
  }
}