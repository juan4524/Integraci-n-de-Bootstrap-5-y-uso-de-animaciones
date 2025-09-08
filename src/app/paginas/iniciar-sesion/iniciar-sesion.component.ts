import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioAutenticacion } from '../../nucleo/servicio-autenticacion.service';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './iniciar-sesion.component.html',
})
export class IniciarSesionComponent {
  private fb = inject(FormBuilder);
  private auth = inject(ServicioAutenticacion);
  private router = inject(Router);

  cargando = false;
  error = '';

  formulario = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]],
  });

  entrar() {
    if (this.formulario.invalid) return;
    this.cargando = true; this.error = '';
    const { correo, contrasena } = this.formulario.value;
    this.auth.iniciarSesion(correo!, contrasena!).subscribe({
      next: () => { this.cargando = false; this.router.navigateByUrl('/catalogo/premium'); },
      error: (e) => { this.cargando = false; this.error = e?.error?.mensaje ?? 'Error al iniciar sesion'; },
    });
  }
}