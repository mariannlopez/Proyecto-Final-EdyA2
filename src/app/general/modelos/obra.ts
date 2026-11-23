export interface Obra {
  id: string;
  titulo: string;
  sinopsis: string;
  imagen: string;        
  categoriaId: string;   // id de la categoría que se encuentra en el árbol
  frase?: string;         // frase del bloque café 
  autorFrase?: string;
}