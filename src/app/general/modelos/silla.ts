export type EstadoSilla = 'libre' | 'ocupada' | 'reservada';

export interface Silla {
  id: string;            // identificador de la silla ej: "B3"
  funcionId: string;
  fila: number;          
  columna: number;       
  estado: EstadoSilla;
  nodoGrafo: string;     //Va a representar el nodo más cercano dependiendo de ubi de la silla
}