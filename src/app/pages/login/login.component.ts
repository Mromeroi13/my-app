import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { NgClass } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    FormsModule,
    RouterLink,
    NgClass
  ]
})
export class LoginComponent {

  private toast = inject(HotToastService); // Para el toast
  email = ''; // Variable para almacenar el correo electrónico ingresado
  password = ''; // Variable para almacenar la contraseña ingresada
  showPassword = false; // Variable para controlar la visibilidad de la contraseña
  loading = false; // Variable para hacer el efecto de cargar

  // Constructor para inyectar los servicios necesarios
  constructor(
    private auth: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Método para iniciar sesión
  async login(): Promise<void> {
    this.loading = true;

    try {
      const { error } = await this.auth.signIn(this.email, this.password);

      if (error) {
        this.toast.error('Email o contraseña incorrectos');
        return;
      }

      const profile = await this.profileService.loadProfile();

      if (profile?.deleted) {
        await this.auth.signOut();
        this.toast.error('Esta cuenta ha sido desactivada');
        return;
      }

      this.toast.success('Sesión iniciada correctamente');

      await this.router.navigate(['/dashboard/inicio']);

    } catch (error) {
      console.error(error);
      this.toast.error('Ha ocurrido un error');

    } finally {
      this.loading = false;
    }
  }

  async resetPassword(): Promise<void> {

  if (!this.email) {
    this.toast.error('Introduce tu email para resetear la contraseña');
    return;
  }

  try {

    const { error } = await this.auth.resetPassword(this.email);

    if (error) {
      this.toast.error('No se pudo enviar el correo');
      return;
    }

    this.toast.success(
      'Te hemos enviado un correo para restablecer tu contraseña'
    );

  } catch (error) {

    console.error(error);
    this.toast.error('Ha ocurrido un error');

  }
}
}