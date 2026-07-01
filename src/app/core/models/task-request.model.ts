export interface TaskRequest {
  id: string;
  user_id: string;
  name: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada';
  admin_comment: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}