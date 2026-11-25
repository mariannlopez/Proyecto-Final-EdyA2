import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Eventos } from '../../../general/services/eventos';
import { ListaEsperaService } from '../../../service/lista-espera-service';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase/auth';

@Component({
  selector: 'app-sala-espera',
  imports: [],
  templateUrl: './sala-espera.html',
  styleUrl: './sala-espera.css',
})
export class SalaEspera implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  private eventosService = inject(Eventos)
  esperaService = inject(ListaEsperaService);

  funcionId = signal<string>(''); 
  nombreObra = signal<string>('la obra seleccionada')

  constructor() {
    effect(() => {
      const pos = this.esperaService.miPosicion();
      const id = this.funcionId();
      if (pos === 1 && id) {
        this.router.navigate(['..', 'sillas'], { relativeTo: this.route });
      }
    });
  }

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get('funcionId') ??
      this.route.parent?.snapshot.paramMap.get('funcionId') ??
      '';
    this.funcionId.set(id);

    // Conecta aquí tu método de Eventos para obtener el nombre de la obra según `id`
    // const obra = this.eventosService.obtenerObraPorFuncionId(id);
    // if (obra?.titulo) this.nombreObra.set(obra.titulo);

    onAuthStateChanged(auth, async (user) => {
      if (!id) return;
      this.esperaService.init(id, user?.uid);
      if (user) {
        await this.esperaService.entrarFila(id);
      }
    });
  }

  async salirDeLaFila(): Promise<void> {
    const id = this.funcionId();
    if (id) {
      await this.esperaService.salirDeFila(id);
    }
    this.router.navigate(['/obras']);
  }

  ngOnDestroy(): void {
    this.esperaService.destruir();
  }

}
