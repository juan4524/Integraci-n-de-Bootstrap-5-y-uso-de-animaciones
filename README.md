# CineParaTodos

Integración de Bootstrap 5 y uso de animaciones
Enlace al repositorio:
https://github.com/juan4524/Integraci-n-de-Bootstrap-5-y-uso-de-animaciones
En este proyecto integré Bootstrap 5 para el diseño responsivo.
Lo instalé con npm y lo registré en angular.json para que sus estilos y scripts estén disponibles en toda la app.
Ejecuté el comando en la terminal desde la carpeta del proyecto (donde están angular.json y package.json):
npm install bootstrap
Después lo registré en angular.json para que aplique en toda la app:
 "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "src/styles.css"
            ],
            "scripts": [
              
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]
          },

Con esta configuración puedo utilizar las clases y componentes dentro de la API de Angular aplicándolos directamente en el HTML y el CSS, para mejorar la UX sin escribir código extenso: interfaz responsiva con botones, formularios, etc.
Configuración de animaciones
Instalación (terminal)
Instalé el paquete de animaciones para poder usarlo desde main.ts y habilitarlo como provider en toda la aplicación.
Comando para la terminal:
npm i @angular/animations@19.2.14
Nota: la versión mayor debe coincidir con la versión de Angular
Habilitación global en main.ts 
Habilito las animaciones en toda la app importando provideAnimations y registrándolo en los providers. Con esto puedo declarar triggers de Angular solo en los componentes que los necesiten (por ejemplo, entrada de tarjetas en los catálogos o una transición entre páginas en el componente raíz).

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppComponent } from './app/app.component';
import { RUTAS } from './app/app.routes';
import { interceptorAutorizacion } from './app/nucleo/interceptor-autorizacion.interceptor';
import { interceptorErrores } from './app/nucleo/interceptor-errores.interceptor';
import { ApiFalsa } from './app/nucleo/api-falsa';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(RUTAS),
    provideHttpClient(withInterceptors([interceptorAutorizacion, interceptorErrores])),
    importProvidersFrom(InMemoryWebApiModule.forRoot(ApiFalsa, { delay: 400, apiBase: 'api/' })),
    provideAnimations(), // habilitar animaciones para toda la app
  ],
}).catch(console.error);

Después declaramos los triggers en los componentes donde quiero aplicar los efectos (p. ej., Catálogo Gratis, Catálogo Premium, Detalle de Película y, opcionalmente, transición de rutas en el componente raíz).

Modificaciones al proyecto usando Bootstrap
Me moví al archivo app.component.html para aplicar clases y utilidades de Bootstrap directamente en la plantilla HTML para añadir responsividad sin tocar la lógica (enlaces, condiciones *ngIf y ng-template para autenticación y permisos).
Cambios mínimos realizados:
•	container para ancho y márgenes.
•	Utilidades de flex: d-flex, gap-2/3, justify-content-between, align-items-center para ordenar el header.
•	Badges para estados (Sesión / Premium / 18+).
•	Clases de botón (btn btn-*) para mantener los estilos consistentes en el botón de cerrar sesión y el de iniciar sesión.
•	Envolví el contenido principal en <main class="container py-3"> para un ancho legible y espaciado vertical.
Código modificado para añadir clases Bootstrap (app.component.html):


<header class="bg-body-tertiary border-bottom">
  <nav class="container d-flex flex-wrap align-items-center justify-content-between py-2">

    <div class="d-flex gap-3">
      <a routerLink="/inicio" class="nav-link px-0">Inicio</a>
      <a routerLink="/catalogo/gratis" class="nav-link px-0">Catálogo gratis</a>
      <a routerLink="/catalogo/premium" class="nav-link px-0">Catálogo premium</a>
    </div>

    <ng-container *ngIf="autenticado; else bloqueInvitado">
      <div class="d-flex align-items-center gap-2">
        <span class="badge text-bg-success">Sesión</span>
        <span class="badge text-bg-warning" *ngIf="premium">Premium</span>
        <span class="badge text-bg-danger" *ngIf="adulto">18+</span>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="cerrarSesion()">Cerrar sesión</button>
      </div>
    </ng-container>

    <ng-template #bloqueInvitado>
      <a routerLink="/iniciar-sesion" class="btn btn-primary btn-sm">Iniciar sesión</a>
    </ng-template>

  </nav>
