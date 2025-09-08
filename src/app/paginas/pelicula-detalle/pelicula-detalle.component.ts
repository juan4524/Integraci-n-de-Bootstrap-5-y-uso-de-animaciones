import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServicioPeliculas } from '../../nucleo/servicio-peliculas.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-pelicula-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pelicula-detalle.component.html',
  styleUrls: ['./pelicula-detalle.component.css']
})
export class PeliculaDetalleComponent {
  private ruta = inject(ActivatedRoute);
  private svc = inject(ServicioPeliculas);
  private loc = inject(Location);

  pelicula$ = this.ruta.paramMap.pipe(
    switchMap(p => this.svc.buscarPorId(p.get('id')!))
  );

  volver() { this.loc.back(); }
}
