import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { CatalogoGratisComponent } from './paginas/catalogo-gratis/catalogo-gratis.component';
import { CatalogoPremiumComponent } from './paginas/catalogo-premium/catalogo-premium.component';
import { PeliculaDetalleComponent } from './paginas/pelicula-detalle/pelicula-detalle.component';
import { IniciarSesionComponent } from './paginas/iniciar-sesion/iniciar-sesion.component';
import { AccesoNoAutorizadoComponent } from './paginas/acceso-no-autorizado/acceso-no-autorizado.component';
import { NoEncontradoComponent } from './paginas/no-encontrado/no-encontrado.component';
import { guardiaAutenticacion } from './nucleo/guardia-autenticacion.guard';
import { guardiaPremium } from './nucleo/guardia-premium.guard';
import { guardiaAdulto } from './nucleo/guardia-adulto.guard';

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

  { path: 'iniciar-sesion', component: IniciarSesionComponent, title: 'Iniciar sesion' },
  { path: 'acceso-no-autorizado', component: AccesoNoAutorizadoComponent, title: 'Acceso no autorizado' },
  { path: '**', component: NoEncontradoComponent, title: 'No encontrado' },
];