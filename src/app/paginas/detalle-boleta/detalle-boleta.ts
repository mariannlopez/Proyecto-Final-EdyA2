import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BoletasService, BoletaTarjeta } from '../../general/services/boletas';

@Component({
  selector: 'app-detalle-boleta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-boleta.html',
  styleUrl: './detalle-boleta.css',
})
export class DetalleBoleta {
  private route = inject(ActivatedRoute);
  private boletasService = inject(BoletasService);

  private paramValor = toSignal(
    this.route.paramMap.pipe(
      map((params) => (params.get('id') ?? params.get('boletaId') ?? '').trim())
    ),
    { initialValue: '' }
  );

  boletaActual = computed<BoletaTarjeta | undefined>(() => {
    const lista = this.boletasService.boletas();
    const valor = this.paramValor().toLowerCase();

    if (!valor) {
      return lista[0];
    }

    return (
      lista.find(
        (item) =>
          item.boleta.id.toLowerCase() === valor ||
          item.boleta.codigo.toLowerCase() === valor ||
          item.boleta.silla.toLowerCase() === valor
      ) ?? lista[0]
    );
  });


  subtituloEvento = signal<string>('');
}