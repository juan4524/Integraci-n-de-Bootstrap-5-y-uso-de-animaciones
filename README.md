# CineParaTodos

Autenticación
En la practica se implementa la simulacion de un registro pre definido, donde tenemos tres usuarios de prueba (gratis, premium y adulto) también se simula en backend con angular-in-memory-web-api.
Cuando se inicia sesión el servicio autenticación guarda en el almacenamiento local un token y dos banderas, una para el usuario premium y otra si el usuario es adulto, mayor de 18 años.
Las banderas representan privilegios del usuario en la aplicación, utilizamos un interceptor de autorización para añadir automáticamente el encabezado Authorization: Bearer <token> a cada solicitud hecha a nuestra API (base api/), esto hace que un visitante solo pueda acceder a la sección gratuita del sitio, un usuario premium entra a la sección premium, y un usuario premium identificado como adulto puede ver el catálogo de películas clasificadas C (18+).

```ts
// src/app/nucleo/servicio-autenticacion.service.ts
@Injectable({ providedIn: 'root' })
export class ServicioAutenticacion {
  private http = inject(HttpClient);

  iniciarSesion(correo: string, contrasena: string) {
    return this.http.post<RespuestaInicioSesion>(`${API_BASE}auth/iniciar-sesion`, { correo, contrasena })
      .pipe(
        tap(r => {  // ServicioAutenticacion: guardar sesion
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
```

```ts
// src/app/nucleo/interceptor-autorizacion.interceptor.ts
export const interceptorAutorizacion: HttpInterceptorFn = (req, next) => {
  const auth = inject(ServicioAutenticacion);
  const token = auth.obtenerToken();
  const esApiPropia = req.url.startsWith(API_BASE);

  const reqConToken = (token && esApiPropia)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqConToken);
};
```

Manejo de errores
El manejo global está centralizado en el interceptor de errores, cuando el servidor simulado responde con 401 (no autorizado), el interceptor redirige a /iniciar-sesion, los demás errores dejan pasar al que hiso la llamada.
En los listados de las películas el servicio hoy re emite el error, mientras en el detalle de películas el guard captura los fallos y manda a /no-encontrado.
En el login el componente manda el mensaje de error del back end.

```ts
// src/app/nucleo/interceptor-errores.interceptor.ts
export const interceptorErrores: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigateByUrl('/iniciar-sesion');
      }
      return throwError(() => error);
    })
  );
};
```

```ts
// src/app/nucleo/servicio-peliculas.service.ts
@Injectable({ providedIn: 'root' })
export class ServicioPeliculas {
  private http = inject(HttpClient);

  listarTodas() {
    return this.http.get<Pelicula[]>(`${API_BASE}peliculas`)
      .pipe(catchError(err => throwError(() => err)));
  }
  listarGratis()  { return this.listarTodas().pipe(map(xs => xs.filter(p => !p.esPremium))); }
  listarPremium() { return this.listarTodas().pipe(map(xs => xs.filter(p =>  p.esPremium))); }

  buscarPorId(id: string) {
    return this.http.get<Pelicula>(`${API_BASE}peliculas/${id}`)
      .pipe(catchError(err => throwError(() => err)));
  }
}
```

Configuración de rutas
En la aplicación SPA declaramos las rutas en app.routes.ts. estan las vistas de /inicio y /catalogo/gratis, y las vistas que requieren permisos, /catalogo/premium y /película/:id. y también las rutas auxiliares /iniciar-sesion, /acceso-no-autorizado y una ruta comodina ** para no encontrado, si el usuario intenta ir a un componente o id que no existe será redirigido a esta página.

```ts
// src/app/app.routes.ts
export const RUTAS: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: InicioComponent, title: 'Inicio' },

  { path: 'catalogo/gratis', component: CatalogoGratisComponent, title: 'Catalogo Gratis' },

  // Solo usuarios autenticados y con premium
  { path: 'catalogo/premium',
    component: CatalogoPremiumComponent,
    title: 'Catalogo Premium',
    canActivate: [guardiaAutenticacion, guardiaPremium]
  },

  // Cualquiera puede entrar al detalle, pero si la película es "C" (18+),
  // el guardianAdulto validara el adulto+autenticacion en tiempo real.
  { path: 'pelicula/:id',
    component: PeliculaDetalleComponent,
    title: 'Detalle de Película',
    canActivate: [guardiaAdulto]
  },

  { path: 'iniciar-sesion', component: IniciarSesionComponent, title: 'Iniciar sesión' },
  { path: 'acceso-no-autorizado', component: AccesoNoAutorizadoComponent, title: 'Acceso no autorizado' },
  { path: '**', component: NoEncontradoComponent, title: 'No encontrado' },
];
```

