import { Component, Input } from '@angular/core';

/** Cashi con casco, llave y engranajes: la mascota de las pantallas de mantenimiento. */
@Component({
  selector: 'app-mascota-casco',
  standalone: true,
  templateUrl: './mascota-casco.component.html',
  styleUrl: './mascota-casco.component.css'
})
export class MascotaCascoComponent {
  @Input() escala = 1;
  @Input() bocadillo = 'Volvemos pronto';
  /** Bocadillo y separacion reducidos, para la miniatura de la vista de Sistemas. */
  @Input() compacta = false;
}
