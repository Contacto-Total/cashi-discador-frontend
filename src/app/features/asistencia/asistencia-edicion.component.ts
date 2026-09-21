import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaDia, AsistenciaReporte, ResumenAgente, TipoMarcacion } from './asistencia.models';
import { ESTADOS, ESTILOS } from './asistencia.estilos';

/** Las seis marcas, con el nombre que se lee en el aviso de accesibilidad. */
const MARCAS: Record<TipoMarcacion, { etiqueta: string; campo: keyof AsistenciaDia }> = {
  ENTRADA: { etiqueta: 'Entrada', campo: 'entrada' },
  ALMUERZO_INICIO: { etiqueta: 'Inicio del almuerzo', campo: 'almuerzoInicio' },
  ALMUERZO_FIN: { etiqueta: 'Fin del almuerzo', campo: 'almuerzoFin' },
  BREAK_INICIO: { etiqueta: 'Inicio del break', campo: 'breakInicio' },
  BREAK_FIN: { etiqueta: 'Fin del break', campo: 'breakFin' },
  SALIDA: { etiqueta: 'Salida', campo: 'salida' }
};

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
 * toda la semana de alguien, y hacerlo abriendo seis modales no es trabajo,
 * es castigo.
 *
 * El almuerzo y el break van en una sola columna con sus dos horas juntas:
 * son una pausa, no dos datos sueltos, y así la tabla cabe sin scroll.
 *
 * El motivo NO es una columna: es un chip que aparece en el día en cuanto se
 * le toca una hora. Una columna de texto por fila deja seis cajas vacías
 * pidiendo algo que casi nunca hace falta.
 */
