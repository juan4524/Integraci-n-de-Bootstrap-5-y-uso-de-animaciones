import { bootstrapApplication} from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppComponent } from './app/app.component';
import { RUTAS } from './app/app.routes';
import { interceptorAutorizacion } from './app/nucleo/interceptor-autorizacion.interceptor';
import { interceptorErrores } from './app/nucleo/interceptor-errores.interceptor';
import { ApiFalsa } from './app/nucleo/api-falsa';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(RUTAS),
    provideHttpClient(withInterceptors([interceptorAutorizacion, interceptorErrores])),
    importProvidersFrom(InMemoryWebApiModule.forRoot(ApiFalsa, { delay: 400, apiBase: 'api/' })),
  ],
}).catch(console.error);