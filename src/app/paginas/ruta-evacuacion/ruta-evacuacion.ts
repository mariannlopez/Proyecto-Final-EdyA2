import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrafoTeatro } from '../../estructuras-datos/grafo';
import { Silla } from '../../general/modelos/silla';

export interface SillaPlano extends Silla {
  x: number;
  y: number;
  zona: string;
}

@Component({
  selector: 'app-ruta-evacuacion',
  standalone: true,
  imports: [],
  templateUrl: './ruta-evacuacion.html',
  styleUrl: './ruta-evacuacion.css',
})
export class RutaEvacuacion {
  private route = inject(ActivatedRoute);

  grafo = GrafoTeatro.crearMapaTeatro();
  nodos = this.grafo.obtenerNodos();
  aristas = this.grafo.obtenerAristasUnicas();

  sillasPlano: SillaPlano[] = this.generarSillasPlano();
  sillaSeleccionadaId = signal<string>('B3');

  constructor() {
    const param = this.route.snapshot.paramMap.get('boletaId')?.toUpperCase();
    if (param && this.sillasPlano.some((s) => s.id === param)) {
      this.sillaSeleccionadaId.set(param);
    }
  }

  sillaActual = computed(
    () => this.sillasPlano.find((s) => s.id === this.sillaSeleccionadaId()) ?? this.sillasPlano[2]
  );

  evacuacion = computed(() =>
    this.grafo.calcularRutaMasCorta(this.sillaActual().nodoGrafo, 3)
  );

  tramoCurvo(
    origen: { id?: string; x: number; y: number },
    destino: { id?: string; x: number; y: number }
  ): string {
    const par = [origen.id ?? '', destino.id ?? ''].sort().join('-');

    if (par === 'N1-PI' || par === 'N4-PI') {
      return this.grafo.construirCurvaSvg(origen, destino, 0.32, 'izquierda');
    }
    if (par === 'N3-PD' || par === 'N6-PD') {
      return this.grafo.construirCurvaSvg(origen, destino, 0.32, 'derecha');
    }
    if (par === 'N1-N2' || par === 'N2-N3') {
      return this.grafo.construirCurvaSvg(origen, destino, 0.14, 'arriba');
    }
    if (par === 'N4-N5' || par === 'N5-N6') {
      return this.grafo.construirCurvaSvg(origen, destino, 0.14, 'abajo');
    }
    if (!origen.id) {
      return this.grafo.construirCurvaSvg(origen, destino, 0.22, 'arriba');
    }
    if (par === 'N1-N4') {
      return this.grafo.construirCurvaSvg(origen, destino, 0.14, 'derecha');
    }

    return this.grafo.construirCurvaSvg(origen, destino, 0.08);


  }

  rutaActivaPath = computed(() => {
    const res = this.evacuacion();
    const silla = this.sillaActual();
    if (!res || res.caminoNodos.length === 0) return '';

    const puntos: { id?: string; x: number; y: number }[] = [
      { x: silla.x, y: silla.y + 10 },
      ...res.caminoNodos.map((n) => ({ id: n.id, x: n.x, y: n.y })),
    ];

    let d = `M ${puntos[0].x} ${puntos[0].y}`;
    for (let i = 0; i < puntos.length - 1; i++) {
      const tramo = this.tramoCurvo(puntos[i], puntos[i + 1]);
      const indiceQ = tramo.indexOf('Q');
      if (indiceQ !== -1) {
        d += ` ${tramo.slice(indiceQ)}`;
      }
    }
    return d;
  });

  esNodoEnRuta(nodoId: string): boolean {
    const res = this.evacuacion();
    if (!res) return false;
    return res.caminoNodos.some((n) => n.id === nodoId && !n.esSalida);
  }

  seleccionarSilla(id: string): void {
    this.sillaSeleccionadaId.set(id);
  }

  private generarSillasPlano(): SillaPlano[] {
    const colsX = [108, 172, 236, 304, 368, 432];
    const filasY = [86, 166, 246, 326];
    const lista: SillaPlano[] = [];

    for (let f = 0; f < 4; f++) {
      for (let c = 0; c < 6; c++) {
        const num = f * 6 + c + 1;
        const esFrontal = f < 2;
        const sector = c < 2 ? 'Izquierda' : c < 4 ? 'Central' : 'Derecha';

        let nodoGrafo = 'N2';
        if (esFrontal && c < 2) nodoGrafo = 'N1';
        else if (esFrontal && c < 4) nodoGrafo = 'N2';
        else if (esFrontal) nodoGrafo = 'N3';
        else if (!esFrontal && c < 2) nodoGrafo = 'N4';
        else if (!esFrontal && c < 4) nodoGrafo = 'N5';
        else nodoGrafo = 'N6';

        lista.push({
          id: `B${num}`,
          funcionId: 'cascanueces',
          fila: f + 1,
          columna: c + 1,
          estado: 'ocupada',
          nodoGrafo,
          x: colsX[c],
          y: filasY[f],
          zona: `${esFrontal ? 'Frente' : 'Posterior'}, zona ${sector.toLowerCase()}`,
        });
      }
    }

    return lista;
  }
}