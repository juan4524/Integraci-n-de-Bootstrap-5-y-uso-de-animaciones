import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ServicioAutenticacion } from './servicio-autenticacion.service';

const API_BASE = 'api/';

export const interceptorAutorizacion: HttpInterceptorFn = (req, next) => {
  const auth = inject(ServicioAutenticacion);
  const token = auth.obtenerToken();
  const esApiPropia = req.url.startsWith(API_BASE);

  const reqConToken = (token && esApiPropia)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqConToken);
};