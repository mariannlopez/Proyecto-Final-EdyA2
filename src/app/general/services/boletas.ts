import { Injectable, signal } from '@angular/core';
import { Boleta } from '../modelos/boleta';
import { OBRAS_EJEMPLO } from '../modelos/para-obras/obras-datos';

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

  boletas = signal<BoletaTarjeta[]>(this.mapearBoletas(this.boletasBase));


  establecerBoletas(lista: Boleta[]): void {
    this.boletas.set(this.mapearBoletas(lista));
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