import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicioPeliculas } from '../../nucleo/servicio-peliculas.service';

@Component({
  selector: 'app-catalogo-gratis',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogo-gratis.component.html',
  styleUrls: ['./catalogo-gratis.component.css'],
})
export class CatalogoGratisComponent {
  private peliculasSrv = inject(ServicioPeliculas);
  peliculas$ = this.peliculasSrv.listarGratis();
}