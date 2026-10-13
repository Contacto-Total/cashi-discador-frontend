import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { MantenimientoService } from './mantenimiento.service';

/**
 * Aviso previo de un mantenimiento, para cualquier rol salvo administradores.
 *
 * Tiene el aspecto de los avisos emergentes de la aplicacion: fondo, borde y
 * texto en el color del aviso y el signo dentro de un anillo. No se cierra
 * solo, por eso el anillo va entero: el de 10 minutos lleva X; el recordatorio
 * y el de 60 segundos se quedan hasta que empieza la detencion. En la pantalla
 * de gestion no sale (MantenimientoService no entrega aviso ahi).
 *
 * No fija su posicion: la pila de avisos de app.component.html lo coloca arriba
 * a la derecha, encima de los avisos de asistencia.
 */
@Component({
  selector: 'app-mantenimiento-aviso',
  standalone: true,
  imports: [LucideAngularModule],
  styles: [`
    .noti { animation: entra-noti .3s ease; }
    @keyframes entra-noti { from { transform: translateX(400px); opacity: 0; } to { transform: none; opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .noti { animation: none; } }
  `],
  template: `
    @if (mantenimiento.aviso(); as m) {
      <!-- La clase cashi-pantalla trae los colores de estado, que solo existen dentro de ella. -->
      <div class="noti cashi-pantalla pointer-events-auto ml-auto flex w-fit max-w-full items-center gap-2.5 rounded-lg border border-(--am-ln) bg-(--am-bg) py-3 pr-3 pl-3.5 font-cashi text-[.875rem] leading-[1.45] font-medium text-(--am) antialiased shadow-[0_4px_12px_rgb(15_23_42/.12)] dark:shadow-[0_4px_12px_rgb(0_0_0/.55)]"
           role="status">
        <span class="relative grid size-7 flex-none place-items-center">
          <svg viewBox="0 0 28 28" aria-hidden="true" class="absolute inset-0 size-full fill-none stroke-[2.5]"><circle cx="14" cy="14" r="12.5" style="stroke: var(--am-pt)"></circle></svg>
          <svg viewBox="0 0 24 24" aria-hidden="true" class="relative size-4 fill-none stroke-current stroke-[2.6] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M12 6v7"></path><path d="M12 17.5h.01"></path></svg>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-semibold">{{ m.titulo }}</span>
          <span class="block text-[.75rem] tabular-nums">{{ m.texto }}</span>
        </span>
        @if (m.cerrable) {
          <button type="button" (click)="mantenimiento.cerrarAviso()" aria-label="Cerrar aviso"
                  class="flex flex-none cursor-pointer rounded-[.3125rem] border-0 bg-transparent p-0.5 text-(--am) transition-colors duration-150 hover:bg-(--am-ln)">
            <lucide-angular name="x" [size]="14"></lucide-angular>
          </button>
        }
      </div>
    }
  `
})
export class MantenimientoAvisoComponent {
  readonly mantenimiento = inject(MantenimientoService);
}
