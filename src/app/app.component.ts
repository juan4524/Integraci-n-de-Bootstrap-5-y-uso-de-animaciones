import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicioAutenticacion } from './nucleo/servicio-autenticacion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private auth = inject(ServicioAutenticacion);
  private router = inject(Router);

  get autenticado() { return this.auth.estaAutenticado(); }
  get premium()      { return this.auth.esPremium(); }
  get adulto()       { return this.auth.esAdulto(); }

  cerrarSesion() {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/inicio');
  }
}