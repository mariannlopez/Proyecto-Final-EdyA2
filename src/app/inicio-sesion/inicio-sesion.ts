import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio-sesion',
  imports: [],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {
  email = signal<string>('');
  contraseña = signal<string>(''); 

  private router = inject(Router); 

  async handleLogin(){
    try{
      
    }
  }
}
