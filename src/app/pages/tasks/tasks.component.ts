import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { FormsModule } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  private toast = inject(HotToastService); // Toast para las notificacione

  tasks = signal<Task[]>([]);

  loading = signal(false);
  readonly pageSize = 5;

  currentPage = signal(1);
  totalPages = signal(1);
  totalTasks = signal(0);
  
  errorTaskName = signal('');
  newTaskName = '';
  newTaskColor = '#3b82f6';

  editingTask: Task | null = null;
  deleteTaskModal = signal<Task | null>(null);
  
  search = signal('');
  showCreateModal = signal(false);

  constructor(private taskService: TaskService) {}

  async ngOnInit() {
    await this.loadTasks();
  }

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

  async previousPage(): Promise<void> {

  if (this.currentPage() <= 1) return;

  this.currentPage.update(page => page - 1);

  await this.loadTasks();

}

  async nextPage(): Promise<void> {

    if (this.currentPage() >= this.totalPages()) return;

    this.currentPage.update(page => page + 1);

    await this.loadTasks();

  }

  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);

    this.loadTasks();

  }
  
  async loadTasks() {

    this.loading.set(true);

    try {

      const result = await this.taskService.getTasks(
        this.currentPage(),
        this.pageSize,
        this.search()
      );

      this.tasks.set(result.tasks);

      this.totalTasks.set(result.total);

      this.totalPages.set(
        Math.ceil(result.total / this.pageSize)
      );

    } finally {

      this.loading.set(false);

    }

  }

  async createTask() {
    if (!this.newTaskName.trim()) return;

    await this.taskService.createTask({
      name: this.newTaskName,
      color: this.newTaskColor
    });

    this.newTaskName = '';
    await this.loadTasks();
    this.toast.success('Tarea creada correctamente');
  }

  edit(task: Task) {
    this.editingTask = { ...task };
  }

  cancelEdit() {
    this.editingTask = null;
    this.errorTaskName.set('');
  }

  async saveEdit() {
    if (!this.editingTask) return;

    await this.taskService.updateTask(
      this.editingTask.id,
      {
        name: this.editingTask.name,
        color: this.editingTask.color
      }
    );

    
    this.editingTask = null;
    await this.loadTasks();
    this.toast.success('Tarea modificada correctamente');
  }

  async deleteTask(id: string) {
    if (!confirm('¿Eliminar esta tarea?')) return;

    await this.taskService.deleteTask(id);
    await this.loadTasks();
  }

  filteredTasks = computed(() => {
    const term = this.search().trim().toLowerCase();

    if (!term) {
      return this.tasks();
    }

    return this.tasks().filter(task =>
      task.name.toLowerCase().includes(term)
    );
  });

  openEdit(task: Task) {
    this.errorTaskName.set('');
    this.editingTask = { ...task };
  }

  openDeleteModal(task: Task) {
    this.deleteTaskModal.set(task);
  }

  async confirmDelete() {
    const task = this.deleteTaskModal();
    if (!task) return;
    await this.taskService.deleteTask(task.id);
    this.deleteTaskModal.set(null);
    await this.loadTasks();
    this.toast.success('Tarea eliminada correctamente');

  }

  async onSearch(value: string) {

    this.search.set(value);
    this.currentPage.set(1);
    await this.loadTasks();

  }
  
  validateAndCreateTask() {

    if (!this.newTaskName.trim()) {
      this.errorTaskName.set('El nombre de la tarea es obligatorio');
      return;
    }

    this.errorTaskName.set('');

    this.createTask();
    this.showCreateModal.set(false);
  }

  validateAndEditTask() {

    if (!this.editingTask?.name?.trim()) {
      this.errorTaskName.set('El nombre de la tarea es obligatorio');
      return;
    }

    this.errorTaskName.set('');

    this.saveEdit();
    this.showCreateModal.set(false);
  }

  closeCreateModal() {
    this.errorTaskName.set('');
    this.showCreateModal.set(false);
  }

}