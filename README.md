# CineParaTodos

## Integración de Bootstrap 5 y uso de animaciones

Este proyecto integra **Bootstrap 5** para diseño responsivo y **Angular Animations** para transiciones sutiles que mejoran la UX.

---

## 1) Integración de Bootstrap 5

**Instalación (terminal)**

```bash
npm install bootstrap
```

**Registro global en `angular.json`** (para tener estilos y scripts disponibles en toda la app):

```jsonc
{
  "styles": [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/styles.css"
  ],
  "scripts": [
    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
  ]
}
```

Con esta configuración puedes usar clases y componentes de Bootstrap directamente en tus plantillas **HTML** y estilos **CSS** para lograr una interfaz responsiva (botones, formularios, grillas, badges, etc.).

---

## 2) Configuración de animaciones

**Instalación (terminal)**

```bash
npm i @angular/animations@19.2.14
```
> Nota: la **versión mayor** debe coincidir con tu versión de Angular.

**Habilitación global en `main.ts`**  
Importa y registra el provider una sola vez para toda la app. Luego, cada componente declara **triggers** solo si los necesita.

```ts
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
    provideAnimations() // habilitar animaciones para toda la app
  ],
}).catch(console.error);
```

---

## 3) Modificaciones con Bootstrap — `app.component.html`

Se aplicaron utilidades y componentes de Bootstrap directamente en la plantilla para añadir **responsividad** sin tocar la lógica de autenticación/permiso (`*ngIf`, `ng-template`, `routerLink`).

**Cambios mínimos realizados:**
- `container` para ancho y márgenes.
- Utilidades de flex: `d-flex`, `gap-2/3`, `justify-content-between`, `align-items-center` para ordenar el header.
- `badge` para estados (Sesión / Premium / 18+).
- Clases de botón (`btn btn-*`) para estilos consistentes.
- Envoltorio principal en `<main class="container py-3">` para ancho legible y espaciado vertical.

```html
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
```

**Descripción del header (qué hace cada utilidad):**  
`container` fija anchos por breakpoint y añade padding horizontal. `d-flex` convierte el `<nav>` en contenedor flex; con `flex-wrap` permite que el contenido salte de línea en pantallas chicas. `align-items-center` centra verticalmente los elementos en la fila. `justify-content-between` reparte bloques con espacio entre ellos (izquierda/derecha). `py-2` agrega padding vertical moderado.  
Dentro del menú, `nav-link` estiliza los enlaces y `px-0` quita padding extra. `gap-3` mantiene un espaciado uniforme.

---

## 4) `catalogo-gratis` — grilla responsiva + animaciones

Se agregó **grilla**, **imágenes** y **responsividad** usando utilidades de Bootstrap. Además, se declararon **triggers** de Angular Animations para entrada suave de la lista y de cada tarjeta.

**Triggers (TS)**

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicioPeliculas } from '../../nucleo/servicio-peliculas.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-catalogo-gratis',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogo-gratis.component.html',
  styleUrls: ['./catalogo-gratis.component.css'],
  animations: [
    // Lista: entra en bloque y escalona los <li>
    trigger('animLista', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'translateY(6px)' }),
          stagger(80, animate('220ms ease-out', style({ opacity: 1, transform: 'none' })))
        ], { optional: true })
      ])
    ]),
    // Item: fade + pequeño scale al aparecer
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
```

**Plantilla (HTML)**

```html
<div class="container">
  <h2 class="h4 mb-3">Catálogo gratis</h2>

  <ng-container *ngIf="peliculas$ | async as peliculas; else cargando">
    <p *ngIf="peliculas.length === 0">No hay películas gratis disponibles.</p>

    <ul class="rejilla row list-unstyled g-3"
        *ngIf="peliculas.length > 0"
        [@animLista]="'on'">

      <li *ngFor="let p of peliculas"
          class="tarjeta col-12 col-sm-6 col-md-4 col-lg-3"
          [@animItem]="'on'">

        <!-- Poster responsivo -->
        <img [src]="p.imagenUrl"
             class="img-fluid rounded mb-2"
             alt="{{ p.titulo }}"
             loading="lazy">

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
  </ng-container>

  <ng-template #cargando>
    <p>Cargando el catálogo…</p>
  </ng-template>

  <p class="mt-3">
    <a routerLink="/inicio">Volver a inicio</a>
  </p>
</div>
```

**Assets**  
Las imágenes se referencian en los datos como `imagenUrl: 'assets/posters/sonic.jpg'`.  
Asegúrate de declarar assets en `angular.json`:

```jsonc
{
  "assets": [
    "src/favicon.ico",
    "src/assets",
    { "glob": "**/*", "input": "public" }
  ]
}
```

---

## 5) Detalle de película — vista responsive con Bootstrap

Dos zonas: **póster** y **datos** (título, clasificación, descripción). Sólo se tocó la **presentación**: sin cambios de lógica ni guards.

- En móvil el póster va arriba; desde `sm` se ve en **dos columnas** (4/12 y 8/12).
- `img-fluid` + `rounded` para que el póster no desborde y tenga bordes suaves.
- Botón **Volver** con estilos Bootstrap.

```html
<ng-container *ngIf="pelicula$ | async as p">
  <div class="row g-3 align-items-start">
    <div class="col-12 col-sm-4">
      <img [src]="p.imagenUrl"
           class="img-fluid rounded mb-2"
           alt="{{ p.titulo }}"
           loading="lazy">
    </div>

    <div class="col-12 col-sm-8">
      <h2 class="h4 mb-2">{{ p.titulo }}</h2>

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

  <button type="button"
          class="btn btn-outline-secondary btn-sm mt-3"
          (click)="volver()">← Volver</button>
</ng-container>
```

---

## 6) Catálogo premium — grid responsiva + animaciones

Mismo patrón que en **catálogo gratis**, enfocado a la lista premium.  
No se modificó la lógica; sólo presentación y animaciones.

**HTML**

```html
<div class="container">
  <h2 class="h4 mb-3">Catálogo premium</h2>

  <ul class="rejilla row list-unstyled g-3"
      *ngIf="(peliculas$ | async)?.length; else vacio"
      [@animLista]="'on'">

    <li *ngFor="let p of (peliculas$ | async)"
        class="tarjeta col-12 col-sm-6 col-md-4 col-lg-3"
        [@animItem]="'on'">

      <img [src]="p.imagenUrl"
           class="img-fluid rounded mb-2"
           alt="{{ p.titulo }}"
           loading="lazy">

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
```

> Las animaciones funcionan porque habilitaste `provideAnimations()` en `main.ts`.  
> Las imágenes se cargan desde `assets/posters/...` (definido en `angular.json`).

---

## Referencias

- Angular. **Angular Animations** — https://v17.angular.io/guide/animations  
- Bootstrap Team. **Bootstrap** — https://getbootstrap.com/  
- ng-bootstrap Team. **Getting Started** — https://ng-bootstrap.github.io/#/getting-started