@Component({
  selector: 'app-asistencia-edicion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    /* Las dos horas de una pausa, juntas. */
    .par-edit { display: flex; gap: 4px }

    /* Se cualifica con input y no solo con la clase: la regla global de este
       proyecto para input[type=time] pesa más que una clase sola y estiraba
       la celda al 100 %. */
    input.celda-edit {
      width: 116px; height: 32px; padding: 0 8px; border-radius: 6px;
      border: 1px solid #8491a3; background: #fff; color: #0f172a;
      font: inherit; font-size: 12.5px; font-variant-numeric: tabular-nums;
    }
    input.celda-edit:focus-visible {
      outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.2);
    }
    input.celda-edit.cambiada { border-color: #d97706; background: #fffbeb }
    input.celda-edit.vacia { border-style: dashed; border-color: #f5a3a3 }
    :host-context(.dark) input.celda-edit { border-color: #475569; background: #0f172a; color: #f1f5f9 }
    :host-context(.dark) input.celda-edit.cambiada { border-color: #b45309; background: rgba(120,53,15,.35) }

    /* El motivo vive en la fila de su día y solo aparece cuando hay algo que
       explicar. */
    .chip-motivo {
      margin-left: 8px; height: 22px; padding: 0 9px; border-radius: 999px;
      border: 1px solid #f59e0b; background: #fef6e0; color: #92400e;
      font-size: 11px; font-weight: 700; cursor: pointer;
    }
    .chip-motivo.puesto { border-color: #16a34a; background: #e8f5ec; color: #166534 }

    .barra-edicion {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 10px 16px; padding: 12px 16px; margin-top: 14px;
      background: #fff; border: 1px solid #e6e9ee; border-radius: 12px;
      box-shadow: 0 1px 2px rgba(15,23,42,.04);
    }
    :host-context(.dark) .barra-edicion { background: #0f172a; border-color: #1e293b }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Editar horas</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Se corrige a una persona a la vez
          </p>
        </div>
        <button type="button" [class]="estilos.botonSecundario" (click)="volver.emit()">
          <lucide-angular name="arrow-left" [size]="15" class="block"></lucide-angular>
          Volver al reporte
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="agente-edicion">Agente</label>
          <select id="agente-edicion" [class]="estilos.campo + ' w-[260px]'"
                  [ngModel]="idElegido()" (ngModelChange)="elegir($event)">
            @for (a of roster(); track a.idUsuario) {
              <option [ngValue]="a.idUsuario">{{ a.nombreAgente }}</option>
            }
          </select>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
      @if (!idSubcartera() || !roster().length) {
        <div [class]="estilos.vacio">
          <strong class="block text-[13.5px]">Elige un ámbito con personas</strong>
          <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            La edición trabaja sobre una persona del cliente y la cartera elegidos.
          </span>
        </div>
      } @else if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
      } @else if (persona(); as p) {
        <div class="aparecer">

          <div class="mb-3 flex flex-wrap items-center justify-between gap-3 px-0.5">
            <div>
              <h2 class="!m-0 flex flex-wrap items-center gap-[9px] text-xl font-extrabold tracking-[-0.01em]">
                {{ p.nombreAgente }}
                @if (p.rol) {
                  <span [class]="p.rol === 'Supervisor' ? estilos.rolSupervisor : estilos.rolAsesor">
                    {{ p.rol }}
                  </span>
                }
              </h2>
              <p class="mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ rangoTexto() }}</p>
            </div>
          </div>

          <div [class]="estilos.panel">
            <table class="w-full border-collapse">
              <caption class="sr-only">Horas de {{ p.nombreAgente }}</caption>
              <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                <tr>
                  <th scope="col" [class]="estilos.th">Fecha</th>
                  <th scope="col" [class]="estilos.th">Entrada</th>
                  <th scope="col" [class]="estilos.th">Almuerzo</th>
                  <th scope="col" [class]="estilos.th">Break</th>
                  <th scope="col" [class]="estilos.th">Salida</th>
                  <th scope="col" [class]="estilos.th">Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (dia of dias(); track dia.fecha) {
                  <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800"
                      [class.opacity-50]="dia.estado === 'NO_LABORABLE'">
                    <td [class]="estilos.td">
                      <strong>{{ dia.fecha | date: 'dd/MM' }}</strong>
                      <span class="ml-1.5 text-[#8491a3] dark:text-slate-500">{{ dia.nombreDia.slice(0, 3) }}</span>
                      @if (tieneCambios(dia.fecha)) {
                        <button type="button" class="chip-motivo"
                                [class.puesto]="!!(motivos()[dia.fecha] ?? '').trim()"
                                (click)="abrirMotivo(dia)"
                                [title]="(motivos()[dia.fecha] ?? '').trim() || 'Falta el motivo'">
                          {{ (motivos()[dia.fecha] ?? '').trim() ? '✓ Motivo' : 'Motivo' }}
                        </button>
                      }
                    </td>

                    <td [class]="estilos.td">
                      <ng-container [ngTemplateOutlet]="celda"
                        [ngTemplateOutletContext]="{ dia: dia, tipo: 'ENTRADA' }"></ng-container>
                    </td>
                    <td [class]="estilos.td">
                      <div class="par-edit">
                        <ng-container [ngTemplateOutlet]="celda"
                          [ngTemplateOutletContext]="{ dia: dia, tipo: 'ALMUERZO_INICIO' }"></ng-container>
                        <ng-container [ngTemplateOutlet]="celda"
                          [ngTemplateOutletContext]="{ dia: dia, tipo: 'ALMUERZO_FIN' }"></ng-container>
                      </div>
                    </td>
                    <td [class]="estilos.td">
                      <div class="par-edit">
                        <ng-container [ngTemplateOutlet]="celda"
                          [ngTemplateOutletContext]="{ dia: dia, tipo: 'BREAK_INICIO' }"></ng-container>
                        <ng-container [ngTemplateOutlet]="celda"
                          [ngTemplateOutletContext]="{ dia: dia, tipo: 'BREAK_FIN' }"></ng-container>
                      </div>
                    </td>
                    <td [class]="estilos.td">
                      <ng-container [ngTemplateOutlet]="celda"
                        [ngTemplateOutletContext]="{ dia: dia, tipo: 'SALIDA' }"></ng-container>
                    </td>

                    <td [class]="estilos.td">
                      <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-bold"
                            [class]="ESTADOS[dia.estado].clase">
                        {{ dia.tipoDia ?? ESTADOS[dia.estado].texto }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-3 py-14 text-center">
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

          <div class="barra-edicion">
            <p class="!m-0 text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ resumen() }}</p>
            <div class="flex gap-2">
              <button type="button" [class]="estilos.botonSecundario + ' !h-[34px] !text-[12.5px]'"
                      (click)="descartar()" [disabled]="!cambios().length">
                <lucide-angular name="rotate-ccw" [size]="13" class="block"></lucide-angular>
                Descartar
              </button>
              <button type="button" [class]="estilos.botonPrimario + ' !h-[34px] !text-[12.5px]'"
                      (click)="guardar()" [disabled]="!cambios().length || guardando()">
                <lucide-angular name="save" [size]="13" class="block"></lucide-angular>
                {{ guardando() ? 'Guardando…' : 'Guardar' }}
              </button>
            </div>
          </div>

          @if (error()) {
            <p class="mt-2 text-xs text-[#b91c1c]">{{ error() }}</p>
          }
        </div>
      }
    </div>

    <!-- Motivo de un día. Uno por día y no uno para todo: cada día se corrige
         por una razón distinta, y es lo que se lee después en Auditoría. -->
    @if (motivoDe(); as dia) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarMotivo()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,460px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-motivo">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-motivo" class="!m-0 text-[15px] font-extrabold">Motivo de la corrección</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ dia.fecha | date: 'dd/MM/yyyy' }} · {{ cambiosDelDia(dia.fecha) }}
                {{ cambiosDelDia(dia.fecha) === 1 ? 'hora cambiada' : 'horas cambiadas' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarMotivo()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>
          <div class="flex flex-col gap-1.5 px-5 py-4">
            <label [class]="estilos.etiqueta" for="texto-motivo">Qué pasó</label>
            <textarea id="texto-motivo" rows="2" [class]="estilos.area"
                      placeholder="Ej.: olvidó marcar el regreso del almuerzo"
                      [ngModel]="borrador()" (ngModelChange)="borrador.set($event)"></textarea>
            @if (errorMotivo()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ errorMotivo() }}</p>
            }
          </div>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarMotivo()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="aceptarMotivo(dia)">Aceptar</button>
          </footer>
        </div>
      </div>
    }

    <!-- Una celda de hora: se nota si está tocada y se nota si está vacía. -->
    <ng-template #celda let-dia="dia" let-tipo="tipo">
      <input type="time" class="celda-edit"
             [class.cambiada]="estaTocada(dia.fecha, tipo)"
             [class.vacia]="!valorDe(dia, tipo) && !estaTocada(dia.fecha, tipo)"
             [disabled]="dia.estado === 'NO_LABORABLE'"
             [ngModel]="valorActual(dia, tipo)"
             (ngModelChange)="cambiar(dia, tipo, $event)"
             [attr.aria-label]="nombreDe(tipo) + ' del ' + dia.fecha">
    </ng-template>
  `
})
export class AsistenciaEdicionComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADOS = ESTADOS;
  protected readonly MARCAS = MARCAS;

  readonly idSubcartera = input<number | null>(null);
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  /** Vuelve al reporte; la pantalla la manda el módulo. */
  readonly volver = output<void>();

  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');

  readonly idElegido = signal<number | null>(null);
  readonly cambios = signal<Cambio[]>([]);
  readonly motivos = signal<Record<string, string>>({});

  /** El día cuyo motivo se está escribiendo. */
  readonly motivoDe = signal<AsistenciaDia | null>(null);
  readonly borrador = signal('');
  readonly errorMotivo = signal('');

  readonly roster = computed<ResumenAgente[]>(() => this.reporte()?.agentes ?? []);

  readonly persona = computed<ResumenAgente | null>(() =>
    this.roster().find(a => a.idUsuario === this.idElegido()) ?? null);

  readonly dias = computed<AsistenciaDia[]>(() => {
    const id = this.idElegido();
    return id ? (this.reporte()?.dias ?? []).filter(d => d.idUsuario === id) : [];
  });

  readonly rangoTexto = computed(() => {
    const d = this.dias();
    return d.length ? `${this.corta(d[0].fecha)} – ${this.corta(d[d.length - 1].fecha)}` : '';
  });

  /** Lo que falta para poder guardar, dicho en la propia barra. */
  readonly resumen = computed(() => {
    const cuantas = this.cambios().length;
    if (!cuantas) {
      return 'Sin cambios';
    }
    const sinMotivo = this.diasSinMotivo();
    const horas = `${cuantas} ${cuantas === 1 ? 'hora cambiada' : 'horas cambiadas'}`;
    return sinMotivo.length
      ? `${horas} · falta el motivo de ${sinMotivo.map(f => this.corta(f)).join(', ')}`
      : `${horas} · listo para guardar`;
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

  /** El nombre de una marca, para el lector de pantalla. */
  nombreDe(tipo: TipoMarcacion): string {
    return MARCAS[tipo].etiqueta;
  }

  valorDe(dia: AsistenciaDia, tipo: TipoMarcacion): string {
    return (dia[MARCAS[tipo].campo] as string | null) ?? '';
  }

  /** Lo tecleado si lo hay; si no, lo que vino del backend. */
  valorActual(dia: AsistenciaDia, tipo: TipoMarcacion): string {
    const tocada = this.cambios().find(c => c.fecha === dia.fecha && c.tipo === tipo);
    return tocada ? tocada.hora : this.valorDe(dia, tipo);
  }

  estaTocada(fecha: string, tipo: TipoMarcacion): boolean {
    return this.cambios().some(c => c.fecha === fecha && c.tipo === tipo);
  }

  tieneCambios(fecha: string): boolean {
    return this.cambios().some(c => c.fecha === fecha);
  }

  cambiosDelDia(fecha: string): number {
    return this.cambios().filter(c => c.fecha === fecha).length;
  }

  cambiar(dia: AsistenciaDia, tipo: TipoMarcacion, hora: string): void {
    const original = this.valorDe(dia, tipo);
    this.error.set('');
    this.cambios.update(lista => {
      const resto = lista.filter(c => !(c.fecha === dia.fecha && c.tipo === tipo));
      // Volver al valor original no es un cambio: se quita de la lista.
      return !hora || hora === original ? resto : [...resto, { fecha: dia.fecha, tipo, hora }];
    });
  }

  // ==================== MOTIVO ====================

  abrirMotivo(dia: AsistenciaDia): void {
    this.motivoDe.set(dia);
    this.borrador.set(this.motivos()[dia.fecha] ?? '');
    this.errorMotivo.set('');
  }

  cerrarMotivo(): void {
    this.motivoDe.set(null);
  }

  aceptarMotivo(dia: AsistenciaDia): void {
    if (!this.borrador().trim()) {
      this.errorMotivo.set('Hace falta: es lo que se lee después en Auditoría');
      return;
    }
    this.motivos.update(actual => ({ ...actual, [dia.fecha]: this.borrador().trim() }));
    this.cerrarMotivo();
    this.error.set('');
  }

  private diasSinMotivo(): string[] {
    return [...new Set(this.cambios().map(c => c.fecha))]
      .filter(f => !(this.motivos()[f] ?? '').trim());
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
    const sinMotivo = this.diasSinMotivo();
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
