import { Obra } from './obra';

export type ObraConFecha = Obra & {
  fecha: string;
  seccion?: string;
  precio?: string;
};

export const OBRAS_EJEMPLO: ObraConFecha[] = [
  {
    id: 'casa-bernarda-alba',
    titulo: 'La casa de Bernarda Alba',
    sinopsis: 'Una madre autoritaria impone un luto de ocho años a sus cinco hijas, desatando tensiones y deseos de libertad tras los muros de su hogar.',
    imagen: 'obras/bernarda.jpg',
    categoriaId: 'teatro-clasico',
    fecha: 'Sábado, 12 de diciembre · 7:30 p. m.',
    seccion: 'SECCIÓN 2',
    precio: '$40.000',
    frase: 'El teatro es poesía que se sale del libro para hacerse humana.',
    autorFrase: 'Federico García Lorca',
  },
  {
    id: 'cascanueces',
    titulo: 'El Cascanueces',
    sinopsis: 'Una niña llamada Clara recibe un muñeco cascanueces en Nochebuena, cobra vida por la noche y enfrenta al Rey de los Ratones antes de viajar a un mundo mágico de nieve y dulces.',
    imagen: 'obras/cascanueces.jpg',
    categoriaId: 'ballet',
    fecha: 'Viernes, 18 de diciembre · 7:30 p. m.',
    seccion: 'SECCIÓN 1',
    precio: '$45.000',
    frase: 'Danzar es sentir, sentir es sufrir, sufrir es amar; Usted ama, sufre y siente. ¡Usted danza!',
    autorFrase: 'Isadora Duncan',
  },
  {
    id: 'noche-de-salsa',
    titulo: 'Noche de salsa',
    sinopsis: 'Una velada de baile, sabor caleño y virtuosismo coreográfico acompañada por orquesta en vivo sobre el escenario principal.',
    imagen: 'obras/salsa.jpg',
    categoriaId: 'salsa-urbanos',
    fecha: 'Sábado, 19 de diciembre · 8:00 p. m.',
    seccion: 'SECCIÓN 3',
    precio: '$50.000',
    frase: 'Cuando la música suena en el alma, los pies encuentran solos el camino.',
    autorFrase: 'Celia Cruz',
  },
  {
    id: 'concierto-sinfonico',
    titulo: 'Concierto sinfónico',
    sinopsis: 'La orquesta sinfónica interpreta las piezas más emblemáticas del repertorio clásico en una noche de gala acústica.',
    imagen: 'obras/sinfonico.jpg',
    categoriaId: 'musica-academica',
    fecha: 'Domingo, 20 de diciembre · 5:00 p. m.',
    seccion: 'SECCIÓN 4',
    precio: '$35.000',
    frase: 'La música empieza donde se acaba el poder de las palabras.',
    autorFrase: 'Richard Wagner',
  },
];