import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoletasService } from '../../general/services/boletas';

@Component({
  selector: 'app-tus-boletas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tus-boletas.html',
  styleUrl: './tus-boletas.css',
})
export class TusBoletas {
  private boletasService = inject(BoletasService);
  boletas = this.boletasService.boletas;
}