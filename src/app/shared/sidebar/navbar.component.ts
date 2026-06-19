import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  menuOpen = false; // Variable para establecer que el menú está cerrado

  constructor(
    public profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Función para alternar el estado del menú
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // Función para cerrar el menú
  closeMenu(): void {
    this.menuOpen = false;
  }

  // Función para cerrar la sesión del usuario
  async logout() {

    await this.authService.signOut();

    this.profileService.clearProfile();

    await this.router.navigate(
      ['/'],
      {
        replaceUrl: true
      }
    );
  }
}