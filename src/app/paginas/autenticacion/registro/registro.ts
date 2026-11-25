import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  email = signal<string>('');
  contrasena = signal<string>('');
  nombre = signal<string>(''); 

  private router = inject(Router);
  
  async handleRegister(){
    try{
      const credencial = await createUserWithEmailAndPassword(auth, 
        this.email(), this.contrasena()
      ); 

      await updateProfile(credencial.user, {
        displayName: this.nombre().trim(), 
      });

      this.router.navigate(['/inicio-sesion'])
    } catch(error: any){ 
      alert(error.message); 
    }
  }
}
