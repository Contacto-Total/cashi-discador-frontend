import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaDia, AsistenciaReporte, ResumenAgente, TipoMarcacion } from './asistencia.models';
import { ESTADOS, ESTILOS } from './asistencia.estilos';

/** Las seis marcas, en el orden en que ocurren: el break va después del almuerzo. */
const COLUMNAS: { tipo: TipoMarcacion; etiqueta: string; campo: keyof AsistenciaDia }[] = [
  { tipo: 'ENTRADA', etiqueta: 'Entrada', campo: 'entrada' },
  { tipo: 'ALMUERZO_INICIO', etiqueta: 'Almuerzo', campo: 'almuerzoInicio' },
  { tipo: 'ALMUERZO_FIN', etiqueta: 'Fin almuerzo', campo: 'almuerzoFin' },
  { tipo: 'BREAK_INICIO', etiqueta: 'Break', campo: 'breakInicio' },
  { tipo: 'BREAK_FIN', etiqueta: 'Fin break', campo: 'breakFin' },
  { tipo: 'SALIDA', etiqueta: 'Salida', campo: 'salida' }
];

/** Una hora cambiada, esperando su motivo. */
interface Cambio {
  fecha: string;
  tipo: TipoMarcacion;
  hora: string;
}

/**
 * Editar horas: corregir la semana entera de una persona de una vez.
 *
 * Existe aparte del reporte porque es otra tarea. En el reporte se mira y se
 * corrige un día suelto desde su fila; aquí se entra cuando hay que repasar
 * toda la semana de alguien —el caso de la persona que se quedó sin marcar
 * varios días—, y hacerlo abriendo seis modales no es trabajo, es castigo.
 *
 * El motivo va por DÍA y no uno solo para todo: cada día se corrige por una
 * razón distinta, y es lo que después se lee en la auditoría.
 */