</header>

<main class="container py-3">
  <router-outlet></router-outlet>
</main>

En la barra superior usé una combinación de utilidades de Bootstrap para ordenar el contenido y hacerlo responsivo. 
Descripción del header
La clase container fija un ancho máximo por breakpoint y agrega padding horizontal. Con d-flex convierto el <nav> en un contenedor flex y, junto con flex-wrap, esto permite que los elementos se acomoden en varias líneas en pantallas pequeñas, evitando desbordes. align-items-center centra verticalmente, mientras que justify-content-between reparte los bloques con espacio entre ellos (uno a la izquierda y otro a la derecha). py-2 añade un padding vertical moderado.
Dentro del menú, nav-link da estilo de navegación y px-0 quita el padding horizontal extra. gap-3 mantiene espaciado consistente. 
Con esta configuración el header queda limpio, tanto en escritorio como en móvil la distribución se adapta sin romper el diseño ni requerir CSS adicional.



Componente catálogo-gratis
Grilla responsiva y animaciones para el archivo catalogo-gratis.component.html.
En este archivo agregamos una grilla, imágenes e implementamos responsividad para los diferentes tamaños de pantalla utilizando los componentes utilitarios de Bootstrap.
Primero, en el componente del módulo se agregó la importación para usar animaciones: triggers, style, animate, query, stagger.
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
Y se agregó en el decorador del componente la propiedad animaciones que contiene los triggers definidos con @angular/animations:

@Component({
  selector: 'app-catalogo-gratis',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogo-gratis.component.html',
  styleUrls: ['./catalogo-gratis.component.css'],
  animations: [
    trigger('animLista', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'translateY(6px)' }),
          stagger(80, animate('220ms ease-out', style({ opacity: 1, transform: 'none' })))
        ], { optional: true })
      ])
    ]),
    trigger('animItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})

export class CatalogoGratisComponent {
  private peliculasSrv = inject(ServicioPeliculas);
  peliculas$ = this.peliculasSrv.listarGratis();
}
Otras modificaciones aparte
Se agregaron los enlaces para las imágenes en el modelo/datos de la API, apuntando a la carpeta assets/posters.
Ejemplo:
imagenUrl: 'assets/posters/sonic.jpg'
Se declaró la carpeta assets en angular.json para acceso global:
angular.json:
"tsConfig": "tsconfig.app.json",
            "assets": [
               "src/favicon.ico",
               "src/assets",
              { "glob": "**/*", "input": "public" } 
   ],
            "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "src/styles.css"
            ],
            "scripts": [
              
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]

catalogo-gratis.component.html
Modificaciones en catalogo-gratis.component.html:
Nos movimos a catalogo-gratis.component.html y añadimos clases de Bootstrap para obtener una grilla responsiva, sin tocar la lógica que ya estaba definida (*ngIf, *ngFor, routerLink).
Se envolvió todo en un container para tener anchos legibles y evitar que el contenido pegue a los bordes.
La lista se transformó en una fila responsiva con row y separación g-3.
A cada ítem se le añadieron columnas con col-12 col-sm-6 col-md-4 col-lg-3 (de 1 a 2 a 3 a 4 columnas según el ancho de pantalla, de móvil a escritorio).
Se quitaron viñetas con list-unstyled solo para presentaciones).
Y agregamos la imagen de cada película usando img-fluid para que sea responsiva.
solo se tocó la presentación.

