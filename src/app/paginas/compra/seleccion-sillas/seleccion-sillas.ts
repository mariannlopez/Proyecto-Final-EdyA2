import {
  Component,
  output,
  signal,
  inject,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Pila } from '../../../estructuras-datos/pila';
import { FormsModule } from '@angular/forms';
import { BoletasService } from '../../../general/services/boletas';
import { Router, ActivatedRoute } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase/auth';
import { SillasFirebaseService, SillaFirebase } from '../../../general/services/sillas-firebase-service';

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
export class SeleccionSillas implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boletasService = inject(BoletasService);
  private sillasFirebase = inject(SillasFirebaseService);

  seleccionCambio = output<SillaMapa[]>();
  historialSeleccion = new Pila<SillaMapa>();
  funcionId = signal<string>('');
  uidActual = signal<string | null>(auth.currentUser?.uid ?? null);
  procesandoCompra = signal<boolean>(false);

  email = signal<string>('');
  numeroTarjeta = signal<string>('');
  fechaVencimiento = signal<string>('');
  cvc = signal<string>('');
  nombreTitular = signal<string>('');
  mensajeError = signal<string>('');

  private unsubscribeSillas: (() => void) | null = null;
  private unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    this.uidActual.set(user?.uid ?? null);
  });

  // Datos iniciales replicando el mapa B1 - B24
  private readonly sillasBase: SillaMapa[] = [
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
  ];

  sillas = signal<SillaFirebase[]>([...this.sillasBase]);

  // Solo las sillas seleccionadas por el usuario actual pertenecen a su carrito/selección
  sillasSeleccionadas = computed(() => {
    const uid = this.uidActual();
    return this.sillas().filter(
      (s) => s.estado === 'seleccionada' && (!s.seleccionadorPor || s.seleccionadorPor === uid)
    );
  });

  totalPagar = computed(() =>
    this.sillasSeleccionadas().reduce((acc, silla) => acc + silla.precio, 0)
  );

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get('funcionId') ??
      this.route.parent?.snapshot.paramMap.get('funcionId') ??
      'funcion-1';
    this.funcionId.set(id);

    this.unsubscribeSillas = this.sillasFirebase.escucharSillas(
      id,
      this.sillasBase,
      (sillasRemotas) => {
        this.sillas.set(sillasRemotas);

        // Limpia de la pila cualquier silla que ya haya sido tomada o soltada externamente
        const uid = this.uidActual();
        const vigentes = this.historialSeleccion.obtenerElementos().filter((item) => {
          const actual = sillasRemotas.find((r) => r.id === item.id);
          return (
            actual?.estado === 'seleccionada' &&
            (!actual.seleccionadorPor || actual.seleccionadorPor === uid)
          );
        });
        this.historialSeleccion.limpiar();
        vigentes.forEach((s) => this.historialSeleccion.push(s));

        this.emitirSeleccion();
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeSillas?.();
    this.unsubscribeAuth();
  }

  sillaBloqueadaPorOtro(silla: SillaFirebase): boolean {
    const uid = this.uidActual();
    return (
      silla.estado === 'seleccionada' &&
      Boolean(silla.seleccionadorPor) &&
      silla.seleccionadorPor !== uid
    );
  }

  async alternarSilla(silla: SillaFirebase): Promise<void> {
    if (
      silla.estado === 'ocupada' ||
      silla.estado === 'reservada' ||
      this.sillaBloqueadaPorOtro(silla)
    ) {
      return;
    }

    this.mensajeError.set('');

    if (silla.estado === 'libre') {
      const res = await this.sillasFirebase.cambiarEstadoSilla(
        this.funcionId(),
        silla.id,
        'seleccionar'
      );
      if (!res.ok) {
        this.mensajeError.set(res.motivo ?? 'No se pudo seleccionar la silla.');
        return;
      }
      this.historialSeleccion.push({ ...silla, estado: 'seleccionada' });
    } else if (silla.estado === 'seleccionada') {
      const res = await this.sillasFirebase.cambiarEstadoSilla(
        this.funcionId(),
        silla.id,
        'liberar'
      );
      if (!res.ok) {
        this.mensajeError.set(res.motivo ?? 'No se pudo liberar la silla.');
        return;
      }
      const restantes = this.historialSeleccion
        .obtenerElementos()
        .filter((s) => s.id !== silla.id);
      this.historialSeleccion.limpiar();
      restantes.forEach((s) => this.historialSeleccion.push(s));
    }

    this.emitirSeleccion();
  }

  async deshacerUltimaEleccion(): Promise<void> {
    const ultimaSilla = this.historialSeleccion.pop();
    if (!ultimaSilla) return;

    this.mensajeError.set('');
    const res = await this.sillasFirebase.cambiarEstadoSilla(
      this.funcionId(),
      ultimaSilla.id,
      'liberar'
    );

    if (!res.ok) {
      this.mensajeError.set(res.motivo ?? 'No se pudo deshacer la última silla.');
      return;
    }

    this.emitirSeleccion();
  }

  async procesarCompraSimulada(): Promise<void> {
    if (this.procesandoCompra()) return;

    if (this.sillasSeleccionadas().length === 0) {
      this.mensajeError.set('Selecciona al menos una silla antes de pagar.');
      return;
    }

    if (!this.email().trim() || !this.nombreTitular().trim()) {
      this.mensajeError.set('Completa el correo electrónico y el nombre del titular.');
      return;
    }

    this.mensajeError.set('');
    this.procesandoCompra.set(true);

    try {
      const elegidas = this.sillasSeleccionadas();
      await this.sillasFirebase.marcarSillasOcupadas(
        this.funcionId(),
        elegidas.map((s) => s.id)
      );

      this.historialSeleccion.limpiar();

      const creadas = this.boletasService.agregarCompraSimulada({
        sillas: elegidas,
        funcionId: this.funcionId(),
      });

      const primeraId = creadas[0]?.id;
      await this.router.navigate(['/compra', this.funcionId(), 'exito'], {
        state: { ultimaBoletaId: primeraId },
      });
    } catch (error) {
      console.error('Error al confirmar la compra:', error);
      this.mensajeError.set('No se pudo confirmar la compra. Intenta de nuevo.');
    } finally {
      this.procesandoCompra.set(false);
    }
  }

  private emitirSeleccion(): void {
    this.seleccionCambio.emit(this.sillasSeleccionadas());
  }
}