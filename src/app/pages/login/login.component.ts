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

  email = '';
  password = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  async login() {
    const { data, error } = await this.auth.signIn(this.email, this.password);

    if (error) {
      alert(error.message);
      return;
    }

    await this.profileService.loadProfile();


    this.router.navigate(['/dashboard/inicio']);
  }
}