import { Component, inject, OnDestroy, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnDestroy{
  // Se debe modificar despues de hacer el auth guard
  private router = inject(Router);

  sesionIniciada = signal(false);
  nombreUsuario = signal('');
  menuAbierto = signal(false); 

  iniciales = computed(() => {
    const nombre = this.nombreUsuario().trim();
    if (!nombre) return '';
    const partes = nombre.split(/\s+/);
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  });

  private unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) {
      this.sesionIniciada.set(true);
      this.nombreUsuario.set(user.displayName?.trim() || user.email || 'Usuario');
    } else {
      this.sesionIniciada.set(false);
      this.nombreUsuario.set('');
      this.menuAbierto.set(false);
    }
  });

  alternarMenu(): void{
    this.menuAbierto.update((abierto)=> !abierto)
  }

  async cerrarSesion():Promise<void>{
    this.menuAbierto.set(false);
    await signOut(auth); 
    await this.router.navigate(['/iniciar-sesion']);
  }

  ngOnDestroy(): void {
      this.unsubscribeAuth();
  }
}