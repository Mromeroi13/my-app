import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

// La clase DashboardLayoutComponent representa el diseño principal del panel de control
@Component({
  selector: 'app-dashboard-layout', // Selector para usar este componente en otras partes de la aplicación
  standalone: true, // Indica que este componente es independiente y no depende de un módulo específico
  imports: [
    RouterOutlet, // Importa el RouterOutlet para permitir la navegación entre diferentes rutas dentro del diseño del panel de control  
    NavbarComponent // Importa el componente NavbarComponent para incluir la barra de navegación en el diseño del panel de control
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {}