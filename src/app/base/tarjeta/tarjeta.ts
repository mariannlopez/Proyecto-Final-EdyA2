import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta.html',
  styleUrl: './tarjeta.css',
})
export class Tarjeta {
  etiqueta = input<string>('EN CARTELERA');
  frase = input<string>('');
  autor = input<string>('');
}