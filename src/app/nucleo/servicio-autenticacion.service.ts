import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

export interface RespuestaInicioSesion {
  token: string;
  esPremium: boolean;
  esAdulto: boolean;
}

const CLAVE_TOKEN = 'token_autenticacion';
const CLAVE_PREMIUM = 'usuario_premium';
const CLAVE_ADULTO = 'usuario_adulto';
const API_BASE = 'api/';

@Injectable({ providedIn: 'root' })
export class ServicioAutenticacion {
  private http = inject(HttpClient);

  iniciarSesion(correo: string, contrasena: string) {
    return this.http.post<RespuestaInicioSesion>(`${API_BASE}auth/iniciar-sesion`, { correo, contrasena })
      .pipe(
        tap(r => {   // ServicioAutenticacion: guardar sesión
          localStorage.setItem(CLAVE_TOKEN, r.token);
          localStorage.setItem(CLAVE_PREMIUM, String(r.esPremium));
          localStorage.setItem(CLAVE_ADULTO, String(r.esAdulto));
        }),
        catchError(err => throwError(() => err))
      );
  }
  cerrarSesion() { localStorage.removeItem(CLAVE_TOKEN); localStorage.removeItem(CLAVE_PREMIUM); localStorage.removeItem(CLAVE_ADULTO); }
  estaAutenticado() { return !!localStorage.getItem(CLAVE_TOKEN); }
  esPremium()       { return localStorage.getItem(CLAVE_PREMIUM) === 'true'; }
  esAdulto()        { return localStorage.getItem(CLAVE_ADULTO)  === 'true'; }
  obtenerToken()    { return localStorage.getItem(CLAVE_TOKEN); }
}