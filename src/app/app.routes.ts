import { Routes } from '@angular/router';

export const routes: Routes = [
 
  { path: '', loadComponent: () => import('./paginas/inicio/inicio').then(m => m.Inicio) },
  { path: 'obras', loadComponent: () => import('./paginas/obras/obras').then(m => m.Obras) },
  { path: 'obras/:id', loadComponent: () => import('./paginas/detalle-obra/detalle-obra').then(m => m.DetalleObra) },
  {
    path: 'iniciar-sesion',

    loadComponent: () => import('./paginas/autenticacion/inicio-sesion/inicio-sesion').then(m => m.InicioSesion),
  },
  {
    path: 'registro',
 
    loadComponent: () => import('./paginas/autenticacion/registro/registro').then(m => m.Registro),
  },

  //Privadas (Despues de inicio de sesión) -> Despues de aqui se agrega lo del auth guard
  {
    path: 'compra/:funcionId',
  
    loadComponent: () => import('./paginas/compra/compra').then(m => m.Compra),
    children: [
      { path: 'espera', loadComponent: () => import('./paginas/compra/sala-espera/sala-espera').then(m => m.SalaEspera) },
      { path: 'sillas', loadComponent: () => import('./paginas/compra/seleccion-sillas/seleccion-sillas').then(m => m.SeleccionSillas) },
      { path: 'exito', loadComponent: () => import('./paginas/compra/exito-compra/exito-compra').then(m => m.ExitoCompra) },
      { path: '', redirectTo: 'espera', pathMatch: 'full' },
    ],
  },
  {
    path: 'tus-boletas',

    loadComponent: () => import('./paginas/tus-boletas/tus-boletas').then(m => m.TusBoletas),
  },
  {
    path: 'tus-boletas/:id',

    loadComponent: () => import('./paginas/detalle-boleta/detalle-boleta').then(m => m.DetalleBoleta),
  },
  {
    path: 'evacuacion/:boletaId',

    loadComponent: () => import('./paginas/ruta-evacuacion/ruta-evacuacion').then(m => m.RutaEvacuacion),
  },

  { path: '**', redirectTo: '' },
];
