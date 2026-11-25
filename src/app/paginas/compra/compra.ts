import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { BoletasService } from '../../general/services/boletas';
import { SeleccionSillas, SillaMapa } from './seleccion-sillas/seleccion-sillas';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compra',
  imports: [RouterOutlet, FormsModule, SeleccionSillas],
  templateUrl: './compra.html',
  styleUrl: './compra.css',
})
export class Compra {
  
}