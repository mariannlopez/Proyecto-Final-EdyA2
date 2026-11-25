import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Tarjeta } from '../../base/tarjeta/tarjeta';
import { OBRAS_EJEMPLO } from '../../general/modelos/para-obras/obras-datos';

@Component({
  selector: 'app-detalle-obra',
  standalone: true,
  imports: [RouterLink, Tarjeta],
  templateUrl: './detalle-obra.html',
  styleUrl: './detalle-obra.css',
})
export class DetalleObra {
  private route = inject(ActivatedRoute);

  private obraId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  obra = computed(() =>
    OBRAS_EJEMPLO.find((item) => item.id === this.obraId())
  );
}