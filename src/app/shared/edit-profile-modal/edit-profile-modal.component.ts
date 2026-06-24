import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ProfileService } from '../../core/services/profile.service';

import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.scss'
})
export class EditProfileModalComponent implements OnInit {

  private toast = inject(HotToastService);

  @Output()
  closeModal = new EventEmitter<void>();

  fullName = '';
  email = '';
  avatarUrl = '';

  selectedFile: File | null = null;

  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {

    const profile =
      this.profileService.profile();

    if (!profile) {
      return;
    }

    this.fullName = profile.full_name;
    this.email = profile.email;
    this.avatarUrl = profile.avatar_url ?? '';
  }

  close(): void {
    this.closeModal.emit();
  }

  async save(): Promise<void> {

    const profile =
      this.profileService.profile();

    if (!profile) {
      return;
    }

    try {

      let avatarUrl =
        this.avatarUrl;

      if (this.selectedFile) {

        avatarUrl =
          await this.profileService.uploadAvatar(
            profile.id,
            this.selectedFile
          );
      }

      await this.profileService.updateProfile(
        profile.id,
        {
          full_name: this.fullName,
          email: this.email,
          avatar_url: avatarUrl
        }
      );

      await this.profileService.loadProfile();

      this.toast.success(
        'Usuario actualizado correctamente'
      );

      this.close();

    } catch (error) {

      console.error(error);

      this.toast.error(
        'Usuario no actualizado'
      );
    }
  }

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile =
      input.files[0];

    this.avatarUrl =
      URL.createObjectURL(
        this.selectedFile
      );
  }
}