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

  email = ''; // Variable para almacenar el correo electrónico ingresado
  password = ''; // Variable para almacenar la contraseña ingresada
  showPassword = false; // Variable para controlar la visibilidad de la contraseña

  // Constructor para inyectar los servicios necesarios
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}


  // Método para registrar un nuevo usuario
  async register() {
    const { data, error } = await this.auth.signUp(this.email, this.password); // Llamada al método signUp del servicio AuthService para registrar un nuevo usuario

    if (error) {
      alert(error.message);
      return;
    }

    // Mostrar un mensaje de éxito y redirigir al usuario a la página de inicio de sesión
    alert('Registro exitoso. Prueba iniciar sesión.');
    this.router.navigate(['/']); // Redirigir al usuario a la página de inicio de sesión después de un registro exitoso
  }
}