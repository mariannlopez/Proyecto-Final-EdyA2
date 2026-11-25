import { Injectable, signal } from '@angular/core';
import { Unsubscribe } from 'firebase/auth';
import { Cola } from '../estructuras-datos/cola';
import { onValue, ref, remove, set } from 'firebase/database';
import { auth, db } from '../firebase/auth';
import { currentDocument } from 'firebase/firestore/pipelines';

export interface EntradaEspera{
  id?: string; 
  uid: string;
  nombre: string;
  llegada: number; 
}

@Injectable({
  providedIn: 'root',
})
export class ListaEsperaService {
  private unsubscribe?: Unsubscribe; 
  private rutaActual = '';

  isPending = signal<boolean>(false);
  error = signal<string | null>(null);
  colaActual = signal<Cola<EntradaEspera>>(new Cola<EntradaEspera>);
  miPosicion =signal<number | null>(null);

  init(funcionId: string, uidActual?: string):this{ 
    this.unsubscribe?.();
    this.isPending.set(true);
    this.error.set(null);
    this.rutaActual = `listas-espera/${funcionId}`;

    const dbRef = ref(db, this.rutaActual);

    this.unsubscribe = onValue(
        dbRef,
        (snapshot)=> {
          const cola = new Cola<EntradaEspera>(); 

          if (snapshot.exists()){
            const elementos = Object.entries(snapshot.val())
            .map(([id, value])=>({
              id, 
              ...value as Omit<EntradaEspera, 'id'>,
            })).sort((a,b)=> a.llegada - b.llegada);

            for (const items of elementos){
              cola.enqueue(items)
            }
          }

          this.colaActual.set(cola); 
          this.isPending.set(false);

          if (uidActual){ 
            const listaOrdenada = cola.obtenerElementos(); 
            const idx = listaOrdenada.findIndex((p)=> p.uid === uidActual);
            this.miPosicion.set(idx >= 0 ? idx + 1 : null); 
          }else{
            this.miPosicion.set(null);
          }
        }, 
        (err)=> {
          this.error.set(err.message);
          this.isPending.set(false);
        }
    );

    return this; 
  }

  async entrarFila(funcionId: string): Promise<void>{
    const user = auth.currentUser;
    if (!user) return;

    const nodoRef = ref(db, `listas-espera/${funcionId}/${user.uid}`);
    const entrada: EntradaEspera = {
      uid: user.uid,
      nombre: user.displayName || user.email || 'Usuario', 
      llegada: Date.now(),
    };

    await set(nodoRef, entrada);
  }

  async salirDeFila(funcionId: string, entradaId?: string): Promise<void>{
    const user = auth.currentUser;
    const clave = entradaId || user?.uid;
    if (!clave) return;

    await remove(ref(db, `listas-espera/${funcionId}/${clave}`));
  }

  async avanzarSiguiente(funcionId: string): Promise<void>{
    const primero = this.colaActual().peek(); 
    if (primero?.id){
      this.colaActual().dequeue();
      await remove(ref(db, `listas-espera/${funcionId}/${primero.id}`));
    }
  }

  destruir(): void{
    this.unsubscribe?.(); 
  }

}
