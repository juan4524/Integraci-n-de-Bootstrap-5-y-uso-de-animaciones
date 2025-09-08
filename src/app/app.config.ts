import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { RUTAS } from './app.routes'; 
import { interceptorAutorizacion } from './nucleo/interceptor-autorizacion.interceptor';
import { interceptorErrores } from './nucleo/interceptor-errores.interceptor';
import { ApiFalsa } from './nucleo/api-falsa';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(RUTAS), 
    provideHttpClient(withInterceptors([interceptorAutorizacion, interceptorErrores])),
    importProvidersFrom(InMemoryWebApiModule.forRoot(ApiFalsa, { delay: 400, apiBase: 'api/' })),
  ],
};