@Component({
  selector: 'app-asistencia-edicion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    /* La celda de hora: se nota cuando está tocada, y se nota si está vacía. */
    .hora {
      width: 86px; height: 32px; border-radius: 7px; padding: 0 8px;
      border: 1px solid #e6e9ee; background: #fff; color: #0f172a;
      font: inherit; font-size: 12.5px; font-variant-numeric: tabular-nums;
    }
    .hora:focus-visible { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.2) }
    .hora.tocada { border-color: #d97706; background: #fffbeb }
    .hora.sin-marca { border-style: dashed; border-color: #f5a3a3 }
    :host-context(.dark) .hora { border-color: #334155; background: #0f172a; color: #f1f5f9 }
    :host-context(.dark) .hora.tocada { border-color: #b45309; background: rgba(120,53,15,.35) }
  `],
  template: `
    @if (!idSubcartera()) {
      <div [class]="estilos.vacio">
        <strong class="block text-[13.5px]">Elige una subcartera</strong>
        <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
          Vuelve al reporte, elige el ámbito y entra otra vez aquí.
        </span>
      </div>
    } @else {
      <div class="aparecer">

        <div class="mb-3.5 flex flex-wrap items-end justify-between gap-3">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="persona-edicion">Persona</label>
            <select id="persona-edicion" [class]="estilos.campo + ' w-[260px]'"
                    [ngModel]="idElegido()" (ngModelChange)="elegir($event)">
              @for (a of roster(); track a.idUsuario) {
                <option [ngValue]="a.idUsuario">{{ a.nombreAgente }}</option>
              }
            </select>
          </div>

          <div class="flex items-center gap-2.5">
            @if (cambios().length) {
              <span class="text-[12.5px] font-semibold text-[#92400e] dark:text-amber-300">
                {{ cambios().length }} {{ cambios().length === 1 ? 'hora cambiada' : 'horas cambiadas' }}
              </span>
            }
            <button type="button" [class]="estilos.botonSecundario" (click)="descartar()"
                    [disabled]="!cambios().length">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
              Descartar
            </button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardar()"
                    [disabled]="!cambios().length || guardando()">
              <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
              {{ guardando() ? 'Guardando…' : 'Guardar cambios' }}
            </button>
          </div>
        </div>

        @if (cargando()) {
          <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
        } @else {
          <div [class]="estilos.panel">
            <table class="w-full border-collapse">
              <caption class="sr-only">Horas de {{ nombreElegido() }}</caption>
              <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                <tr>
                  <th scope="col" [class]="estilos.th">Fecha</th>
                  @for (c of COLUMNAS; track c.tipo) {
                    <th scope="col" [class]="estilos.th">{{ c.etiqueta }}</th>
                  }
                  <th scope="col" [class]="estilos.th">Estado</th>
                  <th scope="col" [class]="estilos.th + ' !w-[260px]'">Motivo</th>
                </tr>
              </thead>
              <tbody>
                @for (dia of dias(); track dia.fecha) {
                  <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800"
                      [class.opacity-50]="dia.estado === 'NO_LABORABLE'">
                    <td [class]="estilos.td">
                      <span class="font-semibold">{{ dia.fecha | date: 'dd/MM' }}</span>
                      <span class="ml-1.5 text-[#8491a3] dark:text-slate-500">{{ dia.nombreDia.slice(0, 3) }}</span>
                    </td>

                    @for (c of COLUMNAS; track c.tipo) {
                      <td [class]="estilos.td">
                        <input type="time" class="hora"
                               [class.tocada]="estaTocada(dia.fecha, c.tipo)"
                               [class.sin-marca]="!valorDe(dia, c.campo) && !estaTocada(dia.fecha, c.tipo)"
                               [disabled]="dia.estado === 'NO_LABORABLE'"
                               [ngModel]="valorActual(dia, c)"
                               (ngModelChange)="cambiar(dia, c.tipo, $event)"
                               [attr.aria-label]="c.etiqueta + ' del ' + dia.fecha">
                      </td>
                    }

                    <td [class]="estilos.td">
                      <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-bold"
                            [class]="ESTADOS[dia.estado].clase">
                        {{ dia.tipoDia ?? ESTADOS[dia.estado].texto }}
                      </span>
                    </td>

                    <!-- El motivo solo se habilita cuando ese día tiene alguna
                         hora cambiada: pedirlo antes es ruido. -->
                    <td [class]="estilos.td">
                      <input type="text" [class]="estilos.campo + ' !h-[32px] !text-[12.5px]'"
                             [disabled]="!tieneCambios(dia.fecha)"
                             [placeholder]="tieneCambios(dia.fecha) ? 'Por qué se corrige' : ''"
                             [ngModel]="motivos()[dia.fecha] ?? ''"
                             (ngModelChange)="escribirMotivo(dia.fecha, $event)"
                             [attr.aria-label]="'Motivo de la corrección del ' + dia.fecha">
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td [attr.colspan]="COLUMNAS.length + 3" class="px-3 py-14 text-center">
                      <strong class="block text-[13.5px]">Sin días en ese rango</strong>
                      <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                        Cambia las fechas desde el reporte.
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <p class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
            <span class="inline-flex items-center gap-1.5">
              <span class="inline-block h-3 w-3 rounded-[3px] border border-dashed border-[#f5a3a3]"></span>
              Sin marcación
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="inline-block h-3 w-3 rounded-[3px] border border-[#d97706] bg-[#fffbeb]"></span>
              Cambiada, sin guardar
            </span>
            <span>Cada día guarda su propio motivo, y es lo que se lee después en Auditoría.</span>
          </p>

          @if (error()) {
            <p class="mt-2 text-xs text-[#b91c1c]">{{ error() }}</p>
          }
        }
      </div>
    }
  `
})
export class AsistenciaEdicionComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADOS = ESTADOS;
  protected readonly COLUMNAS = COLUMNAS;

  readonly idSubcartera = input<number | null>(null);
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');

  readonly idElegido = signal<number | null>(null);
  readonly cambios = signal<Cambio[]>([]);
  readonly motivos = signal<Record<string, string>>({});

  readonly roster = computed<ResumenAgente[]>(() => this.reporte()?.agentes ?? []);

  readonly nombreElegido = computed(() =>
    this.roster().find(a => a.idUsuario === this.idElegido())?.nombreAgente ?? '');

  readonly dias = computed<AsistenciaDia[]>(() => {
    const id = this.idElegido();
    return id ? (this.reporte()?.dias ?? []).filter(d => d.idUsuario === id) : [];
  });

  constructor() {
    effect(() => {
      const ambito = this.idSubcartera();
      const desde = this.desde();
      const hasta = this.hasta();
      if (!ambito) {
        this.reporte.set(null);
        return;
      }
      this.cargar(desde, hasta, ambito);
    });
  }

  private cargar(desde: string, hasta: string, idSubcartera: number): void {
    this.cargando.set(true);
    this.servicio.reporte(desde, hasta, idSubcartera).subscribe({
      next: r => {
        this.reporte.set(r);
        this.idElegido.set(r.agentes[0]?.idUsuario ?? null);
        this.descartar();
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar la asistencia');
        this.cargando.set(false);
      }
    });
  }

  /** Cambiar de persona con cambios sin guardar los pierde: se avisa. */
  elegir(id: number): void {
    if (this.cambios().length
        && !confirm('Tienes horas cambiadas sin guardar. ¿Las descartas?')) {
      return;
    }
    this.idElegido.set(id);
    this.descartar();
  }

  // ==================== EDICIÓN ====================

  valorDe(dia: AsistenciaDia, campo: keyof AsistenciaDia): string {
    return (dia[campo] as string | null) ?? '';
  }

  /** Lo tecleado si lo hay; si no, lo que vino del backend. */
  valorActual(dia: AsistenciaDia, columna: { tipo: TipoMarcacion; campo: keyof AsistenciaDia }): string {
    const tocada = this.cambios().find(c => c.fecha === dia.fecha && c.tipo === columna.tipo);
    return tocada ? tocada.hora : this.valorDe(dia, columna.campo);
  }

  estaTocada(fecha: string, tipo: TipoMarcacion): boolean {
    return this.cambios().some(c => c.fecha === fecha && c.tipo === tipo);
  }

  tieneCambios(fecha: string): boolean {
    return this.cambios().some(c => c.fecha === fecha);
  }

  cambiar(dia: AsistenciaDia, tipo: TipoMarcacion, hora: string): void {
    const columna = COLUMNAS.find(c => c.tipo === tipo)!;
    const original = this.valorDe(dia, columna.campo);
    this.error.set('');

    this.cambios.update(lista => {
      const resto = lista.filter(c => !(c.fecha === dia.fecha && c.tipo === tipo));
      // Volver al valor original no es un cambio: se quita de la lista.
      return !hora || hora === original ? resto : [...resto, { fecha: dia.fecha, tipo, hora }];
    });
  }

  escribirMotivo(fecha: string, texto: string): void {
    this.motivos.update(actual => ({ ...actual, [fecha]: texto }));
    this.error.set('');
  }

  descartar(): void {
    this.cambios.set([]);
    this.motivos.set({});
    this.error.set('');
  }

  /**
   * Manda una corrección por cada hora cambiada. Van de una en una porque cada
   * marcación es una fila propia en el backend, con su origen y su motivo.
   */
  guardar(): void {
    const id = this.idElegido();
    if (!id) {
      return;
    }

    const dias = [...new Set(this.cambios().map(c => c.fecha))];
    const sinMotivo = dias.filter(f => !(this.motivos()[f] ?? '').trim());
    if (sinMotivo.length) {
      this.error.set(sinMotivo.length === 1
        ? `Falta el motivo del ${this.corta(sinMotivo[0])}`
        : `Faltan los motivos de: ${sinMotivo.map(f => this.corta(f)).join(', ')}`);
      return;
    }

    this.guardando.set(true);
    let pendientes = this.cambios().length;
    let fallo = false;

    for (const c of this.cambios()) {
      this.servicio.completarMarcacion({
        idUsuario: id,
        fecha: c.fecha,
        tipo: c.tipo,
        hora: this.conSegundos(c.hora),
        motivo: this.motivos()[c.fecha].trim()
      }).subscribe({
        next: () => this.alTerminar(--pendientes, fallo),
        error: () => {
          fallo = true;
          this.alTerminar(--pendientes, fallo);
        }
      });
    }
  }

  private alTerminar(pendientes: number, fallo: boolean): void {
    if (pendientes > 0) {
      return;
    }
    this.guardando.set(false);
    if (fallo) {
      this.toast.error('Alguna corrección no se pudo guardar');
      return;
    }
    this.toast.success('Horas corregidas');
    const ambito = this.idSubcartera();
    if (ambito) {
      this.cargar(this.desde(), this.hasta(), ambito);
    }
  }

  private corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  /** El input de tipo time devuelve HH:mm cuando los segundos son cero. */
  private conSegundos(hora: string): string {
    return hora.length === 5 ? `${hora}:00` : hora;
  }
}
