import { Injectable, signal } from '@angular/core';
import { Boleta } from '../modelos/boleta';
import { OBRAS_EJEMPLO } from '../modelos/para-obras/obras-datos';
import { SillaMapa } from '../../paginas/compra/seleccion-sillas/seleccion-sillas';

export interface BoletaTarjeta {
  boleta: Boleta;
  tituloObra: string;
  imagen: string;
  fechaHora: string;
}

@Injectable({ providedIn: 'root' })
export class BoletasService {
  private readonly boletasBase: Boleta[] = [
    {
      id: 'bol-1',
      usuarioId: 'usr-1',
      eventoId: 'cascanueces',
      funcionId: 'cascanueces-vie-18-dic',
      silla: 'B3',
      codigo: 'TXT-943',
    },
    {
      id: 'bol-2',
      usuarioId: 'usr-1',
      eventoId: 'casa-bernarda-alba',
      funcionId: 'bernarda-dom-29-nov',
      silla: 'B14',
      codigo: 'JYH-123',
    },
  ];

  private listaActual: Boleta[] = [...this.boletasBase];

  boletas = signal<BoletaTarjeta[]>(this.mapearBoletas(this.boletasBase));


  establecerBoletas(lista: Boleta[]): void {
    this.boletas.set(this.mapearBoletas(lista));
  }

  agregarCompraSimulada(params: {
    sillas: SillaMapa[];
    funcionId: string;
    eventoId?: string;
    usuarioId?: string;
  }): Boleta[] {
    const eventoIdResuelto =
      params.eventoId ?? this.inferirEventoId(params.funcionId);
    const usuarioIdResuelto = params.usuarioId ?? 'usr-1';

    const nuevasBoletas: Boleta[] = params.sillas.map((silla, index) => ({
      id: `bol-${Date.now()}-${index + 1}`,
      usuarioId: usuarioIdResuelto,
      eventoId: eventoIdResuelto,
      funcionId: params.funcionId,
      silla: silla.codigo,
      codigo: this.generarCodigoBoleta(),
    }));

    this.listaActual = [...nuevasBoletas, ...this.listaActual];
    this.boletas.set(this.mapearBoletas(this.listaActual));
    return nuevasBoletas;
  }

  obtenerTarjetaPorId(id: string): BoletaTarjeta | undefined {
    return this.boletas().find((item) => item.boleta.id === id);
  }

  private inferirEventoId(funcionId: string): string {
    const lower = funcionId.toLowerCase();
    if (lower.includes('bernarda')) return 'casa-bernarda-alba';
    if (lower.includes('cascanueces')) return 'cascanueces';
    return OBRAS_EJEMPLO[0]?.id ?? 'cascanueces';
  }

  private generarCodigoBoleta(): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefijo =
      letras[Math.floor(Math.random() * letras.length)] +
      letras[Math.floor(Math.random() * letras.length)] +
      letras[Math.floor(Math.random() * letras.length)];
    const numero = Math.floor(100 + Math.random() * 900);
    return `${prefijo}-${numero}`;
  }

  private mapearBoletas(lista: Boleta[]): BoletaTarjeta[] {
    return lista.map((boleta) => {
      const obra = OBRAS_EJEMPLO.find((o) => o.id === boleta.eventoId);
      return {
        boleta,
        tituloObra: obra?.titulo ?? 'Obra teatral',
        imagen: obra?.imagen ?? 'obras/cascanueces.jpg',
        fechaHora: obra?.fecha ?? 'FUNCIÓN POR CONFIRMAR',
      };
    });
  }
}