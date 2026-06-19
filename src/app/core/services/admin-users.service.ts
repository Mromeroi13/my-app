import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

import { AdminUser } from '../models/admin-user.model';
import { UserFilters } from '../models/user-filters.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  private readonly PAGE_SIZE = 10;

  constructor() {}

  /**
   * Obtiene usuarios paginados con filtros.
   */
  async getUsers(
    page: number,
    filters?: UserFilters,
    sortField: 'email' | 'created_at' = 'created_at',
    ascending = false
  ): Promise<{
    users: AdminUser[];
    total: number;
  }> {

    const from = (page - 1) * this.PAGE_SIZE;
    const to = from + this.PAGE_SIZE - 1;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('deleted', false);

    // Buscar por email
    if (filters?.email?.trim()) {
      query = query.ilike(
        'email',
        `%${filters.email.trim()}%`
      );
    }

    // Filtrar por rol
    if (filters?.role?.trim()) {
      query = query.eq(
        'role',
        filters.role
      );
    }

    // Fecha desde
    if (filters?.dateFrom) {
      query = query.gte(
        'created_at',
        `${filters.dateFrom}T00:00:00`
      );
    }

    // Fecha hasta
    if (filters?.dateTo) {
      query = query.lte(
        'created_at',
        `${filters.dateTo}T23:59:59`
      );
    }

    const {
      data,
      count,
      error
    } = await query
      .order(sortField, {
        ascending
      })
      .range(from, to);

    if (error) {
      throw error;
    }

    return {
      users: (data ?? []) as AdminUser[],
      total: count ?? 0
    };
  }

  /**
   * Obtiene un usuario por ID.
   */
  async getUserById(
    userId: string
  ): Promise<AdminUser | null> {

    const {
      data,
      error
    } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('deleted', false)
      .single();

    if (error) {
      throw error;
    }

    return data as AdminUser;
  }

  /**
   * Actualiza datos de un usuario.
   */
  async updateUser(
    userId: string,
    updates: {
      full_name?: string;
      email?: string;
      role?: string;
    }
  ): Promise<AdminUser> {

    const {
      data,
      error
    } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as AdminUser;
  }

  /**
   * Eliminación lógica.
   */
  async deleteUser(
    userId: string
  ): Promise<void> {

    const { error } = await supabase
      .from('profiles')
      .update({
        deleted: true
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  }

  /**
   * Estadísticas para las tarjetas superiores.
   */
  async getStats(): Promise<{
    total: number;
    admins: number;
    users: number;
  }> {

    const {
      count: total,
      error: totalError
    } = await supabase
      .from('profiles')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('deleted', false);

    if (totalError) {
      throw totalError;
    }

    const {
      count: admins,
      error: adminsError
    } = await supabase
      .from('profiles')
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('deleted', false)
      .eq('role', 'admin');

    if (adminsError) {
      throw adminsError;
    }

    return {
      total: total ?? 0,
      admins: admins ?? 0,
      users: (total ?? 0) - (admins ?? 0)
    };
  }
}