import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  private toast = inject(HotToastService);

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async updatePassword(): Promise<void> {

    if (!this.password || !this.confirmPassword) {
      this.toast.error('Debes completar todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.loading = true;

    try {

      const { error } = await this.auth.updatePassword(this.password);

      if (error) {
        this.toast.error('No se pudo actualizar la contraseña');
        return;
      }

      this.toast.success('Contraseña actualizada correctamente');

      await this.router.navigate(['/login']);

    } catch (error) {

      console.error(error);
      this.toast.error('Ha ocurrido un error');

    } finally {

      this.loading = false;

    }
  }
}