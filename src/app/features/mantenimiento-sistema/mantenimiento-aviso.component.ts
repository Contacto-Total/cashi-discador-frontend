import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { MantenimientoService } from './mantenimiento.service';

/**
 * Aviso previo de un mantenimiento, para cualquier rol salvo administradores.
 *
 * Sigue la guia de notificaciones de Cashi: fondo blanco, color solo en el
 * borde y el icono, entrada desde la derecha. No se cierra solo: el de 10
 * minutos lleva X; el recordatorio y el de 60 segundos se quedan hasta que
 * empieza la detencion. En la pantalla de gestion no sale (MantenimientoService
 * no entrega aviso ahi).
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
      <div class="noti pointer-events-auto flex items-start gap-2.5 rounded-lg border border-[#f59e0b] bg-white py-3.5 pl-4 pr-3 font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[13px] leading-[1.45] shadow-[0_4px_12px_rgba(15,23,42,0.12)] dark:bg-slate-900"
           role="status">
        <lucide-angular name="alert-triangle" [size]="18" class="mt-[1px] block shrink-0 text-[#f59e0b]"></lucide-angular>
        <div class="min-w-0 flex-1">
          <strong class="block font-bold !text-[#0f172a] dark:!text-slate-100">{{ m.titulo }}</strong>
          <span class="mt-0.5 block text-[12px] tabular-nums !text-[#5f6c80] dark:!text-slate-400">{{ m.texto }}</span>
        </div>
        @if (m.cerrable) {
          <button type="button" (click)="mantenimiento.cerrarAviso()" aria-label="Cerrar aviso"
                  class="shrink-0 rounded p-[3px] leading-none !text-[#8491a3] hover:bg-[#f4f6f9] hover:!text-[#0f172a] dark:hover:bg-slate-800 dark:hover:!text-slate-100">
            <lucide-angular name="x" [size]="14" class="block"></lucide-angular>
          </button>
        }
      </div>
    }
  `
})
export class MantenimientoAvisoComponent {
  readonly mantenimiento = inject(MantenimientoService);
}
