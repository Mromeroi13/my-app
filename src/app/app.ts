import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-app'); // Variable de señal para almacenar el título de la aplicación, que puede ser utilizada en la plantilla para mostrar el nombre de la aplicación de manera reactiva
}
