import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AvatarService, Avatar } from '../../core/services/avatar.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';
import { AvatarPickerModalComponent } from '../avatar-picker-modal/avatar-picker-modal.component';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, AvatarPickerModalComponent],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.scss'
})
export class EditProfileModalComponent implements OnInit {

  private toast = inject(HotToastService);
  showAvatarModal = false;

  @Output() closeModal = new EventEmitter<void>();

  firstName = '';
  lastName1 = '';
  lastName2 = '';
  email = '';
  avatarUrl = '';

  avatars: Avatar[] = [];
  selectedAvatarUrl = '';

  constructor(
    private profileService: ProfileService,
    private avatarService: AvatarService
  ) {}

  async ngOnInit(): Promise<void> {

    const profile = this.profileService.profile();

    if (!profile) return;

    this.firstName = profile.first_name;
    this.lastName1 = profile.last_name_1;
    this.lastName2 = profile.last_name_2 ?? '';
    this.email = profile.email;

    this.avatarUrl = profile.avatar_url ?? '';
    this.selectedAvatarUrl = this.avatarUrl;

    this.avatars = await this.avatarService.getAvatars();
  }

  close(): void {
    this.closeModal.emit();
  }

  selectAvatar(url: string): void {
    this.selectedAvatarUrl = url;
  }

  async save(): Promise<void> {

    const profile = this.profileService.profile();
    if (!profile) return;

    try {

      await this.profileService.updateProfile(profile.id, {
        first_name: this.firstName,
        last_name_1: this.lastName1,
        last_name_2: this.lastName2,
        full_name: `${this.firstName} ${this.lastName1} ${this.lastName2}`.trim(),
        email: this.email,
        avatar_url: this.selectedAvatarUrl
      });

      await this.profileService.loadProfile();

      this.toast.success('Usuario actualizado correctamente');
      this.close();

    } catch (error) {
      console.error(error);
      this.toast.error('Error al actualizar el perfil');
    }
  }

  openAvatarModal() {
    this.showAvatarModal = true;
  } 

  onAvatarSelected(url: string) {
    this.selectedAvatarUrl = url;
  }

}