import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    FormsModule,
    RouterLink,
    NgClass
  ]
})
export class RegisterComponent {

  email = '';
  password = '';
  showPassword = false;
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // 🔐 Password strength simple
  get passwordStrength(): number {
    let score = 0;

    if (this.password.length >= 6) score++;
    if (this.password.length >= 10) score++;
    if (/[A-Z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[^A-Za-z0-9]/.test(this.password)) score++;

    return score; // 0 - 5
  }

  get passwordStrengthLabel(): string {
    if (this.passwordStrength <= 1) return 'Débil';
    if (this.passwordStrength <= 3) return 'Media';
    return 'Fuerte';
  }

 async register() {
  this.errorMessage = '';
  this.successMessage = '';
  this.loading = true;

  try {
    // validación frontend
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const { error } = await this.auth.signUp(this.email, this.password);

    if (error) {
      this.errorMessage = this.mapError(error.message);
      return;
    }

    this.successMessage = 'Cuenta creada correctamente. Revisa tu email.';

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);

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