<div class="container">
  <h2 class="h4 mb-3">Catálogo gratis</h2>

  <!-- Si ya llegaron los datos del observable -->
  <ng-container *ngIf="peliculas$ | async as peliculas; else cargando">
    <!-- Mensaje cuando no hay resultados -->
    <p *ngIf="peliculas.length === 0">No hay películas gratis disponibles.</p>

    <!-- LISTA: grid Bootstrap + trigger de lista -->
    <ul
      class="rejilla row list-unstyled g-3"
      *ngIf="peliculas.length > 0"
      [@animLista]="'on'"
    >
      <!-- ITEM: columna responsive + trigger de item -->
      <li
  *ngFor="let p of peliculas"
  class="tarjeta col-12 col-sm-6 col-md-4 col-lg-3"
  [@animItem]="'on'"
>
  <!-- NUEVO: poster -->
  <img [src]="p.imagenUrl"
       class="img-fluid rounded mb-2"
       alt="{{ p.titulo }}"
       loading="lazy">

  <h3 class="h6 mb-1">{{ p.titulo }}</h3>

         <!-- NUEVO: etiquetas -->

        <p class="linea mb-2">
          <span class="etiqueta" [class.etq-adulto]="p.clasificacion === 'C'">
            {{ p.clasificacion === 'C' ? '18+' : p.clasificacion }}
          </span>
          <span *ngIf="p.esPremium" class="etiqueta etq-premium">Premium</span>
        </p>

        <p class="desc mb-2">{{ p.descripcion }}</p>

        <a
          [routerLink]="['/pelicula', p.id]"
          class="btn btn-outline-primary btn-sm"
        >
          Ver detalle
        </a>
      </li>
    </ul>
  </ng-container>

  <!-- Placeholder mientras carga -->
  <ng-template #cargando>
    <p>Cargando el catálogo…</p>
  </ng-template>

  <!-- Enlace de retorno -->
  <p class="mt-3">
    <a routerLink="/inicio">Volver a inicio</a>
  </p>
</div>

Detalle de película (vista responsive con Bootstrap)
En la pantalla de detalle organizamos la información en dos zonas el póster y los datos (título, clasificación, descripción).
Como en el HTML anterior solo tocamos la presentación.
Aplicamos un diseño responsivo en móviles, con el poster arria y la descripción abajo, desde pantallas chicas en adelante, se verán 2 columnas (póster 4/12, texto 8/12). 
Esto se hiso con la fila row y las columnas col-12 col-sm-4 y col-12 col-sm-8, más un g-3 para separar bloques.
Aplicamos un poster adaptable, en la imagen usando img-fluid y rounded para que no desborde y mantenga bordes suaves, esto se carga con loading="lazy" para no frenar la vista.
Aplicamos una jerarquía sencilla, donde el titulo queda como encabezado, la clasificación y la marca Premium siguen usando las etiquetas personalizadas.
Ser aplico en el botón volver un estilo en bootstrap (btn btn-outline-secondary btn-sm) para darle un margen superior.



<!-- Vista de detalle:
     - Datos vienen de pelicula$ (Observable) con async y alias "p"
     - Layout responsive con Bootstrap: poster mas el texto en dos columnas
-->
<ng-container *ngIf="pelicula$ | async as p">

  <!-- fila con separacion y alineacion superior -->
  <div class="row g-3 align-items-start">

    <!-- Columna del poster, ocupa toda la fila en móvil, 4/12 desde sm -->
    <div class="col-12 col-sm-4">
      <img
        [src]="p.imagenUrl"
        class="img-fluid rounded mb-2"  
        alt="{{ p.titulo }}"
        loading="lazy">                
    </div>

    <!-- Columna del contenido: 8/12 desde sm -->
    <div class="col-12 col-sm-8">
      <h2 class="h4 mb-2">{{ p.titulo }}</h2>

      <!-- La clasificacion usa la etiqueta y marca 18+ cuando es 'C' -->
      <p class="mb-2">
        Clasificación:
        <span class="etiqueta" [class.etq-adulto]="p.clasificacion === 'C'">
          {{ p.clasificacion === 'C' ? '18+' : p.clasificacion }}
        </span>
        <span *ngIf="p.esPremium" class="etiqueta etq-premium">Premium</span>
      </p>

      <p class="mb-0">{{ p.descripcion }}</p>
    </div>
  </div>

  <!-- Accion de retorno con stilos de boostrap-->
  <button
    type="button"
    class="btn btn-outline-secondary btn-sm mt-3"
    (click)="volver()"
  >
    ← Volver
  </button>
