import { Categoria } from '../general/modelos/categoria-nodo';

export class NodoCategoria {
  hijos: NodoCategoria[] = [];

  constructor(public id: string, public nombre: string) {}
}

export class ArbolCategorias {
  raiz = new NodoCategoria('todas', 'Todas las obras');

 
  agregar(padreId: string | null, id: string, nombre: string): boolean {
    const padre = padreId === null ? this.raiz : this.buscar(padreId);
    if (!padre) return false;
    padre.hijos.push(new NodoCategoria(id, nombre));
    return true;
  }

  buscar(id: string, nodo: NodoCategoria = this.raiz): NodoCategoria | null {
    if (nodo.id === id) return nodo;
    for (const hijo of nodo.hijos) {
      const encontrado = this.buscar(id, hijo);
      if (encontrado) return encontrado;
    }
    return null;
  }



  obtenerDescendientes(id: string): string[] {
    const nodo = this.buscar(id);
    if (!nodo) return [];
    const ids: string[] = [];
    const recorrer = (n: NodoCategoria) => {
      ids.push(n.id);
      n.hijos.forEach(recorrer);
    };
    recorrer(nodo);
    return ids;
  }

 
  static desdeLista(categorias: Categoria[]): ArbolCategorias {
    const arbol = new ArbolCategorias();
    const nodos = new Map<string, NodoCategoria>();

    categorias.forEach(c => nodos.set(c.id, new NodoCategoria(c.id, c.nombre)));

    categorias.forEach(c => {
      const nodo = nodos.get(c.id)!;
      const padre = c.padreId ? nodos.get(c.padreId) : arbol.raiz;
      (padre ?? arbol.raiz).hijos.push(nodo);
    });

    return arbol;
  }
}