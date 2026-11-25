export class Pila<T> {
  private elementos: T[] = [];

 
  push(elemento: T): void {
    this.elementos.push(elemento);
  }


  pop(): T | undefined {
    return this.elementos.pop();
  }


  peek(): T | undefined {
    return this.elementos[this.elementos.length - 1];
  }

  estaVacia(): boolean {
    return this.elementos.length === 0;
  }

  tamano(): number {
    return this.elementos.length;
  }

  limpiar(): void {
    this.elementos = [];
  }

  obtenerElementos(): T[] {
    return [...this.elementos];
  }
}