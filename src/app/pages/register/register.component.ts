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


  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async register() {
    const { data, error } = await this.auth.signUp(this.email, this.password);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Registro exitoso. Revisa tu email si hay confirmación.');
    this.router.navigate(['/']);
  }
}