export interface NodoGrafo {
  id: string;
  nombre: string;
  x: number;
  y: number;
  esSalida?: boolean;
  nombreSalida?: string;
}

export interface Arista {
  destino: string;
  peso: number;
  instruccion: string;
}

export interface ResultadoEvacuacion {
  salida: NodoGrafo;
  distanciaTotal: number;
  caminoNodos: NodoGrafo[];
  pasos: string[];
}

export class GrafoTeatro {
  private nodos = new Map<string, NodoGrafo>();
  private adyacencia = new Map<string, Arista[]>();

  agregarNodo(nodo: NodoGrafo): void {
    this.nodos.set(nodo.id, nodo);
    if (!this.adyacencia.has(nodo.id)) {
      this.adyacencia.set(nodo.id, []);
    }
  }

  agregarArista(
    origen: string,
    destino: string,
    peso: number,
    instruccionIda: string,
    instruccionVuelta: string = instruccionIda
  ): void {
    this.adyacencia.get(origen)?.push({
      destino,
      peso,
      instruccion: instruccionIda,
    });
    this.adyacencia.get(destino)?.push({
      destino: origen,
      peso,
      instruccion: instruccionVuelta,
    });
  }

  obtenerNodos(): NodoGrafo[] {
    return Array.from(this.nodos.values());
  }

  obtenerAristasUnicas(): { origen: NodoGrafo; destino: NodoGrafo; peso: number }[] {
    const vistas = new Set<string>();
    const resultado: { origen: NodoGrafo; destino: NodoGrafo; peso: number }[] = [];

    this.adyacencia.forEach((aristas, origenId) => {
      const nodoOrigen = this.nodos.get(origenId);
      if (!nodoOrigen) return;

      for (const arista of aristas) {
        const clave = [origenId, arista.destino].sort().join('-');
        const nodoDestino = this.nodos.get(arista.destino);
        if (!vistas.has(clave) && nodoDestino) {
          vistas.add(clave);
          resultado.push({ origen: nodoOrigen, destino: nodoDestino, peso: arista.peso });
        }
      }
    });

    return resultado;
  }

  construirCurvaSvg(
    a: { x: number; y: number },
    b: { x: number; y: number },
    curvatura = 0.25,
    desplazarHacia?: 'arriba' | 'abajo' | 'izquierda' | 'derecha'
  ): string {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;

    let nx = -dy / dist;
    let ny = dx / dist;

    if (desplazarHacia === 'arriba' && ny > 0) {
      nx = -nx;
      ny = -ny;
    } else if (desplazarHacia === 'abajo' && ny < 0) {
      nx = -nx;
      ny = -ny;
    } else if (desplazarHacia === 'izquierda' && nx > 0) {
      nx = -nx;
      ny = -ny;
    } else if (desplazarHacia === 'derecha' && nx < 0) {
      nx = -nx;
      ny = -ny;
    }

    const offset = dist * curvatura;
    const cx = (a.x + b.x) / 2 + nx * offset;
    const cy = (a.y + b.y) / 2 + ny * offset;

    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
  }

  calcularRutaMasCorta(nodoInicioId: string, distanciaSillaANodo = 3): ResultadoEvacuacion | null {
    const distancias = new Map<string, number>();
    const previos = new Map<string, { nodoId: string; instruccion: string } | null>();
    const noVisitados = new Set<string>(this.nodos.keys());

    this.nodos.forEach((_, id) => {
      distancias.set(id, Infinity);
      previos.set(id, null);
    });

    if (!this.nodos.has(nodoInicioId)) return null;
    distancias.set(nodoInicioId, distanciaSillaANodo);

    while (noVisitados.size > 0) {
      let actualId: string | null = null;
      let menorDist = Infinity;

      for (const id of noVisitados) {
        const d = distancias.get(id) ?? Infinity;
        if (d < menorDist) {
          menorDist = d;
          actualId = id;
        }
      }

      if (!actualId || menorDist === Infinity) break;
      noVisitados.delete(actualId);

      const nodoActual = this.nodos.get(actualId)!;
      if (nodoActual.esSalida) {
        return this.reconstruirCamino(actualId, menorDist, previos);
      }

      for (const vecino of this.adyacencia.get(actualId) ?? []) {
        if (!noVisitados.has(vecino.destino)) continue;
        const nuevaDist = menorDist + vecino.peso;
        if (nuevaDist < (distancias.get(vecino.destino) ?? Infinity)) {
          distancias.set(vecino.destino, nuevaDist);
          previos.set(vecino.destino, {
            nodoId: actualId,
            instruccion: vecino.instruccion,
          });
        }
      }
    }

    return null;
  }

