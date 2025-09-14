import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';


export interface Pelicula {
  id: string;
  titulo: string;
  clasificacion: 'A' | 'B' | 'C';
  esPremium: boolean;
  descripcion: string;
  imagenUrl: string; 
}

const API_BASE = 'api/';

@Injectable({ providedIn: 'root' })
export class ServicioPeliculas {
  private http = inject(HttpClient);

  listarTodas() {
    return this.http.get<Pelicula[]>(`${API_BASE}peliculas`)
      .pipe(catchError(err => throwError(() => err)));// -> GET /api/peliculas
  }
  listarGratis()  { return this.listarTodas().pipe(map(xs => xs.filter(p => !p.esPremium))); }
  listarPremium() { return this.listarTodas().pipe(map(xs => xs.filter(p =>  p.esPremium))); }

  buscarPorId(id: string) {// -> GET /api/peliculas/1
    return this.http.get<Pelicula>(`${API_BASE}peliculas/${id}`)
      .pipe(catchError(err => throwError(() => err)));// -> 404 si no existe
  }
}



