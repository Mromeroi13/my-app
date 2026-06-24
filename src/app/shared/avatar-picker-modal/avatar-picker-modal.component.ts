import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService, Avatar } from '../../core/services/avatar.service';


@Component({
  selector: 'app-avatar-picker-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-picker-modal.component.html',
  styleUrl: './avatar-picker-modal.component.scss'
})
export class AvatarPickerModalComponent {

  @Output() closeModal = new EventEmitter<void>();
  @Output() select = new EventEmitter<string>();

  avatars = signal<Avatar[]>([]);
  loading = signal(true);

  constructor(private avatarService: AvatarService) {}

  async ngOnInit() {
    try {
      const data = await this.avatarService.getAvatars();
      this.avatars.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  close() {
    this.closeModal.emit();
  }

  pick(url: string) {
    this.select.emit(url);
    this.close();
  }
}