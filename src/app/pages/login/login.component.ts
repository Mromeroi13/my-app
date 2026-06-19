import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { NgClass } from '@angular/common';

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

  email = ''; // Variable para almacenar el correo electrónico ingresado
  password = ''; // Variable para almacenar la contraseña ingresada
  showPassword = false; // Variable para controlar la visibilidad de la contraseña

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
  async login() {
    const { data, error } = await this.auth.signIn(this.email, this.password); // Llamada al método signIn del servicio AuthService para autenticar al usuario

    if (error) {
      alert(error.message);
      return;
    }

    await this.profileService.loadProfile(); // Cargar el perfil del usuario después de iniciar sesión


    this.router.navigate(['/dashboard/inicio']); // Redirigir al usuario a la página de inicio del dashboard después de iniciar sesión exitosamente
  }
}