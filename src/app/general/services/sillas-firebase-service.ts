import { Injectable } from '@angular/core';
import { SillaMapa } from '../../paginas/compra/seleccion-sillas/seleccion-sillas';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { EstadoSilla } from '../modelos/silla';
import { runTransaction } from 'firebase/database';
import { auth } from '../../firebase/auth';

export interface SillaFirebase extends SillaMapa{
  seleccionadorPor?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SillasFirebaseService {
  private db = getDatabase();

  private rutaSillas(funcionId: string) {
    return ref(this.db, `funciones/${funcionId}/sillas`);
  }

  private rutaSilla(funcionId: string, sillaId: string) {
    return ref(this.db, `funciones/${funcionId}/sillas/${sillaId}`);
  }

  escucharSillas(
    funcionId: string,
    sillasIniciales: SillaMapa[],
    onCambio: (sillas: SillaFirebase[]) => void
  ): () => void {
    const referencia = this.rutaSillas(funcionId);

    return onValue(referencia, (snapshot) => {
      const data = snapshot.val() as Record<string, SillaFirebase> | null;

      if (!data) {
        const mapaInicial: Record<string, SillaFirebase> = {};
        for (const s of sillasIniciales) {
          mapaInicial[s.id] = { ...s, seleccionadorPor: null };
        }
        void set(referencia, mapaInicial);
        onCambio(Object.values(mapaInicial));
        return;
      }

      const ordenadas = sillasIniciales.map((base) => {
        const remota = data[base.id];
        return remota ? { ...base, ...remota } : { ...base, seleccionadoPor: null };
      });

      onCambio(ordenadas);
    });
  }

  async cambiarEstadoSilla(
    funcionId: string,
    sillaId: string,
    accion: 'seleccionar' | 'liberar'
  ): Promise<{ ok: boolean; motivo?: string }> {
    const uid = auth.currentUser?.uid ?? null;
    const referencia = this.rutaSilla(funcionId, sillaId);

    const resultado = await runTransaction(referencia, (actual: SillaFirebase | null) => {
      if (!actual) return actual;

      if (accion === 'seleccionar') {
        if (actual.estado === 'ocupada' || actual.estado === 'reservada') {
          return undefined; // aborta: ya no está disponible
        }
        if (
          actual.estado === 'seleccionada' &&
          actual.seleccionadorPor &&
          actual.seleccionadorPor !== uid
        ) {
          return undefined; // aborta: otro usuario ya la seleccionó
        }
        return {
          ...actual,
          estado: 'seleccionada' as EstadoSilla,
          seleccionadoPor: uid,
        };
      }

      // accion === 'liberar'
      if (
        actual.estado === 'seleccionada' &&
        (!actual.seleccionadorPor || actual.seleccionadorPor === uid)
      ) {
        return {
          ...actual,
          estado: 'libre' as EstadoSilla,
          seleccionadoPor: null,
        };
      }

      return undefined;
    });

    if (!resultado.committed) {
      return {
        ok: false,
        motivo: 'Esta silla ya fue seleccionada u ocupada por otra persona.',
      };
    }

    return { ok: true };
  }

  async marcarSillasOcupadas(funcionId: string, sillaIds: string[]): Promise<void> {
    await Promise.all(
      sillaIds.map((id) =>
        runTransaction(this.rutaSilla(funcionId, id), (actual: SillaFirebase | null) => {
          if (!actual) return actual;
          return {
            ...actual,
            estado: 'ocupada' as EstadoSilla,
            seleccionadoPor: null,
          };
        })
      )
    );
  }


}
