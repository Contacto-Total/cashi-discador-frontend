import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { CorreccionMarcacion } from './asistencia.models';
import { ESTILOS } from './asistencia.estilos';

/** Filas por página: las que caben sin tener que bajar. */
const POR_PAGINA = 10;

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
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Auditoría</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Toda hora corregida a mano, con su autor y su motivo
          </p>
        </div>
        <button type="button" [class]="estilos.botonPrimario" (click)="descargar()"
                [disabled]="!filtradas().length">
          <lucide-angular name="download" [size]="15" class="block"></lucide-angular>
          Descargar
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-desde">Desde</label>
          <input id="aud-desde" type="date" [class]="estilos.campo + ' w-[148px]'"
                 [ngModel]="desdeAud()" (ngModelChange)="cambiarRango($event, hastaAud())">
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-hasta">Hasta</label>
          <input id="aud-hasta" type="date" [class]="estilos.campo + ' w-[148px]'"
                 [ngModel]="hastaAud()" (ngModelChange)="cambiarRango(desdeAud(), $event)">
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-quien">Quién corrigió</label>
          <select id="aud-quien" [class]="estilos.campo + ' w-[210px]'"
                  [ngModel]="quien()" (ngModelChange)="quien.set($event); pagina.set(1)">
            <option value="">Todos</option>
            @for (q of quienes(); track q) { <option [value]="q">{{ q }}</option> }
          </select>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
    <div class="aparecer">

      @if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
      } @else {
        <div [class]="estilos.panel">
          <table class="w-full border-collapse">
            <caption class="sr-only">Correcciones manuales</caption>
            <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
              <tr>
                <th scope="col" [class]="estilos.th">Cuándo</th>
                <th scope="col" [class]="estilos.th">Persona</th>
                <th scope="col" [class]="estilos.th">Día</th>
                <th scope="col" [class]="estilos.th">Marca</th>
                <th scope="col" [class]="estilos.th">Antes</th>
                <th scope="col" [class]="estilos.th">Después</th>
                <th scope="col" [class]="estilos.th">Motivo</th>
                <th scope="col" [class]="estilos.th">Corrigió</th>
              </tr>
            </thead>
            <tbody>
              @for (c of visibles(); track c.id) {
                <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#f4f6f9] dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td [class]="estilos.td + ' secundario'">{{ c.cuando | date: 'dd/MM HH:mm' }}</td>
                  <td [class]="estilos.td + ' max-w-[180px] truncate font-semibold'">{{ c.nombreAgente }}</td>
                  <td [class]="estilos.td">{{ c.fecha | date: 'dd/MM' }}</td>
                  <td [class]="estilos.td">{{ c.marca }}</td>
                  <td [class]="estilos.td">
                    @if (c.antes) {
                      {{ c.antes }}
                    } @else {
                      <span class="inline-flex items-center rounded-full bg-[#fdecec] px-[9px] py-0.5 text-[11.5px] font-bold text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300">
                        Sin marcación
                      </span>
                    }
                  </td>
                  <!-- El punto ámbar es la marca escrita a mano, como en el reporte. -->
                  <td [class]="estilos.td + ' font-bold'">
                    <span class="inline-flex items-center gap-[7px]">
                      {{ c.despues ?? '—' }}
                      <span class="h-1.5 w-1.5 rounded-full bg-[#d97706] dark:bg-amber-400" aria-hidden="true"></span>
                    </span>
                  </td>
                  <td [class]="estilos.td + ' max-w-[240px] !whitespace-normal'">{{ c.motivo ?? '—' }}</td>
                  <td [class]="estilos.td + ' secundario'">{{ c.corrigio ?? '—' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="!px-3 !py-14 text-center">
                    <strong class="block text-[13.5px]">Sin correcciones</strong>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                      Nadie ha completado marcaciones a mano en este rango.
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (filtradas().length) {
            <div class="flex items-center justify-between gap-3 border-t border-[#f1f3f6] px-3 py-2.5 dark:border-slate-800">
              <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                {{ primera() }}–{{ primera() + visibles().length - 1 }} de {{ filtradas().length }}
              </span>
              <div class="flex gap-1.5">
                <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() - 1)"
                        [disabled]="pagina() === 1" aria-label="Página anterior">
                  <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
                </button>
                <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() + 1)"
                        [disabled]="pagina() === paginas()" aria-label="Página siguiente">
                  <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
    </div>
  `
})
export class AsistenciaAuditoriaComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;

  /** El rango del módulo: la auditoría abre en el mes de ese rango. */
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  /** El rango propio de la pantalla, que se puede mover sin tocar el del módulo. */
  readonly desdeAud = signal('');
  readonly hastaAud = signal('');

  readonly correcciones = signal<CorreccionMarcacion[]>([]);
  readonly cargando = signal(false);
  readonly quien = signal('');
  readonly pagina = signal(1);

  /** Quién ha corregido algo en el rango: no un catálogo, los reales. */
  readonly quienes = computed(() =>
    [...new Set(this.correcciones().map(c => c.corrigio).filter((q): q is string => !!q))].sort());

  readonly filtradas = computed(() => {
    const q = this.quien();
    return this.correcciones().filter(c => !q || c.corrigio === q);
  });

  readonly paginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / POR_PAGINA)));
  readonly primera = computed(() => (Math.min(this.pagina(), this.paginas()) - 1) * POR_PAGINA + 1);
  readonly visibles = computed(() =>
    this.filtradas().slice(this.primera() - 1, this.primera() - 1 + POR_PAGINA));

  constructor() {
    // Al cambiar el rango del módulo, la auditoría se va a su mes entero.
    effect(() => {
      const [anio, mes] = this.desde().split('-').map(Number);
      const ultimo = new Date(anio, mes, 0).getDate();
      const mm = String(mes).padStart(2, '0');
      untracked(() => this.cambiarRango(`${anio}-${mm}-01`, `${anio}-${mm}-${ultimo}`));
    });
  }

  cambiarRango(desde: string, hasta: string): void {
    this.desdeAud.set(desde);
    this.hastaAud.set(hasta);
    this.pagina.set(1);
    if (desde && hasta && desde <= hasta) {
      this.cargar(desde, hasta);
    }
  }

  /**
   * La misma tabla que se está viendo, en CSV. Se arma en el navegador porque
   * es exactamente lo que hay en pantalla: pedirla otra vez al backend podría
   * devolver algo distinto de lo que se acaba de filtrar.
   */
  descargar(): void {
    const cabecera = ['Cuándo', 'Persona', 'Día', 'Marca', 'Antes', 'Después', 'Motivo', 'Corrigió'];
    const filas = this.filtradas().map(c => [
      c.cuando, c.nombreAgente ?? '', c.fecha, c.marca,
      c.antes ?? 'sin marca', c.despues ?? '', c.motivo ?? '', c.corrigio ?? ''
    ]);
    const csv = [cabecera, ...filas]
      .map(f => f.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `Auditoria_${this.desdeAud()}_${this.hastaAud()}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
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