</ng-container>



Catálogo premium
En este módulo se repitió el mismo patrón que en catalogo gratis, solo que, enfocado a la lista premium, aplicamos Bootstrap para crear un listado responsivo (fila row, columnas col-12 col-sm-6 col-md-4 col-lg-3, separación g-3, imágenes con img-fluid y botón con btn btn-outline-primary btn-sm).
Las animaciones se usan en la lista y las tarjetas para reutilizar los triggers (animLista, animItem) para una entrada suave de los elementos.
Las películas se muestran con la propiedad imagenUrl (cargada desde assets/posters/...), con loading="lazy" para rendimiento.
Aplicamos un container para ancho legible y márgenes horizontales.
row + g-3 para construir la grilla y separar tarjetas.
col-12 col-sm-6 col-md-4 col-lg-3 para ajustar columnas según el tamaño de pantalla.
img-fluid rounded mb-2 para que el póster se adapte al ancho de la tarjeta, con bordes redondeados.
Botón con btn btn-outline-primary btn-sm para un call to action claro y consistente.
catalogo-premium.component.html
<div class="container">
  <h2 class="h4 mb-3">Catálogo premium</h2>

  <ul
    class="rejilla row list-unstyled g-3"
    *ngIf="(peliculas$ | async)?.length; else vacio"
    [@animLista]="'on'"
  >
    <li
      *ngFor="let p of (peliculas$ | async)"
      class="tarjeta col-12 col-sm-6 col-md-4 col-lg-3"
      [@animItem]="'on'"
    >
      <!-- poster -->
      <img
        [src]="p.imagenUrl"
        class="img-fluid rounded mb-2"
        alt="{{ p.titulo }}"
        loading="lazy"
      >

      <h3 class="h6 mb-1">{{ p.titulo }}</h3>

      <p class="linea mb-2">
        <span class="etiqueta" [class.etq-adulto]="p.clasificacion === 'C'">
          {{ p.clasificacion === 'C' ? '18+' : p.clasificacion }}
        </span>
        <span *ngIf="p.esPremium" class="etiqueta etq-premium">Premium</span>
      </p>

      <p class="desc mb-2">{{ p.descripcion }}</p>

      <a [routerLink]="['/pelicula', p.id]" class="btn btn-outline-primary btn-sm">
        Ver detalle
      </a>
    </li>
  </ul>

  <ng-template #vacio>
    <p>No hay películas premium disponibles.</p>
  </ng-template>

  <p class="mt-3">
    <a routerLink="/inicio">Volver a inicio</a>
  </p>
</div>
Las imágenes se cargan desde assets/posters/... ya ,lo declaramos en angular.json, y las animaciones funcionan porque habilitamos provideAnimations() en main.ts. 
El modulo queda responsivo, con transiciones suaves y no altera la loica que ya estab definida.






Referencias:
Angular. (s. f.). Angular Animations. Angular.io. Recuperado el 15 de septiembre de 2025, de https://v17.angular.io/guide/animations
Bootstrap Team. (s. f.). Bootstrap. Recuperado el 15 de septiembre de 2025, de https://getbootstrap.com/
ng-bootstrap Team. (s. f.). Getting Started. ng-bootstrap. Recuperado el 15 de septiembre de 2025, de https://ng-bootstrap.github.io/#/getting-started






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
