import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ServicioAutenticacion } from './servicio-autenticacion.service';

export const guardiaPremium: CanActivateFn = () => {
  const auth = inject(ServicioAutenticacion);
  const router = inject(Router);
  if (auth.estaAutenticado() && auth.esPremium()) return true;
  router.navigate(['/acceso-no-autorizado']);
  return false;
};