export interface ObraBuscable{
    id: string;
    titulo: string;
    subtitulo?: string; 
    ruta?: string;
}

export interface ResultadoSimilitud{
    obra: ObraBuscable;
    puntaje: number; 
}

class NodoTrie{
    hijos = new Map<string, NodoTrie>();
    esFinDePalabra = false; 
    obra?: ObraBuscable;
}

export class TrieObras {
  private raiz = new NodoTrie();

  private normalizar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  insertar(obra: ObraBuscable): void {
    const clave = this.normalizar(obra.titulo);
    if (!clave) return;

    let actual = this.raiz;
    for (const char of clave) {
      if (!actual.hijos.has(char)) {
        actual.hijos.set(char, new NodoTrie());
      }
      actual = actual.hijos.get(char)!;
    }
    actual.esFinDePalabra = true;
    actual.obra = obra;
  }

  cargarObras(obras: ObraBuscable[]): void {
    this.raiz = new NodoTrie();
    for (const obra of obras) {
      this.insertar(obra);
    }
  }

  private obtenerTodasLasObras(): ObraBuscable[] {
    const obras: ObraBuscable[] = [];
    const recorrer = (nodo: NodoTrie) => {
      if (nodo.esFinDePalabra && nodo.obra) {
        obras.push(nodo.obra);
      }
      for (const hijo of nodo.hijos.values()) {
        recorrer(hijo);
      }
    };
    recorrer(this.raiz);
    return obras;
  }

  private extraerBigramas(texto: string): Set<string> {
    const limpio = texto.replace(/\s+/g, '');
    const bigramas = new Set<string>();
    for (let i = 0; i < limpio.length - 1; i++) {
      bigramas.add(limpio.slice(i, i + 2));
    }
    return bigramas;
  }

  private calcularSimilitud(queryNorm: string, tituloNorm: string): number {
    if (!queryNorm || !tituloNorm) return 0;
    if (tituloNorm === queryNorm) return 1;

    // 1. Coincidencia exacta como subcadena o inicio de alguna palabra
    let puntajeSubcadena = 0;
    if (tituloNorm.includes(queryNorm)) {
      puntajeSubcadena = 0.75;
      const palabras = tituloNorm.split(' ');
      if (palabras.some((p) => p.startsWith(queryNorm))) {
        puntajeSubcadena = 0.88;
      }
      if (tituloNorm.startsWith(queryNorm)) {
        puntajeSubcadena = 0.95;
      }
    }

    // 2. Similitud de Dice por bigramas (letras consecutivas compartidas)
    const bigQuery = this.extraerBigramas(queryNorm);
    const bigTitulo = this.extraerBigramas(tituloNorm);

    let puntajeBigramas = 0;
    if (bigQuery.size > 0 && bigTitulo.size > 0) {
      let interseccion = 0;
      for (const bg of bigQuery) {
        if (bigTitulo.has(bg)) interseccion++;
      }
      puntajeBigramas = (2 * interseccion) / (bigQuery.size + bigTitulo.size);
    } else {
      // Para consultas de 1 sola letra: proporción de ocurrencias
      const sinEspacios = tituloNorm.replace(/\s+/g, '');
      const coincidencias = [...sinEspacios].filter((c) => c === queryNorm).length;
      puntajeBigramas = coincidencias > 0 ? Math.min(0.6, coincidencias * 0.2) : 0;
    }

    return Math.max(puntajeSubcadena, puntajeBigramas);
  }

  buscarSimilares(consulta: string, umbralMinimo = 0.25): ObraBuscable[] {
    const queryNorm = this.normalizar(consulta);
    if (!queryNorm) return [];

    const candidatos: ResultadoSimilitud[] = [];

    for (const obra of this.obtenerTodasLasObras()) {
      const tituloNorm = this.normalizar(obra.titulo);
      const puntaje = this.calcularSimilitud(queryNorm, tituloNorm);
      if (puntaje >= umbralMinimo) {
        candidatos.push({ obra, puntaje });
      }
    }

    return candidatos
      .sort((a, b) => b.puntaje - a.puntaje)
      .map((item) => item.obra);
  }
}