Rutas protegidas, autenticación y autorización
Protegimos las rutas sensibles con canActivate.
En /catalogo/premium se exige sesión iniciada y rol premium.
En /pelicula/:id
Ates de mostrar los detalles la app consulta si su clasificación es de C +18, esta clasificación requiere que el usuario sea adulto, si el usuario no cumple con la regla es redirigido automáticamente a /acceso-no-autorizado (o a /iniciar-sesion, según el caso).
Las rutas están separadas entre rutas públicas, privadas y para adultos para reflejar los niveles de autorización.

```ts
// src/app/app.routes.ts (fragmentos protegidos)
{ path: 'catalogo/premium',
  component: CatalogoPremiumComponent,
  title: 'Catalogo Premium',
  canActivate: [guardiaAutenticacion, guardiaPremium]
},

{ path: 'pelicula/:id',
  component: PeliculaDetalleComponent,
  title: 'Detalle de Película',
  canActivate: [guardiaAdulto]
},
```

Guards
Se implementaron tres guards, para verificar la sesión, el guard de premium comprueba la bandera premium, y el de adulto carga la película y, si es C, exige que el usuario sea adulto, de lo contrario redirige.

```ts
// src/app/nucleo/guardia-autenticacion.guard.ts
// Guardia de Autenticación: comprueba si hay sesión; si no, envía a /iniciar-sesion.
if (auth.estaAutenticado()) return true;
router.navigate(['/iniciar-sesion']);
return false;
```

```ts
// src/app/nucleo/guardia-premium.guard.ts
// Guardia de Premium, Autentica y verifica la bandera premium para entrar a la sección exclusiva.
if (auth.estaAutenticado() && auth.esPremium()) return true;
router.navigate(['/acceso-no-autorizado']);
return false;
```

```ts
// src/app/nucleo/guardia-adulto.guard.ts
// Guardia de Adulto (18+): al entrar al detalle, carga la película y, si es C, exige que el usuario sea adulto;si no, redirige a /acceso-no-autorizado.
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
```

Estos guards aíslan la lógica de seguridad del resto de la UI y garantizan que solo los usuarios con permisos correctos atraviesen cada enlace.

Datos y API simulada
Se uso un api simulado en memoria para demostrar el flujo completo del back end, implementado una semilla de 4 películas, dos gratis y dos premium, en donde una de ellas es de clasificación C (18+) que sirve para probar la restricción de edad y se definieron los usuarios de prueba (gratis, premium y adulto).

```ts
// src/app/nucleo/api-falsa.ts
@Injectable({ providedIn: 'root' })
export class ApiFalsa implements InMemoryDbService {
  createDb() {
    const peliculas = [
      { id: '1', titulo: 'Apta para todos',  clasificacion: 'A', esPremium: false, descripcion: 'Familiar.' },
      { id: '2', titulo: 'Drama popular',    clasificacion: 'B', esPremium: true,  descripcion: 'Solo premium.' },
      { id: '3', titulo: 'Suspenso adulto',  clasificacion: 'C', esPremium: true,  descripcion: 'Clasificación C (18+).' },
      { id: '4', titulo: 'Comedia ligera',   clasificacion: 'A', esPremium: false, descripcion: 'Gratis para todos.' },
    ];
    return { peliculas }; //  GET /api/peliculas
  } // /api/peliculas

  // login simulado
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
        : { status: 401, body: { mensaje: 'Credenciales inválidas' } };
      return reqInfo.utils.createResponse$(() => options);
    }
    return undefined;
  }
}
```

Arranque y registro de Router/HTTP

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(RUTAS),
    provideHttpClient(withInterceptors([interceptorAutorizacion, interceptorErrores])),
    importProvidersFrom(InMemoryWebApiModule.forRoot(ApiFalsa, { delay: 400, apiBase: 'api/' })),
  ],
}).catch(console.error);
```

Referencias
Dev, L. A. (14 de marzo de 2023). youtube. Obtenido de https://www.youtube.com/watch?v=WyydiGTOTxQ&t=1s
Angular. (2025). Route guards. Angular Documentation. Recuperado el 4 de septiembre de 2025, de https://angular.dev/guide/routing/route-guards
Angular. (2025). HTTP interceptors. Angular Documentation. Recuperado el 4 de septiembre de 2025, de https://angular.dev/guide/http/interceptors
Luna, M. (2024). Authentication and authorization in Angular. Medium. Recuperado el 4 de septiembre de 2025, de https://medium.com/@matheusluna96/authentication-and-authorization-in-angular-0697ab16e465






This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
