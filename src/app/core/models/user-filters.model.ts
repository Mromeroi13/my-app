// Representa los filtros que se pueden aplicar al buscar usuarios en la aplicación
export interface UserFilters {
  email?: string;
  full_name?: string;
  role?: string;
  dateFrom?: string;
  dateTo?: string;
}
