import { Component, input, output } from '@angular/core';
import { NodoCategoria } from '../../../estructuras-datos/arbol-categorias';

@Component({
  selector: 'app-arbol-menu',
  templateUrl: './arbol-menu.html',
  styleUrl: './arbol-menu.css',
})
export class ArbolMenu {
  nodo = input.required<NodoCategoria>();
  seleccionado = input<string>('todas');
  nivel = input<number>(0);
  elegir = output<string>();
}