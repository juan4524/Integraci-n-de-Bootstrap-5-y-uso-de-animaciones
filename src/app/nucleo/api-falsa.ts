import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, ResponseOptions } from 'angular-in-memory-web-api';

@Injectable({ providedIn: 'root' })
export class ApiFalsa implements InMemoryDbService {
  createDb() {
    const peliculas = [
      { id: '1', titulo: 'Apta para todos',  clasificacion: 'A', esPremium: false, descripcion: 'Familiar', imagenUrl: 'assets/posters/masha.jpg' },
      { id: '2', titulo: 'Drama popular',    clasificacion: 'B', esPremium: true,  descripcion: 'Solo premium', imagenUrl: 'assets/posters/soul.jpg' },
      { id: '3', titulo: 'Suspenso adulto',  clasificacion: 'C', esPremium: true,  descripcion: 'Clasificación C (18+)', imagenUrl: 'assets/posters/red.jpg' },
      { id: '4', titulo: 'Comedia ligera',   clasificacion: 'A', esPremium: false, descripcion: 'Gratis para todos', imagenUrl: 'assets/posters/sonic.jpg' }
    ];
    return { peliculas }; // -> GET /api/peliculas
  } // -> /api/peliculas
  

  post(reqInfo: RequestInfo) {
    // POST /api/auth/iniciar-sesion
    if (reqInfo.url.endsWith('/auth/iniciar-sesion')) {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) as any;
      const usuarios = [
        { correo: 'gratis@cine.com',  contrasena: '123', esPremium: false, esAdulto: false },
        { correo: 'premium@cine.com', contrasena: '123', esPremium: true,  esAdulto: false },
        { correo: 'adulto@cine.com',  contrasena: '123', esPremium: true,  esAdulto: true  },
      ];
      const u = usuarios.find(x => x.correo === body?.correo && x.contrasena === body?.contrasena);
      const options: ResponseOptions = u
        ? { status: 200, body: { token: 'FAKE-' + Date.now(), esPremium: u.esPremium, esAdulto: u.esAdulto } }
        : { status: 401, body: { mensaje: 'Credenciales invalidas' } };
      return reqInfo.utils.createResponse$(() => options);
    }
    return undefined;
  }
}