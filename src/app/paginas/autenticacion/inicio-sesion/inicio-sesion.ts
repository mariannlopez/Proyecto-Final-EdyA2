import { Component, inject, signal } from '@angular/core';
import { auth } from '../../../firebase/auth';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  imports: [FormsModule],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {

  email = signal<string>('');
  contrasena = signal<string>(''); 
  cargando = signal<boolean>(false)

  private router = inject(Router)

  async handleLogin(){

    if (!this.email().trim() || !this.contrasena().trim()){
      alert('Por favor ingresar tu correo y contraseña')
    }
    try{
      await signInWithEmailAndPassword(auth,
        this.email(), this.contrasena()
      );

      this.router.navigate([''])

    } catch(error: any){
      alert(error.message);
    }finally{
      this.cargando.set(false)
    }
  }

  redirigirRegistro(){
    this.router.navigate(['/registro']);
  }

}
