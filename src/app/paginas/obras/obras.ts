import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArbolCategorias } from '../../estructuras-datos/arbol-categorias';
import { CATEGORIAS_EJEMPLO } from '../../general/modelos/datos-ejemplo';
import { OBRAS_EJEMPLO } from '../../general/modelos/para-obras/obras-datos';
import { ArbolMenu } from './arbol-menu/arbol-menu';
import { ObraBuscable, TrieObras } from '../../estructuras-datos/trie';

@Component({
  selector: 'app-obras',
  imports: [RouterLink, ArbolMenu],
  templateUrl: './obras.html',
  styleUrl: './obras.css',
})
export class Obras {

  private router = inject(Router);
  private trie = new TrieObras(); 

  consulta = signal('');
  menuAbierto = signal(false); 
  arbol = ArbolCategorias.desdeLista(CATEGORIAS_EJEMPLO);
  categoriaActiva = signal('todas');


  temporada = OBRAS_EJEMPLO.find(o => o.id === 'cascanueces')!;


  mostrarTemporada = computed(() => this.categoriaActiva() === 'todas');

  constructor(){
    this.trie.cargarObras(
      OBRAS_EJEMPLO.map(o =>({
        id: o.id,
        titulo: o.titulo,
        subtitulo: o.fecha,
      }))
    );
  }

  sugerencias = computed<ObraBuscable[]>(() =>{
    const texto = this.consulta().trim();
    if (!texto) return [];
    return this.trie.buscarSimilares(texto);
  })

  onBuscar(valor: string){
    this.consulta.set(valor);
    this.menuAbierto.set(valor.trim().length > 0);
  }

  irAObra(id:string){
    this.menuAbierto.set(false);
    this.consulta.set('');
    this.router.navigate(['/obras', id]);
  }


  elegir(id: string) {
    this.categoriaActiva.set(this.categoriaActiva() === id ? 'todas' : id);
  }

  obras = computed(() => {
    const ids = this.arbol.obtenerDescendientes(this.categoriaActiva());
    let lista = OBRAS_EJEMPLO.filter(o => ids.includes(o.categoriaId));


    if (this.mostrarTemporada()) {
      lista = lista.filter(o => o.id !== this.temporada.id);
    }
    return lista;
  });
}
