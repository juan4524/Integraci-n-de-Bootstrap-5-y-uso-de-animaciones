import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ServicioAutenticacion } from './servicio-autenticacion.service';

export const guardiaAutenticacion: CanActivateFn = () => {
  const auth = inject(ServicioAutenticacion);
  const router = inject(Router);
  if (auth.estaAutenticado()) return true;
  router.navigate(['/iniciar-sesion']);
  return false;
};