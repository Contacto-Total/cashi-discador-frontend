import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { Inhabilitacion, PersonalAsistencia } from './asistencia.models';
import { ESTILOS, hoy } from './asistencia.estilos';
import { Visor, VisorArchivoComponent } from './visor-archivo.component';

/** «2026-10-26T11:30»: lo que pide un input datetime-local, en la hora del equipo. */
function ahoraLocal(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  return `${hoy()}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Configuración › Inhabilitaciones: RR.HH. impide el ingreso a Cashi de un
 * asesor durante un rango de fecha y hora. El bloqueo lo hace el login.
 *
 * Sin sustento es un descanso y las horas quedan como no trabajadas; con
 * sustento es una licencia y cuenta como día justificado. El sustento puede
 * llegar después: se adjunta desde la fila. Las vacaciones salen en la misma
 * lista porque también bloquean el ingreso, pero se anulan en su pestaña.
 */
@Component({
  selector: 'app-asistencia-inhabilitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, VisorArchivoComponent],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    .titulo-seccion { margin: 0; font-size: 15px; font-weight: 800 }
    .fila-seccion {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 10px; min-height: 38px; margin-bottom: 12px;
    }
    .sub-celda { display: block; margin-top: 2px; font-size: 11.5px; color: #5f6c80 }
    .tabla-personal td.celda-accion { width: 1%; text-align: right }
    .tabla-personal tbody tr td { border-bottom: 1px solid #f1f3f6 }
    .tabla-personal tbody tr:last-child td { border-bottom: 0 }
    .pie-personal { margin: 10px 0 0; font-size: 12.5px; color: #5f6c80 }
    .enlace { color: #2563eb; font-weight: 600; background: none; border: 0; padding: 0; cursor: pointer }
    .enlace:hover { text-decoration: underline }
    :host-context(.dark) .sub-celda, :host-context(.dark) .pie-personal { color: #94a3b8 }
    :host-context(.dark) .tabla-personal tbody tr td { border-color: #1e293b }
    :host-context(.dark) .enlace { color: #93c5fd }
  `],
  template: `
    <div class="px-7 pb-12 pt-5">
      <div class="aparecer">
        <div class="fila-seccion">
          <div class="flex items-baseline gap-2.5">
            <h2 class="titulo-seccion !m-0">Inhabilitaciones</h2>
            <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ cuenta() }}</span>
          </div>
          <button type="button" [class]="estilos.botonPrimario" (click)="abrirForm()">
            <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
            Inhabilitar asesor
          </button>
        </div>

        <div [class]="estilos.panel">
          <table class="tabla-personal w-full border-collapse">
            <caption class="sr-only">Asesores que no pueden ingresar a Cashi</caption>
            <thead>
              <tr class="border-b border-[#e6e9ee] dark:border-slate-800">
                <th scope="col" [class]="estilos.th">Asesor</th>
                <th scope="col" [class]="estilos.th">Motivo</th>
                <th scope="col" [class]="estilos.th">Desde</th>
                <th scope="col" [class]="estilos.th">Hasta</th>
                <th scope="col" [class]="estilos.th">Sustento</th>
                <th scope="col" [class]="estilos.th">Estado</th>
                <th scope="col" [class]="estilos.th">Registrado por</th>
                <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              @for (f of filas(); track f.origen + f.id) {
                <tr>
                  <td [class]="estilos.td + ' font-semibold'">
                    {{ f.nombre }}
                    <span class="sub-celda !font-normal">{{ f.usuario }}@if (f.subcartera) {<span> · {{ f.subcartera }}</span>}</span>
                  </td>
                  <td [class]="estilos.td">
                    <span [class]="MOTIVO[f.motivo].clase">{{ MOTIVO[f.motivo].texto }}</span>
                    @if (f.comentario) {
                      <span class="sub-celda max-w-[220px] truncate" [attr.title]="f.comentario">{{ f.comentario }}</span>
                    }
                  </td>
                  <td [class]="estilos.td">{{ cuando(f, f.desde) }}</td>
                  <td [class]="estilos.td">{{ cuando(f, f.hasta, true) }}</td>
                  <td [class]="estilos.td">
                    @if (f.idJustificacion) {
                      <button type="button" class="enlace max-w-[180px] truncate" (click)="verSustento(f)"
                              [attr.title]="f.sustento">{{ f.sustento ?? 'Ver sustento' }}</button>
                    } @else if (f.origen === 'INHABILITACION') {
                      <button type="button" [class]="estilos.botonChico" (click)="elegirSustento(f, archivoFila)" [disabled]="guardando()">
                        <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        Adjuntar
                      </button>
                    } @else {
                      <span class="text-[#5f6c80]">—</span>
                    }
                  </td>
                  <td [class]="estilos.td"><span [class]="ESTADO[f.estado].clase">{{ ESTADO[f.estado].texto }}</span></td>
                  <td [class]="estilos.td">{{ f.registradoPor ?? '—' }}</td>
                  <td [class]="estilos.td + ' celda-accion'">
                    @if (f.origen === 'VACACIONES') {
                      <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">Se anula en Vacaciones</span>
                    } @else if (f.revocable) {
                      <button type="button" [class]="estilos.botonChico" (click)="abrirRevocar(f)">
                        <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
                        Revocar
                      </button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="8" [class]="estilos.td + ' py-8 text-center text-[#5f6c80]'">Nadie inhabilitado</td></tr>
              }
            </tbody>
          </table>
        </div>
        <p class="pie-personal">Mientras dure, el asesor no puede ingresar a Cashi y el intento no cuenta como asistencia. Sin sustento, esas horas quedan como no trabajadas; con sustento, cuentan como día justificado. Quien se retira debe cerrar su sesión antes de irse.</p>
        <!-- Un solo selector de archivo para el «Adjuntar» de las filas. -->
        <input #archivoFila type="file" class="hidden" accept="image/*,application/pdf" (change)="adjuntar(archivoFila)">
      </div>
    </div>

    <!-- Inhabilitar: asesor, motivo, rango con hora y el sustento si es licencia -->
    @if (formAbierto()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="formAbierto.set(false)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,460px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-inhabilitar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <h2 id="titulo-inhabilitar" class="!m-0 text-[15px] font-extrabold">Inhabilitar asesor</h2>
            <button type="button" [class]="estilos.botonIcono" (click)="formAbierto.set(false)" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="in-asesor">Asesor</label>
              <select id="in-asesor" [class]="estilos.campo"
                      [ngModel]="asesor()" (ngModelChange)="asesor.set($event); error.set('')">
                <option [ngValue]="null">Elige un asesor</option>
                @for (p of asesoresVigentes(); track p.idUsuario) {
                  <option [ngValue]="p.idUsuario">{{ p.nombre }} · {{ p.usuario }}</option>
                }
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <span [class]="estilos.etiqueta" id="in-motivo">Motivo</span>
              <div class="flex rounded-[9px] bg-[#f1f3f6] p-[3px] dark:bg-slate-800" role="radiogroup" aria-labelledby="in-motivo">
                @for (m of MOTIVOS; track m.clave) {
                  <button type="button" role="radio" [attr.aria-checked]="motivo() === m.clave"
                          [class]="estilos.segmento + ' flex-1 ' + (motivo() === m.clave ? estilos.segmentoElegido : estilos.segmentoLibre)"
                          (click)="motivo.set(m.clave); error.set('')">{{ m.texto }}</button>
                }
              </div>
            </div>

            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="in-desde">Desde</label>
                <input id="in-desde" type="datetime-local" [class]="estilos.campo"
                       [ngModel]="desde()" (ngModelChange)="desde.set($event); error.set('')">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="in-hasta">Hasta</label>
                <input id="in-hasta" type="datetime-local" [class]="estilos.campo" [min]="desde()"
                       [ngModel]="hasta()" (ngModelChange)="hasta.set($event); error.set('')">
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="in-archivo">
                Sustento
                <span class="font-semibold normal-case tracking-normal">{{ motivo() === 'LICENCIA' ? '(obligatorio)' : '(si lo tiene, es licencia)' }}</span>
              </label>
              <input id="in-archivo" #archivoForm type="file" accept="image/*,application/pdf" [class]="estilos.campo + ' !h-auto py-1.5'"
                     (change)="archivo.set(archivoForm.files?.[0] ?? null); error.set('')">
            </div>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="in-comentario">Comentario <span class="font-semibold normal-case tracking-normal">(opcional)</span></label>
              <input id="in-comentario" type="text" maxlength="300" [class]="estilos.campo"
                     [ngModel]="comentario()" (ngModelChange)="comentario.set($event)">
            </div>

            <p [class]="estilos.calculo + ' !m-0 text-[12px] leading-[1.45] text-[#334155] dark:text-slate-300'">
              @if (motivo() === 'LICENCIA' || archivo()) {
                Con sustento, ese tiempo cuenta como justificado, igual que una solicitud aprobada.
              } @else {
                Sin sustento, esas horas quedan como no trabajadas hasta que se adjunte.
              }
              El asesor no podrá ingresar en ese rango.
            </p>
            @if (error()) {
              <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="formAbierto.set(false)">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardar()" [disabled]="guardando()">Inhabilitar</button>
          </footer>
        </div>
      </div>
    }

    <!-- Revocar, con su motivo -->
    @if (revocando(); as f) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="revocando.set(null)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,440px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-revocar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-revocar" class="!m-0 text-[15px] font-extrabold">Revocar inhabilitación</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ f.nombre }} · {{ cuando(f, f.desde) }} – {{ cuando(f, f.hasta, true) }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="revocando.set(null)" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>
          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <p class="!m-0 text-[12.5px] text-[#334155] dark:text-slate-300">El asesor podrá ingresar de inmediato.</p>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="in-motivo-revocar">Motivo</label>
              <input id="in-motivo-revocar" type="text" maxlength="300" [class]="estilos.campo"
                     [ngModel]="motivoRevocar()" (ngModelChange)="motivoRevocar.set($event); error.set('')">
            </div>
            @if (error()) {
              <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
            }
          </div>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="revocando.set(null)">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="confirmarRevocar()" [disabled]="guardando()">Revocar</button>
          </footer>
        </div>
      </div>
    }

    @if (visor.abierto(); as abierto) {
      <app-visor-archivo [archivo]="abierto" (cerrar)="visor.cerrar()" />
    }
  `
})
export class AsistenciaInhabilitacionesComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly visor = new Visor();

  readonly idSubcartera = input<number | null>(null);

  protected readonly MOTIVOS = [
    { clave: 'DESCANSO', texto: 'Descanso' },
    { clave: 'LICENCIA', texto: 'Licencia' }
  ] as const;

  private static readonly P = 'inline-flex items-center whitespace-nowrap rounded-full px-[9px] py-[2px] text-[11.5px] font-bold ';
  protected readonly MOTIVO: Record<Inhabilitacion['motivo'], { texto: string; clase: string }> = {
    DESCANSO: { texto: 'Descanso', clase: AsistenciaInhabilitacionesComponent.P + 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' },
    LICENCIA: { texto: 'Licencia', clase: AsistenciaInhabilitacionesComponent.P + 'bg-[#eef2ff] text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300' },
    VACACIONES: { texto: 'Vacaciones', clase: AsistenciaInhabilitacionesComponent.P + 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300' }
  };
  protected readonly ESTADO: Record<Inhabilitacion['estado'], { texto: string; clase: string }> = {
    VIGENTE: { texto: 'Vigente', clase: AsistenciaInhabilitacionesComponent.P + 'bg-[#fdeee0] text-[#c2410c] dark:bg-orange-950/50 dark:text-orange-300' },
    PROGRAMADA: { texto: 'Programada', clase: AsistenciaInhabilitacionesComponent.P + 'bg-[#f1f3f6] text-[#334155] dark:bg-slate-800 dark:text-slate-300' },
    TERMINADA: { texto: 'Terminada', clase: AsistenciaInhabilitacionesComponent.P + 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' },
    REVOCADA: { texto: 'Revocada', clase: AsistenciaInhabilitacionesComponent.P + 'bg-[#f1f3f6] text-[#5f6c80] line-through dark:bg-slate-800 dark:text-slate-400' }
  };

  readonly filas = signal<Inhabilitacion[]>([]);
  readonly personal = signal<PersonalAsistencia[]>([]);
  readonly guardando = signal(false);
  readonly error = signal('');

  readonly formAbierto = signal(false);
  readonly asesor = signal<number | null>(null);
  readonly motivo = signal<'DESCANSO' | 'LICENCIA'>('DESCANSO');
  readonly desde = signal('');
  readonly hasta = signal('');
  readonly comentario = signal('');
  readonly archivo = signal<File | null>(null);

  readonly revocando = signal<Inhabilitacion | null>(null);
  readonly motivoRevocar = signal('');
  /** La fila a la que va el archivo que se está eligiendo. */
  private paraSustento: Inhabilitacion | null = null;

  readonly cuenta = computed(() => {
    const vigentes = this.filas().filter(f => f.estado === 'VIGENTE').length;
    return `${vigentes} ${vigentes === 1 ? 'vigente' : 'vigentes'}`;
  });
  /** Se puede inhabilitar a quien no cesó. */
  readonly asesoresVigentes = computed(() => this.personal().filter(p => !p.fechaCese || p.fechaCese >= hoy()));

  constructor() {
    effect(() => {
      const idSubcartera = this.idSubcartera();
      this.cargar(idSubcartera);
      this.servicio.personal(idSubcartera).subscribe({
        next: p => this.personal.set(p),
        error: () => this.toast.error('No se pudo cargar el personal')
      });
    });
  }

  private cargar(idSubcartera: number | null): void {
    this.servicio.inhabilitaciones(idSubcartera).subscribe({
      next: f => this.filas.set(f),
      error: () => this.toast.error('No se pudieron cargar las inhabilitaciones')
    });
  }

  /** «26/10 11:30»; las vacaciones van por día y su fin es el último día, no las 00:00 del siguiente. */
  cuando(f: Inhabilitacion, iso: string, esFin = false): string {
    const dia = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}`;
    if (f.origen === 'VACACIONES') {
      if (!esFin) {
        return dia(iso);
      }
      const d = new Date(iso.slice(0, 10) + 'T12:00:00');
      d.setDate(d.getDate() - 1);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    return `${dia(iso)} ${iso.slice(11, 16)}`;
  }

  abrirForm(): void {
    this.asesor.set(null);
    this.motivo.set('DESCANSO');
    this.desde.set(ahoraLocal());
    this.hasta.set('');
    this.comentario.set('');
    this.archivo.set(null);
    this.error.set('');
    this.formAbierto.set(true);
    setTimeout(() => document.getElementById('in-asesor')?.focus());
  }

  guardar(): void {
    const idUsuario = this.asesor();
    const desde = this.desde(), hasta = this.hasta();
    const error = !idUsuario ? 'Elige al asesor'
      : !desde || !hasta ? 'Pon la fecha y hora de inicio y de fin'
      : hasta <= desde ? 'El fin tiene que ser después del inicio'
      : this.motivo() === 'LICENCIA' && !this.archivo() ? 'La licencia necesita su sustento' : '';
    this.error.set(error);
    if (error || !idUsuario) {
      return;
    }
    this.guardando.set(true);
    this.servicio.inhabilitar({
      idUsuario, desde, hasta, comentario: this.comentario().trim() || null, archivo: this.archivo()
    }).subscribe({
      next: f => {
        this.guardando.set(false);
        this.formAbierto.set(false);
        this.toast.success(`${f.nombre} no podrá ingresar hasta el ${this.cuando(f, f.hasta, true)}`);
        this.cargar(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo inhabilitar');
      }
    });
  }

  abrirRevocar(f: Inhabilitacion): void {
    this.motivoRevocar.set('');
    this.error.set('');
    this.revocando.set(f);
    setTimeout(() => document.getElementById('in-motivo-revocar')?.focus());
  }

  confirmarRevocar(): void {
    const f = this.revocando();
    const motivo = this.motivoRevocar().trim();
    if (!f) {
      return;
    }
    if (!motivo) {
      this.error.set('Escribe el motivo: queda en la Auditoría');
      return;
    }
    this.guardando.set(true);
    this.servicio.revocarInhabilitacion(f.id, motivo).subscribe({
      next: () => {
        this.guardando.set(false);
        this.revocando.set(null);
        this.toast.success(`${f.nombre} ya puede ingresar`);
        this.cargar(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo revocar');
      }
    });
  }

  elegirSustento(f: Inhabilitacion, entrada: HTMLInputElement): void {
    this.paraSustento = f;
    entrada.value = '';
    entrada.click();
  }

  adjuntar(entrada: HTMLInputElement): void {
    const f = this.paraSustento;
    const archivo = entrada.files?.[0];
    if (!f || !archivo) {
      return;
    }
    this.guardando.set(true);
    this.servicio.adjuntarSustento(f.id, archivo).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success(`Sustento adjunto: ese tiempo de ${f.nombre} queda justificado`);
        this.cargar(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo adjuntar el sustento');
      }
    });
  }

  verSustento(f: Inhabilitacion): void {
    if (!f.idJustificacion) {
      return;
    }
    this.visor.abrir(this.servicio.certificado(f.idJustificacion, f.sustento), f.sustento,
      () => this.toast.error('No se pudo abrir el sustento'));
  }
}
