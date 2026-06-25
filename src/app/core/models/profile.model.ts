// Representa un perfil de usuario en la aplicación
export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  full_name: string;
  first_name: string;
  last_name_1: string;
  last_name_2: string | null;  
  avatar_url?: string;
  deleted: boolean;
}