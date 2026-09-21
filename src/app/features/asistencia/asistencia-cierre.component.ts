import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { CierreSemana, Recuperacion } from './asistencia.models';
import { ESTILOS, duracionCorta, hoy, lunesDe, sumarDias, unidadDe } from './asistencia.estilos';

/**
 * Cierre semanal: congelar las cifras con las que se paga.
 *
 * Mientras la semana está abierta, el reporte se recalcula en cada consulta.
 * Una vez cerrada, no: lo guardado es lo que se pagó, y lo que se corrija
 * después sale como AJUSTE POSTERIOR en vez de reescribir el pasado.
 *
 * Cerrar también abre las recuperaciones de los días recuperables, para que
 * quien faltó devuelva las horas dentro del mes.
 */
@Component({
  selector: 'app-asistencia-cierre',
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
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Cierre semanal</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Abre el lunes y cierra el viernes a mediodía
          </p>
        </div>
        <div class="flex flex-wrap items-end gap-2.5">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="semana-cerrar">Semana</label>
            <input id="semana-cerrar" type="date" [class]="estilos.campo + ' w-[148px]'"
                   [(ngModel)]="semanaACerrar">
          </div>
          <button type="button" [class]="estilos.botonPrimario" (click)="cerrarSemana()"
                  [disabled]="guardando()">
            <lucide-angular name="lock" [size]="15" class="block"></lucide-angular>
            {{ guardando() ? 'Cerrando…' : 'Cerrar la semana' }}
          </button>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
    <div class="aparecer">

      <!-- Lo que bloquea el cierre, antes de la lista de lo ya cerrado -->
      <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div [class]="estilos.tarjeta">
          <div class="mb-2 flex items-center gap-2.5">
            <span [class]="estilos.icono">
              <lucide-angular name="calendar-days" [size]="15" class="block"></lucide-angular>
            </span>
            <h3 [class]="estilos.rotulo">Semana en curso</h3>
          </div>
          <div [class]="estilos.cifra + ' !text-xl'">{{ rangoSemana() }}</div>
          <p [class]="estilos.pie">Abierta desde el lunes</p>
        </div>

        <div [class]="estilos.tarjeta">
          <div class="mb-2 flex items-center gap-2.5">
            <span [class]="estilos.icono">
              <lucide-angular name="pencil" [size]="15" class="block"></lucide-angular>
            </span>
            <h3 [class]="estilos.rotulo">Días por completar</h3>
          </div>
          <div [class]="estilos.cifra">{{ incompletos() }}</div>
          <p [class]="estilos.pie">
            {{ incompletos() ? 'Bloquean el cierre' : 'Nada bloquea el cierre' }}
          </p>
        </div>

        <div [class]="estilos.tarjeta">
          <div class="mb-2 flex items-center gap-2.5">
            <span [class]="estilos.icono">
              <lucide-angular name="file-text" [size]="15" class="block"></lucide-angular>
            </span>
            <h3 [class]="estilos.rotulo">Justificaciones</h3>
          </div>
          <div [class]="estilos.cifra">{{ sinResolver() }}</div>
          <p [class]="estilos.pie">
            {{ sinResolver() ? 'Por resolver antes de cerrar' : 'Todas resueltas' }}
          </p>
        </div>

        <div [class]="estilos.tarjeta">
          <div class="mb-2 flex items-center gap-2.5">
            <span [class]="estilos.icono">
              <lucide-angular name="bell" [size]="15" class="block"></lucide-angular>
            </span>
            <h3 [class]="estilos.rotulo">Pierden bono</h3>
          </div>
          <div [class]="estilos.cifra">
            {{ pierdenBono() }}<small [class]="estilos.unidad">de {{ personas() }}</small>
          </div>
          <p [class]="estilos.pie">Se congela al cerrar</p>
        </div>
      </div>

      <h2 [class]="estilos.titulo">Semanas cerradas</h2>

      @if (error()) {
        <p class="mb-3 rounded-lg border border-[#f5c2c2] bg-[#fdecec] px-3.5 py-2.5 text-[12.5px] text-[#b91c1c] dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {{ error() }}
        </p>
      }

      @if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando cierres…</p>
      } @else {
        <div [class]="estilos.panel">
          <table class="w-full border-collapse">
            <caption class="sr-only">Semanas cerradas</caption>
            <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
              <tr>
                <th scope="col" [class]="estilos.th">Semana</th>
                <th scope="col" [class]="estilos.th">Ámbito</th>
                <th scope="col" [class]="estilos.th">Cerró</th>
                <th scope="col" [class]="estilos.th">Cuándo</th>
                <th scope="col" [class]="estilos.th">Personas</th>
                <th scope="col" [class]="estilos.th">Sin bono</th>
                <th scope="col" [class]="estilos.th">Ajustes posteriores</th>
                <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              @for (c of cierres(); track c.id) {
                <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#fafbfc] dark:border-slate-800 dark:hover:bg-slate-800/40"
                    [class]="c.ajustesPosteriores > 0 ? 'bg-[#fffdf5] dark:bg-amber-950/20' : ''">
                  <td [class]="estilos.td + ' font-semibold'">
                    {{ c.lunes | date: 'dd/MM' }} – {{ c.ultimoDia | date: 'dd/MM' }}
                  </td>
                  <td [class]="estilos.td">{{ c.subcartera ?? 'Toda la empresa' }}</td>
                  <td [class]="estilos.td">{{ c.cerradoPor ?? '—' }}</td>
                  <td [class]="estilos.td">{{ c.cerradoEn | date: 'dd/MM HH:mm' }}</td>
                  <td [class]="estilos.td">{{ c.personas }}</td>
                  <td [class]="estilos.td">
                    <span [class]="c.sinBono > 0 ? 'font-bold text-[#b91c1c] dark:text-red-300' : ''">
                      {{ c.sinBono }}
                    </span>
                  </td>
                  <td [class]="estilos.td">
                    @if (c.ajustesPosteriores > 0) {
                      <span class="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#92400e] dark:text-amber-300">
                        <lucide-angular name="alert-triangle" [size]="13" class="block"></lucide-angular>
                        {{ c.ajustesPosteriores }}
                      </span>
                    } @else {
                      <span class="text-[#8491a3] dark:text-slate-500">—</span>
                    }
                  </td>
                  <td [class]="estilos.td + ' text-right'">
                    <button type="button" [class]="estilos.botonIcono" (click)="abrir(c)"
                            [attr.aria-label]="'Ver el cierre del ' + c.lunes" title="Ver detalle">
                      <lucide-angular name="eye" [size]="13" class="block"></lucide-angular>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="px-3 py-14 text-center">
                    <strong class="block text-[13.5px]">Ninguna semana cerrada todavía</strong>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                      Elige una semana terminada y ciérrala para congelar sus cifras.
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Lo que se debe. Nace de aprobar una justificación recuperable: no hay
           que marcarlo, se calcula. -->
      <h2 [class]="estilos.titulo + ' !mt-6'">Horas por recuperar</h2>
      <div [class]="estilos.panel">
        <table class="w-full border-collapse">
          <caption class="sr-only">Recuperaciones pendientes</caption>
          <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
            <tr>
              <th scope="col" [class]="estilos.th">Persona</th>
              <th scope="col" [class]="estilos.th">Día no trabajado</th>
              <th scope="col" [class]="estilos.th">Debe</th>
              <th scope="col" [class]="estilos.th">Plazo</th>
              <th scope="col" [class]="estilos.th">Cómo se devuelve</th>
              <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            @for (r of recuperaciones(); track r.id) {
              <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800"
                  [class]="r.diasRestantes < 0 ? 'bg-[#fdecec] dark:bg-red-950/20' : ''">
                <td [class]="estilos.td + ' font-semibold'">
                  {{ r.nombreAgente }}
                  <span class="ml-1.5 text-[11.5px] font-normal text-[#5f6c80] dark:text-slate-400">
                    {{ r.subcartera }}
                  </span>
                </td>
                <td [class]="estilos.td">{{ r.fechaOrigen | date: 'dd/MM/yyyy' }}</td>
                <td [class]="estilos.td + ' font-bold'">{{ r.pendientes }}</td>
                <td [class]="estilos.td">
                  {{ r.fechaLimite | date: 'dd/MM' }}
                  <span class="ml-1 text-[11.5px]"
                        [class]="r.diasRestantes < 0
                          ? 'font-bold text-[#b91c1c] dark:text-red-300'
                          : 'text-[#5f6c80] dark:text-slate-400'">
                    {{ r.diasRestantes < 0 ? 'vencido' : 'quedan ' + r.diasRestantes + ' días' }}
                  </span>
                </td>
                <td [class]="estilos.td + ' !whitespace-normal'">
                  @if (r.minutosPorSemana) {
                    {{ r.minutosPorSemana }} min más por semana durante
                    {{ r.semanasRestantes }} {{ r.semanasRestantes === 1 ? 'semana' : 'semanas' }}
                  } @else {
                    —
                  }
                </td>
                <td [class]="estilos.td + ' text-right'">
                  <button type="button" [class]="estilos.botonIcono" (click)="abrirCierreDeuda(r)"
                          [attr.aria-label]="'Cerrar la recuperación de ' + r.nombreAgente"
                          title="Dar por cumplida o condonar">
                    <lucide-angular name="check" [size]="13" class="block"></lucide-angular>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-3 py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                  Nadie debe horas ahora mismo
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- Cerrar una deuda de horas -->
    @if (deuda(); as r) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarDeuda()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,460px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-deuda">
          <header class="border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <h2 id="titulo-deuda" class="!m-0 text-[15px] font-extrabold">
              {{ r.pendientes }} de {{ r.nombreAgente }}
            </h2>
            <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Del {{ r.fechaOrigen | date: 'dd/MM/yyyy' }}, con plazo al {{ r.fechaLimite | date: 'dd/MM' }}
            </p>
          </header>
          <div class="flex flex-col gap-3.5 px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="deuda-estado">Qué se hace</label>
              <select id="deuda-estado" [class]="estilos.campo" [(ngModel)]="estadoDeuda">
                <option value="CUMPLIDA">Dar por cumplida (ya devolvió las horas)</option>
                <option value="CONDONADA">Condonar (no las devuelve)</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="deuda-motivo">Motivo</label>
              <input id="deuda-motivo" type="text" [class]="estilos.campo"
                     placeholder="Queda registrado con la decisión" [(ngModel)]="motivoDeuda">
            </div>
            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarDeuda()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="confirmarDeuda()"
                    [disabled]="guardando()">
              <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
              Guardar
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- Detalle de un cierre -->
    @if (detalle(); as c) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarDetalle()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,860px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-cierre">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-cierre" class="!m-0 text-[15px] font-extrabold">
                Semana del {{ c.lunes | date: 'dd/MM' }} al {{ c.ultimoDia | date: 'dd/MM/yyyy' }}
              </h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ c.subcartera ?? 'Toda la empresa' }} · cerró {{ c.cerradoPor }}
                el {{ c.cerradoEn | date: 'dd/MM/yyyy HH:mm' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarDetalle()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex-1 overflow-auto">
            <table class="w-full border-collapse">
              <caption class="sr-only">Lo congelado de cada persona</caption>
              <thead class="sticky top-0 border-b border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th scope="col" [class]="estilos.th">Persona</th>
                  <th scope="col" [class]="estilos.th">Días</th>
                  <th scope="col" [class]="estilos.th">Tardanza</th>
                  <th scope="col" [class]="estilos.th">Trabajadas</th>
                  <th scope="col" [class]="estilos.th">Bono</th>
                  <th scope="col" [class]="estilos.th">Ajuste posterior</th>
                </tr>
              </thead>
              <tbody>
                @for (a of c.agentes ?? []; track a.idUsuario) {
                  <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800">
                    <td [class]="estilos.td + ' font-semibold'">{{ a.nombreAgente }}</td>
                    <td [class]="estilos.td">
                      {{ a.diasTrabajados }}
                      @if (a.diasFalta) {
                        <span class="ml-1 text-[11.5px] text-[#b91c1c]">· {{ a.diasFalta }} faltas</span>
                      }
                    </td>
                    <td [class]="estilos.td">{{ a.tardanza }}</td>
                    <td [class]="estilos.td">
                      {{ a.horasTrabajadas }}
                      <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">de {{ a.jornada }}</span>
                    </td>
                    <td [class]="estilos.td">
                      <span class="inline-flex items-center gap-1.5 text-[11.5px] font-bold"
                            [class]="a.pierdeBono ? 'text-[#b91c1c] dark:text-red-300' : 'text-[#166534] dark:text-green-300'"
                            [title]="a.motivoBono ?? ''">
                        <span class="h-2 w-2 rounded-full"
                              [class]="a.pierdeBono ? 'bg-[#dc2626]' : 'bg-[#16a34a]'"></span>
                        {{ a.pierdeBono ? 'Lo pierde' : 'Lo mantiene' }}
                      </span>
                    </td>
                    <td [class]="estilos.td">
                      @if (a.ajusteTardanzaMin || a.ajusteTrabajadasMin) {
                        <span class="text-[11.5px] font-bold text-[#92400e] dark:text-amber-300">
                          {{ textoAjuste(a.ajusteTardanzaMin, a.ajusteTrabajadasMin) }}
                        </span>
                      } @else {
                        <span class="text-[#8491a3] dark:text-slate-500">—</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <footer class="flex items-center justify-between gap-3 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              Reabrir descongela estas cifras y vuelven a calcularse solas.
            </span>
            <div class="flex gap-2">
              <button type="button" [class]="estilos.botonSecundario" (click)="reabrir(c)"
                      [disabled]="guardando()">
                <lucide-angular name="unlock" [size]="15" class="block"></lucide-angular>
                Reabrir
              </button>
              <button type="button" [class]="estilos.botonPrimario" (click)="cerrarDetalle()">Listo</button>
            </div>
          </footer>
        </div>
      </div>
    }
  `
})
export class AsistenciaCierreComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly duracionCorta = duracionCorta;
  protected readonly unidadDe = unidadDe;

  readonly idSubcartera = input<number | null>(null);

  readonly cierres = signal<CierreSemana[]>([]);
  readonly recuperaciones = signal<Recuperacion[]>([]);
  readonly deuda = signal<Recuperacion | null>(null);
  estadoDeuda: 'CUMPLIDA' | 'CONDONADA' = 'CUMPLIDA';
  motivoDeuda = '';
  readonly detalle = signal<CierreSemana | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');

  /** Por defecto, la semana pasada: la que ya terminó y toca cerrar. */
  semanaACerrar = sumarDias(lunesDe(new Date()), -7);

  /** Lo que bloquea el cierre de la semana en curso. */
  readonly incompletos = signal(0);
  readonly sinResolver = signal(0);
  readonly pierdenBono = signal(0);
  readonly personas = signal(0);

  readonly rangoSemana = computed(() => {
    const lunes = lunesDe(new Date());
    return `${this.corta(lunes)} – ${this.corta(sumarDias(lunes, 5))}`;
  });

  constructor() {
    this.cargar();
    // El estado de la semana viva sale del mismo dashboard que ya lo calcula,
    // para que las cifras no se contradigan entre pantallas.
    effect(() => {
      const ambito = this.idSubcartera();
      if (!ambito) {
        this.incompletos.set(0);
        this.pierdenBono.set(0);
        this.personas.set(0);
        return;
      }
      const lunes = lunesDe(new Date());
      this.servicio.dashboard(lunes, hoy(), ambito).subscribe({
        next: d => {
          this.incompletos.set(d.diasIncompletos);
          this.pierdenBono.set(d.pierdenBono);
          this.personas.set(d.personas);
        },
        error: () => { /* las tarjetas quedan en cero; la lista sigue sirviendo */ }
      });
      this.servicio.justificaciones(lunes, hoy(), ['PENDIENTE', 'REVISADA']).subscribe({
        next: j => this.sinResolver.set(j.length),
        error: () => this.sinResolver.set(0)
      });
    });
  }

  private corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  cargar(): void {
    this.cargando.set(true);
    this.servicio.cierres().subscribe({
      next: c => {
        this.cierres.set(c);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudieron cargar los cierres');
        this.cargando.set(false);
      }
    });
    this.servicio.recuperaciones().subscribe({
      next: r => this.recuperaciones.set(r),
      error: () => this.toast.error('No se pudieron cargar las recuperaciones')
    });
  }

  // ==================== DEUDAS DE HORAS ====================

  abrirCierreDeuda(r: Recuperacion): void {
    this.deuda.set(r);
    this.estadoDeuda = 'CUMPLIDA';
    this.motivoDeuda = '';
    this.error.set('');
  }

  cerrarDeuda(): void {
    this.deuda.set(null);
  }

  confirmarDeuda(): void {
    const r = this.deuda();
    if (!r) {
      return;
    }
    if (!this.motivoDeuda.trim()) {
      this.error.set('Di por qué se cierra');
      return;
    }

    this.guardando.set(true);
    this.servicio.cerrarRecuperacion(r.id, this.estadoDeuda, this.motivoDeuda.trim()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarDeuda();
        this.toast.success('Recuperación cerrada');
        this.cargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo cerrar');
      }
    });
  }

  cerrarSemana(): void {
    this.error.set('');
    this.guardando.set(true);
    this.servicio.cerrarSemana(this.semanaACerrar, this.idSubcartera()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success('Semana cerrada');
        this.cargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo cerrar la semana');
      }
    });
  }

  abrir(c: CierreSemana): void {
    this.servicio.cierre(c.id).subscribe({
      next: completo => this.detalle.set(completo),
      error: () => this.toast.error('No se pudo abrir el cierre')
    });
  }

  cerrarDetalle(): void {
    this.detalle.set(null);
  }

  reabrir(c: CierreSemana): void {
    this.guardando.set(true);
    this.servicio.reabrirSemana(c.id).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarDetalle();
        this.toast.success('Semana reabierta');
        this.cargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo reabrir');
      }
    });
  }

  /** El ajuste, dicho en lo que cambió y hacia dónde. */
  textoAjuste(tardanza: number, trabajadas: number): string {
    const partes: string[] = [];
    if (tardanza) {
      partes.push(`${tardanza > 0 ? '+' : ''}${tardanza} min de tardanza`);
    }
    if (trabajadas) {
      partes.push(`${trabajadas > 0 ? '+' : ''}${trabajadas} min trabajados`);
    }
    return partes.join(', ');
  }
}
