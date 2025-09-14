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