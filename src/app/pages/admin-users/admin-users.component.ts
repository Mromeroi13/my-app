import {
  Component,
  OnInit,
  signal,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminUsersService } from '../../core/services/admin-users.service';

import { AdminUser } from '../../core/models/admin-user.model';
import { UserFilters } from '../../core/models/user-filters.model';
import { UserRole } from '../../core/models/user-role.enum';

import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  

  private toast = inject(HotToastService); // Toast para las notificacione
  readonly pageSize = 10; // Tamaño de página fijo para la paginación

  users = signal<AdminUser[]>([]); // Señal para almacenar la lista de usuarios
  loading = signal(false); // Señal para indicar si se está cargando la lista de usuarios

  totalUsers = signal(0); // Señal para almacenar el número total de usuarios

  currentPage = signal(1); // Señal para almacenar la página actual de la paginación
  totalPages = signal(1); // Señal para almacenar el número total de páginas de la paginación

  totalCount = signal(0); // Señal para almacenar el número total de usuarios
  adminCount = signal(0); // Señal para almacenar el número de usuarios administradores
  userCount = signal(0); // Señal para almacenar el número de usuarios normales

  // Filtros de búsqueda para los usuarios
  filters: UserFilters = {
    email: '',
    full_name: "",
    role: '',
    dateFrom: '',
    dateTo: ''
  };

  sortField: 'email' | 'created_at' | 'full_name' = 'created_at'; // Campo por el cual se ordenarán los usuarios
  ascending = false; // Indica si el ordenamiento es ascendente o descendente

  // Lista de roles de usuario disponibles
  readonly roles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.USER
  ];

  isEditModalOpen = signal(false); // Señal para indicar si el modal de edición de usuario está abierto

  selectedUser = signal<AdminUser | null>(null); // Señal para almacenar el usuario seleccionado para edición

  isDeleteModalOpen = signal(false); // Señal para indicar si el modal de confirmación de eliminación de usuario está abierto 

  userToDelete = signal<AdminUser | null>(null); // Señal para almacenar el usuario seleccionado para eliminación

  // Formulario de edición de usuario
  editForm: {
  first_name: string;
  last_name_1: string;
  last_name_2: string;
  email: string;
  role: UserRole;
  } = {
    first_name: '',
    last_name_1: '',
    last_name_2: '',
    email: '',
    role: UserRole.USER
  };

  // Para la paginación
  visiblePages(): number[] {

    const total = this.totalPages();
    const current = this.currentPage();

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {

      if (start === 1) {
        end = Math.min(total, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }

    }

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

  }

  constructor(
    private adminUsersService: AdminUsersService
  ) {}

  // Se ejecuta al inicializar el componente, cargando las estadísticas y la lista de usuarios
  async ngOnInit(): Promise<void> {
    await this.loadStats();
    await this.loadUsers();
  }

  // Función para cargar la lista de usuarios desde el servicio, aplicando filtros, ordenamiento y paginación
  async loadUsers(): Promise<void> {

    try {

      this.loading.set(true);

      const result =
        await this.adminUsersService.getUsers(
          this.currentPage(),
          this.pageSize,
          this.filters,
          this.sortField,
          this.ascending
        );

      this.users.set(result.users);

      this.totalUsers.set(result.total);

      this.totalPages.set(
        Math.ceil(result.total / this.pageSize)
      );

    } catch (error) {

      console.error(
        'Error cargando usuarios:',
        error
      );

    } finally {

      this.loading.set(false);

    }
  }

  // Función para cargar las estadísticas de usuarios desde el servicio, incluyendo el número total de usuarios, administradores y usuarios normales
  async loadStats(): Promise<void> {

    try {

      const stats =
        await this.adminUsersService.getStats();

      this.totalCount.set(stats.total);
      this.adminCount.set(stats.admins);
      this.userCount.set(stats.users);

    } catch (error) {

      console.error(
        'Error cargando estadísticas:',
        error
      );

    }
  }

  // Establece los filtros de búsqueda y recarga la lista de usuarios desde la primera página
  async applyFilters(): Promise<void> {

    this.currentPage.set(1);

    await this.loadUsers();

  }

  // Restablece los filtros de búsqueda a sus valores predeterminados y recarga la lista de usuarios desde la primera página
  async clearFilters(): Promise<void> {

    this.filters = {
      email: '',
      full_name: '',
      role: '',
      dateFrom: '',
      dateTo: ''
    };

    this.currentPage.set(1);

    await this.loadUsers();

  }

  // Cambia el campo de ordenamiento y la dirección (ascendente/descendente) y recarga la lista de usuarios
  async changeSort(
    field: 'email' | 'created_at' | 'full_name'
  ): Promise<void> {

    if (this.sortField === field) {

      this.ascending = !this.ascending;

    } else {

      this.sortField = field;
      this.ascending = true;

    }

    await this.loadUsers();

  }

  // Función para ir a la página anterior en la paginación y recargar la lista de usuarios
  async previousPage(): Promise<void> {

    if (this.currentPage() <= 1) {
      return;
    }

    this.currentPage.update(page => page - 1);

    await this.loadUsers();

  }

  // Función para ir a la página siguiente en la paginación y recargar la lista de usuarios
  async nextPage(): Promise<void> {

    if (
      this.currentPage() >=
      this.totalPages()
    ) {
      return;
    }

    this.currentPage.update(page => page + 1);

    await this.loadUsers();

  }

  // Función para abrir el modal de confirmación de eliminación de usuario, estableciendo el usuario seleccionado para eliminación
  deleteUser(user: AdminUser): void {

    this.userToDelete.set(user);

    this.isDeleteModalOpen.set(true);

  }
  async refresh(): Promise<void> {

    await this.loadStats();
    await this.loadUsers();

  }

  // Función para identificar de manera única a cada usuario en la lista, utilizando su ID
  trackByUser(
    index: number,
    user: AdminUser
  ): string {

    return user.id;

  }

    openEditModal(
    user: AdminUser
  ): void {

    this.selectedUser.set(user);

    // Inicializa el formulario de edición con los datos del usuario seleccionado, utilizando valores predeterminados si algunos campos son nulos
    this.editForm = {
      first_name: user.first_name ?? '',
      last_name_1: user.last_name_1 ?? '',
      last_name_2: user.last_name_2 ?? '',
      email: user.email ?? '',
      role: user.role
    };

    this.isEditModalOpen.set(true);

  }

  // Función para cerrar el modal de edición de usuario y restablecer el usuario seleccionado
  closeEditModal(): void {

    this.isEditModalOpen.set(false);


    this.selectedUser.set(null);

  }

  // Función para guardar los cambios realizados en el usuario seleccionado, actualizando sus datos a través del servicio y recargando la lista de usuarios
  async saveUser(): Promise<void> {

    const user = this.selectedUser();

    if (!user) {
      return;
    }

    try {

      await this.adminUsersService.updateUser(
        user.id,
        {
          first_name: this.editForm.first_name,
          last_name_1: this.editForm.last_name_1,
          last_name_2: this.editForm.last_name_2,
          email: this.editForm.email,
          role: this.editForm.role
        }
      );

      this.closeEditModal();
      
      this.toast.success(
        'Usuario modificado correctamente'
      );

      await this.loadUsers();
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {

      this.toast.error(
        'Error actualizando usuario'
      );

    }

  }

    getFullName(user: AdminUser): string {
    return [
      user.first_name,
      user.last_name_1,
      user.last_name_2
    ]
      .filter(Boolean)
      .join(' ');
  }

  // Función para cerrar el modal de confirmación de eliminación de usuario y restablecer el usuario seleccionado para eliminación
  closeDeleteModal(): void {

    this.isDeleteModalOpen.set(false);

    this.userToDelete.set(null);

  }

  // Función para confirmar la eliminación del usuario seleccionado, llamando al servicio para eliminarlo y recargando la lista de usuarios y estadísticas
  async confirmDeleteUser(): Promise<void> {

    const user = this.userToDelete();

    if (!user) {
      return;
    }

    try {

      await this.adminUsersService.deleteUser(user.id);

      this.closeDeleteModal();

      await this.loadUsers();
      await this.loadStats();

      this.toast.success(
        'Usuario eliminado correctamente'
      );

    } catch (error) {

      console.error('Error eliminando usuario:', error);
      
      this.toast.error(
        'Error al eliminar el usuario'
      );

    }
  }
  
  // Pginación
  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
    this.loadUsers();
  }
}