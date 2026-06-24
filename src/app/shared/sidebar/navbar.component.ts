import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    EditProfileModalComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  menuOpen = false; // Variable para establecer que el menú está cerrado

  showProfileModal = false; // Variable para ver el modal

  constructor(
    public profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Abrir el modal del perfil
  openProfileModal(): void {
    this.showProfileModal = true;
  }

  // Cerrar el modal del perfil
  closeProfileModal(): void {
    this.showProfileModal = false;
  }


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