import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArbolCategorias } from '../../estructuras-datos/arbol-categorias';
import { CATEGORIAS_EJEMPLO } from '../../general/modelos/datos-ejemplo';
import { OBRAS_EJEMPLO } from '../../general/modelos/para-obras/obras-datos';
import { ArbolMenu } from './arbol-menu/arbol-menu';

@Component({
  selector: 'app-obras',
  imports: [RouterLink, ArbolMenu],
  templateUrl: './obras.html',
  styleUrl: './obras.css',
})
export class Obras {
elegir(id: string) {
  this.categoriaActiva.set(this.categoriaActiva() === id ? 'todas' : id);
}
  arbol = ArbolCategorias.desdeLista(CATEGORIAS_EJEMPLO);
  categoriaActiva = signal('todas');


temporada = OBRAS_EJEMPLO.find(o => o.id === 'cascanueces')!;


mostrarTemporada = computed(() => this.categoriaActiva() === 'todas');


obras = computed(() => {
  const ids = this.arbol.obtenerDescendientes(this.categoriaActiva());
  let lista = OBRAS_EJEMPLO.filter(o => ids.includes(o.categoriaId));


  if (this.mostrarTemporada()) {
    lista = lista.filter(o => o.id !== this.temporada.id);
  }
  return lista;
});
}
