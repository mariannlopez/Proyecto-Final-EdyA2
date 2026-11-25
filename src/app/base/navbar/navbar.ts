import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Se debe modificar despues de hacer el auth guard
  sesionIniciada = false;
  nombreUsuario = '';

  get iniciales(): string {
    return this.nombreUsuario.slice(0, 2).toUpperCase();
  }
}