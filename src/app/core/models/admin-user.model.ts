// Representa un usuario administrador en la aplicación
import { UserRole } from './user-role.enum';

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string | null;
  deleted: boolean;
}