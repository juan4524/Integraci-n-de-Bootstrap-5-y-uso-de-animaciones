import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicioPeliculas } from '../../nucleo/servicio-peliculas.service';

@Component({
  selector: 'app-catalogo-premium',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalogo-premium.component.html',
  styleUrls: ['./catalogo-premium.component.css'],
})
export class CatalogoPremiumComponent {
  private peliculasSrv = inject(ServicioPeliculas);
  peliculas$ = this.peliculasSrv.listarPremium();
}