import { Component, output, signal, inject, computed, OnInit } from '@angular/core';
import { Pila } from '../../../estructuras-datos/pila';
import { FormsModule } from '@angular/forms';
import { BoletasService } from '../../../general/services/boletas';
import { Router, ActivatedRoute } from '@angular/router';

export type EstadoSilla = 'libre' | 'ocupada' | 'seleccionada' | 'reservada';

export interface SillaMapa {
  id: string;
  codigo: string;
  estado: EstadoSilla;
  precio: number;
}

@Component({
  selector: 'app-seleccion-sillas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seleccion-sillas.html',
  styleUrl: './seleccion-sillas.css',
})
export class SeleccionSillas implements OnInit{
  // Emite las sillas elegidas hacia el componente padre (Compra / Pago de tu compañero)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boletasService = inject(BoletasService);

  seleccionCambio = output<SillaMapa[]>();
  historialSeleccion = new Pila<SillaMapa>();
  funcionId = signal<string>('');

  email = signal<string>('');
  numeroTarjeta = signal<string>('');
  fechaVencimiento = signal<string>('');
  cvc = signal<string>('');
  nombreTitular = signal<string>('');
  mensajeError = signal<string>('');

  // Datos iniciales replicando el mapa B1 - B24 
  sillas = signal<SillaMapa[]>([
    { id: 'B1', codigo: 'B1', estado: 'libre', precio: 45000 },
    { id: 'B2', codigo: 'B2', estado: 'ocupada', precio: 45000 },
    { id: 'B3', codigo: 'B3', estado: 'libre', precio: 45000 },
    { id: 'B4', codigo: 'B4', estado: 'reservada', precio: 45000 },
    { id: 'B5', codigo: 'B5', estado: 'libre', precio: 45000 },
    { id: 'B6', codigo: 'B6', estado: 'libre', precio: 45000 },

    { id: 'B7', codigo: 'B7', estado: 'libre', precio: 45000 },
    { id: 'B8', codigo: 'B8', estado: 'ocupada', precio: 45000 },
    { id: 'B9', codigo: 'B9', estado: 'libre', precio: 45000 },
    { id: 'B10', codigo: 'B10', estado: 'reservada', precio: 45000 },
    { id: 'B11', codigo: 'B11', estado: 'libre', precio: 45000 },
    { id: 'B12', codigo: 'B12', estado: 'ocupada', precio: 45000 },

    { id: 'B13', codigo: 'B13', estado: 'libre', precio: 45000 },
    { id: 'B14', codigo: 'B14', estado: 'ocupada', precio: 45000 },
    { id: 'B15', codigo: 'B15', estado: 'libre', precio: 45000 },
    { id: 'B16', codigo: 'B16', estado: 'reservada', precio: 45000 },
    { id: 'B17', codigo: 'B17', estado: 'libre', precio: 45000 },
    { id: 'B18', codigo: 'B18', estado: 'libre', precio: 45000 },

    { id: 'B19', codigo: 'B19', estado: 'libre', precio: 45000 },
    { id: 'B20', codigo: 'B20', estado: 'ocupada', precio: 45000 },
    { id: 'B21', codigo: 'B21', estado: 'libre', precio: 45000 },
    { id: 'B22', codigo: 'B22', estado: 'libre', precio: 45000 },
    { id: 'B23', codigo: 'B23', estado: 'libre', precio: 45000 },
    { id: 'B24', codigo: 'B24', estado: 'reservada', precio: 45000 },
  ]);

  sillasSeleccionadas = computed(() =>
    this.sillas().filter((s) => s.estado === 'seleccionada')
  );

  totalPagar = computed(() =>
    this.sillasSeleccionadas().reduce((acc, silla) => acc + silla.precio, 0)
  );

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get('funcionId') ??
      this.route.parent?.snapshot.paramMap.get('funcionId') ??
      'funcion-1';
    this.funcionId.set(id);
  }

  alternarSilla(silla: SillaMapa): void {
    if (silla.estado === 'ocupada' || silla.estado === 'reservada') {
      return;
    }

    if (silla.estado === 'libre') {
      // Seleccionar: cambia estado y apila (push)
      this.actualizarEstadoSilla(silla.id, 'seleccionada');
      this.historialSeleccion.push({ ...silla, estado: 'seleccionada' });
    } else if (silla.estado === 'seleccionada') {
      // Si desmarca manualmente una silla intermedia, reconstruimos la pila sin esa silla
      this.actualizarEstadoSilla(silla.id, 'libre');
      const restantes = this.historialSeleccion
        .obtenerElementos()
        .filter((s) => s.id !== silla.id);
      this.historialSeleccion.limpiar();
      restantes.forEach((s) => this.historialSeleccion.push(s));
    }

    this.emitirSeleccion();
  }

  // Desapila la última silla escogida
  deshacerUltimaEleccion(): void {
    const ultimaSilla = this.historialSeleccion.pop();
    if (!ultimaSilla) return;

    this.actualizarEstadoSilla(ultimaSilla.id, 'libre');
    this.emitirSeleccion();
  }

  procesarCompraSimulada(): void {
    console.log('[SeleccionSillas] Click en Pagar', {
    sillas: this.sillasSeleccionadas().length,
    email: this.email(),
    titular: this.nombreTitular(),
    funcionId: this.funcionId(),
    });

    if (this.sillasSeleccionadas().length === 0) {
      this.mensajeError.set('Selecciona al menos una silla antes de pagar.');
      return;
    }

    if (!this.email().trim() || !this.nombreTitular().trim()) {
      this.mensajeError.set('Completa el correo electrónico y el nombre del titular.');
      return;
    }

    this.mensajeError.set('');

    const creadas = this.boletasService.agregarCompraSimulada({
      sillas: this.sillasSeleccionadas(),
      funcionId: this.funcionId(),
    });

    const primeraId = creadas[0]?.id;
    this.router.navigate(['/compra', this.funcionId(), 'exito'], {
      state: { ultimaBoletaId: primeraId },
    });
  }

  private actualizarEstadoSilla(id: string, nuevoEstado: EstadoSilla): void {
    this.sillas.update((lista) =>
      lista.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    );
  }

  private emitirSeleccion(): void {
    const elegidas = this.sillas().filter((s) => s.estado === 'seleccionada');
    this.seleccionCambio.emit(elegidas);
  }
}