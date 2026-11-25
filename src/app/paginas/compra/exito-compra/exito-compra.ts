import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exito-compra',
  imports: [],
  templateUrl: './exito-compra.html',
  styleUrl: './exito-compra.css',
})
export class ExitoCompra {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  boletaId = signal<string | null>(
    this.route.snapshot.queryParamMap.get('boletaId') ??
      (history.state?.boletaId as string | undefined) ??
      null
  );

  verDetallesBoleta(): void {
    const id = this.boletaId();
    if (id) {
      this.router.navigate(['/tus-boletas', id]);
    } else {
      this.router.navigate(['/tus-boletas']);
    }
  }
}
