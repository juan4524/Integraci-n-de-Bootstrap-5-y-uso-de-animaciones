import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ServicioPeliculas } from './servicio-peliculas.service';
import { ServicioAutenticacion } from './servicio-autenticacion.service';
import { catchError, map, of } from 'rxjs';

export const guardiaAdulto: CanActivateFn = (ruta: ActivatedRouteSnapshot) => {
  const peliculas = inject(ServicioPeliculas);
  const auth = inject(ServicioAutenticacion);
  const router = inject(Router);

  const id = ruta.paramMap.get('id');
  if (!id) return true;

  return peliculas.buscarPorId(id).pipe(
    map(p => {
      if (p.clasificacion !== 'C') return true; // libre acceso
      if (auth.estaAutenticado() && auth.esAdulto()) return true;
      router.navigate(['/acceso-no-autorizado']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/no-encontrado']);
      return of(false);
    })
  );
};