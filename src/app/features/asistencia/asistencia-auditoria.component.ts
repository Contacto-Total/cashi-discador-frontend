import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { CorreccionMarcacion } from './asistencia.models';
import { ESTILOS } from './asistencia.estilos';

/**
 * Auditoría: las marcas escritas a mano, con su motivo y quién las escribió.
 *
 * Es lo que la hoja de Excel no guarda. Ahí una corrección se ve porque la
 * celda está pintada de amarillo, y ahí se acaba el rastro: ni quién, ni
 * cuándo, ni por qué.
 */
@Component({
  selector: 'app-asistencia-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
  `],
  template: `
    <div class="aparecer">

      <div class="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <p class="!m-0 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
          Toda marcación completada a mano queda aquí, con su motivo
        </p>
        <div class="flex items-center gap-2">
          <input type="search" placeholder="Persona o motivo"
                 [class]="estilos.campo + ' w-[220px]'"
                 [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)"
                 aria-label="Buscar en la auditoría">
          <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
            {{ filtradas().length }} {{ filtradas().length === 1 ? 'corrección' : 'correcciones' }}
          </span>
        </div>
      </div>

      @if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
      } @else {
        <div [class]="estilos.panel">
          <table class="w-full border-collapse">
            <caption class="sr-only">Correcciones de marcación</caption>
            <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
              <tr>
                <th scope="col" [class]="estilos.th">Cuándo</th>
                <th scope="col" [class]="estilos.th">Persona</th>
                <th scope="col" [class]="estilos.th">Día</th>
                <th scope="col" [class]="estilos.th">Marca</th>
                <th scope="col" [class]="estilos.th">Quedó en</th>
                <th scope="col" [class]="estilos.th">Motivo</th>
                <th scope="col" [class]="estilos.th">Corrigió</th>
              </tr>
            </thead>
            <tbody>
              @for (c of filtradas(); track c.id) {
                <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#fafbfc] dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td [class]="estilos.td">{{ c.cuando | date: 'dd/MM HH:mm' }}</td>
                  <td [class]="estilos.td + ' font-semibold'">{{ c.nombreAgente }}</td>
                  <td [class]="estilos.td">{{ c.fecha | date: 'dd/MM/yyyy' }}</td>
                  <td [class]="estilos.td">{{ c.marca }}</td>
                  <td [class]="estilos.td + ' font-bold'">{{ c.despues ?? '—' }}</td>
                  <td [class]="estilos.td + ' !whitespace-normal'">{{ c.motivo ?? '—' }}</td>
                  <td [class]="estilos.td">{{ c.corrigio ?? '—' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-3 py-14 text-center">
                    <strong class="block text-[13.5px]">Sin correcciones</strong>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                      Nadie ha completado marcaciones a mano en este rango.
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <p class="mt-2.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
          No se guarda la hora anterior: la marca corregida se sustituye. Lo que queda es
          que fue manual, con su motivo y su autor.
        </p>
      }
    </div>
  `
})
export class AsistenciaAuditoriaComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;

  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  readonly correcciones = signal<CorreccionMarcacion[]>([]);
  readonly cargando = signal(false);
  readonly busqueda = signal('');

  readonly filtradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    if (!texto) {
      return this.correcciones();
    }
    return this.correcciones().filter(c =>
      (c.nombreAgente ?? '').toLowerCase().includes(texto)
      || (c.motivo ?? '').toLowerCase().includes(texto)
      || (c.corrigio ?? '').toLowerCase().includes(texto));
  });

  constructor() {
    effect(() => {
      const desde = this.desde();
      const hasta = this.hasta();
      this.cargar(desde, hasta);
    });
  }

  private cargar(desde: string, hasta: string): void {
    this.cargando.set(true);
    this.servicio.auditoria(desde, hasta).subscribe({
      next: c => {
        this.correcciones.set(c);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar la auditoría');
        this.cargando.set(false);
      }
    });
  }
}
