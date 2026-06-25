import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    FormsModule,
    NgClass,
    RouterLink
  ]
})
export class RegisterComponent {

  private toast = inject(HotToastService); // Para el toast

  email = '';
  password = '';
  confirmPassword = '';

  firstName = '';
  lastName1 = '';
  lastName2 = '';

  showPassword = false;
  showConfirmPassword = false;

  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  get passwordStrength(): number {
    let score = 0;

    if (this.password.length >= 6) score++;
    if (this.password.length >= 10) score++;
    if (/[A-Z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[^A-Za-z0-9]/.test(this.password)) score++;

    return score;
  }

  get passwordStrengthLabel(): string {
    if (this.passwordStrength <= 1) return 'Débil';
    if (this.passwordStrength <= 3) return 'Media';
    return 'Fuerte';
  }

  async register() {

    console.log('Botón pulsado');

    this.errorMessage = '';
    this.loading = true;

    try {

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        this.loading = false;
        return;
      }

      const fullName =
        `${this.firstName} ${this.lastName1} ${this.lastName2}`.trim();

      const { error } = await this.auth.signUp(
        this.email,
        this.password,
        {
          first_name: this.firstName,
          last_name_1: this.lastName1,
          last_name_2: this.lastName2,
          full_name: fullName
        }
      );

      if (error) {

      const message =
        this.mapError(error.message);

      this.errorMessage = message;

      this.toast.error(message);

      return;
    }

      this.toast.success(
        'Cuenta creada correctamente'
      );

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);

    } catch (err) {

     const message =
      err instanceof Error
        ? err.message
        : 'Error inesperado';

    this.errorMessage = message;

    this.toast.error(message);

    } finally {
      this.loading = false;
    }
  }

  private mapError(message: string): string {
    if (message.includes('already registered')) {
      return 'Este email ya está registrado.';
    }
    if (message.includes('password')) {
      return 'La contraseña no es válida.';
    }
    if (message.includes('Invalid email')) {
      return 'El email no es válido.';
    }
    return 'Ha ocurrido un error. Inténtalo de nuevo.';
  }
}