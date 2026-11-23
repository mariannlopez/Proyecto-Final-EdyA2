//Este es un nodo del árbol de categorias en obras
export interface Categoria {
  id: string;            
  nombre: string;        
  padreId: string | null; // Cuando es null es pq es una categoria general como "Danza, si tiene id es un tipo de danza"
}