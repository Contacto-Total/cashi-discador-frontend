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
          <label [class]="estilos.etiqueta" for="aud-quien">Quién corrigió</label>
          <select id="aud-quien" [class]="estilos.campo + ' w-[210px]'"
                  [ngModel]="quien()" (ngModelChange)="quien.set($event)">
            <option value="">Todos</option>
            @for (q of quienes(); track q) { <option [value]="q">{{ q }}</option> }
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-buscar">Buscar</label>
          <input id="aud-buscar" type="search" placeholder="Persona o motivo"
                 [class]="estilos.campo + ' w-[220px]'"
                 [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)">
        </div>
        <span class="pb-[11px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
          {{ filtradas().length }} {{ filtradas().length === 1 ? 'corrección' : 'correcciones' }}
        </span>
      </div>
    </div>

    <div class="px-7 py-5">
    <div class="aparecer">

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
                <th scope="col" [class]="estilos.th">Antes</th>
                <th scope="col" [class]="estilos.th">Después</th>
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
                  <td [class]="estilos.td + ' text-[#8491a3] dark:text-slate-500'">
                    {{ c.antes ?? 'sin marca' }}
                  </td>
                  <td [class]="estilos.td + ' font-bold'">{{ c.despues ?? '—' }}</td>
                  <td [class]="estilos.td + ' !whitespace-normal'">{{ c.motivo ?? '—' }}</td>
                  <td [class]="estilos.td">{{ c.corrigio ?? '—' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="px-3 py-14 text-center">
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
  readonly quien = signal('');

  /** Quién ha corregido algo en el rango: no un catálogo, los reales. */
  readonly quienes = computed(() =>
    [...new Set(this.correcciones().map(c => c.corrigio).filter((q): q is string => !!q))].sort());

  readonly filtradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const q = this.quien();
    return this.correcciones().filter(c => {
      if (q && c.corrigio !== q) {
        return false;
      }
      if (!texto) {
        return true;
      }
      return (c.nombreAgente ?? '').toLowerCase().includes(texto)
        || (c.motivo ?? '').toLowerCase().includes(texto)
        || (c.corrigio ?? '').toLowerCase().includes(texto);
    });
  });

  constructor() {
    effect(() => {
      const desde = this.desde();
      const hasta = this.hasta();
      this.cargar(desde, hasta);
    });
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
    enlace.download = `Auditoria_${this.desde()}_${this.hasta()}.csv`;
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
