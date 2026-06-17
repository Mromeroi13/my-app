export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}