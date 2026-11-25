import { Categoria } from '../modelos/categoria-nodo';

export const CATEGORIAS_EJEMPLO: Categoria[] = [
  { id: 'artes-escenicas', nombre: 'Artes escénicas', padreId: null },
  { id: 'teatro-clasico', nombre: 'Teatro clásico', padreId: 'artes-escenicas' },
  { id: 'teatro-contemporaneo', nombre: 'Teatro contemporáneo', padreId: 'artes-escenicas' },

  { id: 'danza', nombre: 'Danza', padreId: null },
  { id: 'ballet', nombre: 'Ballet', padreId: 'danza' },
  { id: 'danza-contemporanea', nombre: 'Danza contemporánea', padreId: 'danza' },
  { id: 'salsa-urbanos', nombre: 'Salsa y bailes urbanos', padreId: 'danza' },

  { id: 'musica', nombre: 'Música', padreId: null },
  { id: 'musica-academica', nombre: 'Música académica y sinfónica', padreId: 'musica' },
  { id: 'musicas-populares', nombre: 'Músicas populares, folclóricas y de fusión', padreId: 'musica' },
];