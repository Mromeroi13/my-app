// Representa un perfil de usuario en la aplicación
export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  full_name: string;
  avatar_url?: string;
  deleted: boolean;
}