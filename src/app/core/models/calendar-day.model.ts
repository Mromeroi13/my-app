export interface CalendarDay {
  id: string;
  user_id: string;
  template_id: string;
  day: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}