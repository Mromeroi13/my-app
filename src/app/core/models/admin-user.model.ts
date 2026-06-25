// Representa un usuario administrador en la aplicación
import { UserRole } from './user-role.enum';

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  first_name: string;
  last_name_1: string;
  last_name_2: string | null; 
  role: UserRole;
  avatar_url: string | null;
  created_at: string | null;
  deleted: boolean;
}