  private reconstruirCamino(
    salidaId: string,
    distanciaTotal: number,
    previos: Map<string, { nodoId: string; instruccion: string } | null>
  ): ResultadoEvacuacion {
    const caminoNodos: NodoGrafo[] = [];
    const pasos: string[] = [];
    let cursor: string | null = salidaId;

    while (cursor) {
      const nodo = this.nodos.get(cursor);
      if (nodo) caminoNodos.unshift(nodo);

      const anterior = previos.get(cursor);
      if (anterior) {
        pasos.unshift(anterior.instruccion);
        cursor = anterior.nodoId;
      } else {
        cursor = null;
      }
    }

    return {
      salida: this.nodos.get(salidaId)!,
      distanciaTotal,
      caminoNodos,
      pasos,
    };
  }

  static crearMapaTeatro(): GrafoTeatro {
    const grafo = new GrafoTeatro();

    grafo.agregarNodo({ id: 'N1', nombre: 'Pasillo frontal izquierdo', x: 140, y: 126 });
    grafo.agregarNodo({ id: 'N2', nombre: 'Pasillo frontal central', x: 270, y: 126 });
    grafo.agregarNodo({ id: 'N3', nombre: 'Pasillo frontal derecho', x: 400, y: 126 });

    grafo.agregarNodo({ id: 'N4', nombre: 'Pasillo posterior izquierdo', x: 140, y: 286 });
    grafo.agregarNodo({ id: 'N5', nombre: 'Pasillo posterior central', x: 270, y: 286 });
    grafo.agregarNodo({ id: 'N6', nombre: 'Pasillo posterior derecho', x: 400, y: 286 });

    grafo.agregarNodo({ id: 'PI', nombre: 'Pasillo izquierdo', x: 53, y: 168 });
    grafo.agregarNodo({ id: 'PD', nombre: 'Pasillo derecho', x: 487, y: 168 });
    grafo.agregarNodo({ id: 'PP', nombre: 'Pasillo principal', x: 270, y: 383 });
    grafo.agregarNodo({ id: 'LOB', nombre: 'Lobby', x: 270, y: 458 });

    grafo.agregarNodo({ id: 'SAL_IZQ', nombre: 'Salida izquierda', x: 20, y: 214, esSalida: true, nombreSalida: 'Izquierda' });
    grafo.agregarNodo({ id: 'SAL_DER', nombre: 'Salida derecha', x: 520, y: 214, esSalida: true, nombreSalida: 'Derecha' });
    grafo.agregarNodo({ id: 'SAL_PRI', nombre: 'Salida principal', x: 270, y: 502, esSalida: true, nombreSalida: 'Principal' });

    grafo.agregarArista('N1', 'N2', 14, 'Camina por tu fila hacia la derecha', 'Camina por tu fila hacia la izquierda');
    grafo.agregarArista('N2', 'N3', 14, 'Camina por tu fila hacia la derecha', 'Camina por tu fila hacia la izquierda');
    grafo.agregarArista('N4', 'N5', 14, 'Camina por tu fila hacia la derecha', 'Camina por tu fila hacia la izquierda');
    grafo.agregarArista('N5', 'N6', 14, 'Camina por tu fila hacia la derecha', 'Camina por tu fila hacia la izquierda');

    grafo.agregarArista('N2', 'N5', 12, 'Avanza por el pasillo central hacia atrás', 'Avanza por el pasillo central hacia adelante');
    grafo.agregarArista('N5', 'PP', 8, 'Avanza hacia el pasillo principal', 'Ingresa a la zona de sillas posterior');
    grafo.agregarArista('PP', 'LOB', 7, 'Cruza el lobby en línea recta', 'Regresa al pasillo principal');

    grafo.agregarArista('N1', 'PI', 9, 'Entra al pasillo izquierdo', 'Ingresa a la fila frontal');
    grafo.agregarArista('N4', 'PI', 11, 'Sube por el pasillo izquierdo', 'Baja hacia la fila posterior');
    grafo.agregarArista('N3', 'PD', 9, 'Entra al pasillo derecho', 'Ingresa a la fila frontal');
    grafo.agregarArista('N6', 'PD', 11, 'Sube por el pasillo derecho', 'Baja hacia la fila posterior');

    grafo.agregarArista('PI', 'SAL_IZQ', 5, 'Sal por la puerta izquierda', 'Entra desde puerta izquierda');
    grafo.agregarArista('PD', 'SAL_DER', 5, 'Sal por la puerta derecha', 'Entra desde puerta derecha');
    grafo.agregarArista('LOB', 'SAL_PRI', 5, 'Sal por la puerta principal', 'Entra desde puerta principal');

    return grafo;
  }
}