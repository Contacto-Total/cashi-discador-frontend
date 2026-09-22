import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { CierreSemana, ExcepcionDeHorario, Justificacion, ProximaSemana, Recuperacion } from './asistencia.models';
import {
  DIAS_DE_RECUPERACION, ESTILOS, duracionCorta, hoy, lunesDe, sumarDias, textoDias, unidadDe
} from './asistencia.estilos';

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
            Se cierra el lunes siguiente; hasta entonces entran justificaciones y correcciones
          </p>
        </div>
        <!-- La semana es la del rango de arriba, como en el resto del módulo. -->
        <button type="button" [class]="estilos.botonPrimario" (click)="cerrarSemana()"
                [disabled]="guardando() || !!bloqueo()" [title]="bloqueo() ?? ''">
          <lucide-angular name="lock" [size]="15" class="block"></lucide-angular>
          {{ guardando() ? 'Cerrando…' : 'Cerrar la semana' }}
        </button>
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
            <h3 [class]="estilos.rotulo">{{ estadoSemana().titulo }}</h3>
          </div>
          <div [class]="estilos.cifra + ' !text-xl'">{{ rangoSemana() }}</div>
          <p [class]="estilos.pie">{{ estadoSemana().pie }}</p>
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
            <h3 [class]="estilos.rotulo">Límite excedido</h3>
          </div>
          <div [class]="estilos.cifra">
            {{ pierdenBono() }}<small [class]="estilos.unidad">de {{ personas() }}</small>
          </div>
          <p [class]="estilos.pie">Se congela al cerrar</p>
        </div>
      </div>

      <!-- Horario de la próxima semana: el del equipo y, encima, quien recupera horas -->
      @if (idSubcartera()) {
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 [class]="estilos.titulo + ' !mb-0'">Horario de la próxima semana</h2>
            <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subProxima() }}</p>
          </div>
          <button type="button" [class]="estilos.botonPrimario" (click)="compartir()"
                  [disabled]="guardando() || !proxima() || !!proxima()?.compartidoEn">
            <lucide-angular name="send" [size]="15" class="block"></lucide-angular>
            {{ proxima()?.compartidoEn ? 'Compartido con el equipo' : 'Compartir con el equipo' }}
          </button>
        </div>

        <div class="mb-6 grid gap-4 min-[640px]:grid-cols-[minmax(0,35fr)_minmax(0,65fr)]">
          <div [class]="estilos.panel">
            <table class="w-full border-collapse">
              <caption class="sr-only">Horario del equipo para la próxima semana</caption>
              <thead>
                <tr>
                  <th scope="col" [class]="estilos.th">Día</th>
                  <th scope="col" [class]="estilos.th">Entrada</th>
                  <th scope="col" [class]="estilos.th">Salida</th>
                </tr>
              </thead>
              <tbody>
                @for (d of proxima()?.dias ?? []; track d.diaSemana) {
                  <tr>
                    <td [class]="estilos.td + ' font-bold'">{{ d.nombre }}</td>
                    <td [class]="estilos.td">{{ d.entrada.slice(0, 5) }}</td>
                    <td [class]="estilos.td">{{ d.salida.slice(0, 5) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">Excepciones de esta semana</h2>
            <p class="!mb-3 mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              Quien deba horas sale más tarde. El sistema lo calcula y Emily lo ajusta si lo acordó de otra forma.
            </p>
            <ul class="!m-0 !list-none !p-0">
              @for (e of proxima()?.excepciones ?? []; track e.idRecuperacion) {
                <li class="flex items-center gap-3 border-b border-[#f1f3f6] py-2.5 last:border-0 dark:border-slate-800">
                  <div class="min-w-0 flex-1">
                    <strong class="block text-[13px]">{{ e.nombre }}</strong>
                    <span class="block text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                      @if (e.minutosExtra > 0) {
                        {{ textoDias(e.dias) }} hasta las {{ salidaCon(e) }} · +{{ e.minutosExtra }} min · {{ e.motivo }}
                      } @else {
                        Sin horario extendido · {{ e.motivo }}
                      }
                    </span>
                  </div>
                  <button type="button" [class]="estilos.botonChico" (click)="abrirAjuste(e.idRecuperacion)">Ajustar</button>
                </li>
              } @empty {
                <li class="py-2.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400">Ninguna: todos con el horario del equipo</li>
              }
            </ul>
          </div>
        </div>
      }

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
                <th scope="col" [class]="estilos.th">Cerrado por</th>
                <th scope="col" [class]="estilos.th">Cuándo</th>
                <th scope="col" [class]="estilos.th">Personas</th>
                <th scope="col" [class]="estilos.th">Límite excedido</th>
                <th scope="col" [class]="estilos.th">Ajustes posteriores</th>
                <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              @for (c of cierresDelAmbito(); track c.id) {
                <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#f4f6f9] dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td [class]="estilos.td">
                    <strong>{{ c.lunes | date: 'dd/MM' }} – {{ c.ultimoDia | date: 'dd/MM' }}</strong>
                    <!-- Sin ámbito elegido se mezclan subcarteras: se dice de cuál es. -->
                    @if (!idSubcartera()) {
                      <span class="ml-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ c.subcartera ?? 'Toda la empresa' }}</span>
                    }
                  </td>
                  <td [class]="estilos.td">{{ c.cerradoPor ?? '—' }}</td>
                  <td [class]="estilos.td + ' secundario'">{{ c.cerradoEn | date: 'dd/MM HH:mm' }}</td>
                  <td [class]="estilos.td">{{ c.personas }}</td>
                  <td [class]="estilos.td + ' peligro'">{{ c.sinBono }}</td>
                  <td [class]="estilos.td">
                    @if (c.ajustesPosteriores > 0) {
                      <span class="inline-flex items-center rounded-full bg-[#fef6e0] px-[9px] py-0.5 text-[11.5px] font-bold text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300">
                        {{ c.ajustesPosteriores }} {{ c.ajustesPosteriores === 1 ? 'ajuste' : 'ajustes' }}
                      </span>
                    } @else {
                      <span class="text-[#8491a3] dark:text-slate-500">—</span>
                    }
                  </td>
                  <td [class]="estilos.td + ' text-right'">
                    <button type="button" [class]="estilos.botonChico" (click)="abrir(c)"
                            [attr.aria-label]="'Ver el cierre de la semana del ' + (c.lunes | date: 'dd/MM')">
                      <lucide-angular name="eye" [size]="13" class="block"></lucide-angular>
                      Ver
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="!px-3 !py-14 text-center">
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
                  <button type="button" [class]="estilos.botonChico" (click)="abrirAjuste(r.id)"
                          [attr.aria-label]="'Ajustar el horario de ' + r.nombreAgente">
                    <lucide-angular name="clock" [size]="13" class="block"></lucide-angular>
                    Ajustar horario
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="secundario !px-3 !py-10 text-center !text-[12.5px]">
                  Nadie debe horas ahora mismo
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- Ajustar la recuperación: los días y los minutos con que devuelve horas -->
    @if (ajuste(); as a) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="ajuste.set(null)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex w-[min(100%,420px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-ajuste">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-ajuste" class="!m-0 text-[15px] font-extrabold">Ajustar la recuperación</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ a.nombre }} · {{ a.motivo }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="ajuste.set(null)" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>
          <div class="flex flex-col gap-3.5 px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="a-dias">Días</label>
              <select id="a-dias" [class]="estilos.campo" [(ngModel)]="ajusteDias">
                @for (o of DIAS_DE_RECUPERACION; track o.texto) {
                  <option [ngValue]="o.texto">{{ o.texto }}</option>
                }
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="a-extra">Minutos extra por día</label>
              <input id="a-extra" type="number" min="0" max="60" step="5" [class]="estilos.campo"
                     [(ngModel)]="ajusteMinutos">
            </div>
            <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              Lo acordado con el asesor manda: esto es lo que verá en Mi Asistencia.
            </p>
            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
            }
          </div>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="ajuste.set(null)">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarAjuste()" [disabled]="guardando()">
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
                  <th scope="col" [class]="estilos.th">Límite de tardanza</th>
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
                            [class]="a.pierdeBono ? 'text-[#b91c1c] dark:text-red-300' : 'text-[#166534] dark:text-green-300'">
                        <span class="h-2 w-2 rounded-full"
                              [class]="a.pierdeBono ? 'bg-[#dc2626]' : 'bg-[#16a34a]'"></span>
                        {{ a.pierdeBono ? (a.motivoBono ?? 'Excedido') : 'Dentro del límite' }}
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
              <button type="button" [class]="estilos.botonPrimario" (click)="descargarSemana(c)">
                <lucide-angular name="download" [size]="15" class="block"></lucide-angular>
                Descargar el Excel de esa semana
              </button>
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
  /** El rango del módulo: la semana que se mira y la que se cierra. */
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  readonly cierres = signal<CierreSemana[]>([]);
  readonly recuperaciones = signal<Recuperacion[]>([]);
  readonly detalle = signal<CierreSemana | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');

  /** Lo que bloquea el cierre de la semana del rango. */
  readonly incompletos = signal(0);
  readonly pierdenBono = signal(0);
  readonly personas = signal(0);
  private readonly gente = signal<Set<number>>(new Set());
  private readonly justificacionesAbiertas = signal<Justificacion[]>([]);
  /** Las que esperan a alguien, de la gente del ámbito. */
  readonly sinResolver = computed(() =>
    this.justificacionesAbiertas().filter(j => this.gente().has(j.idUsuario)).length);

  /** Lunes y sábado de la semana del rango. */
  readonly lunes = computed(() => lunesDe(new Date(this.desde() + 'T00:00:00')));
  readonly sabado = computed(() => sumarDias(this.lunes(), 5));

  readonly rangoSemana = computed(() => `${this.corta(this.lunes())} – ${this.corta(this.sabado())}`);

  /** Solo los cierres del ámbito elegido; sin ámbito, todos. */
  readonly cierresDelAmbito = computed(() => {
    const ambito = this.idSubcartera();
    return ambito ? this.cierres().filter(c => c.idSubcartera === ambito) : this.cierres();
  });

  /** El cierre de la semana del rango, si ya se hizo. */
  private readonly cierreDeLaSemana = computed(() =>
    this.cierres().find(c => c.lunes === this.lunes()
      && (c.idSubcartera ?? null) === (this.idSubcartera() ?? null)) ?? null);

  /** Se cierra desde el lunes siguiente: el fin de semana la semana que terminó todavía recibe cambios. */
  private readonly terminada = computed(() => hoy() >= sumarDias(this.lunes(), 7));

  /** El título y el pie de la primera tarjeta, según en qué punto está la semana. */
  readonly estadoSemana = computed(() => {
    const cierre = this.cierreDeLaSemana();
    if (cierre) {
      const cuando = cierre.cerradoEn ? ` el ${this.corta(cierre.cerradoEn.slice(0, 10))}` : '';
      return { titulo: 'Semana cerrada', pie: `Cerrada por ${cierre.cerradoPor ?? 'RR.HH.'}${cuando}` };
    }
    return this.terminada()
      ? { titulo: 'Semana por cerrar', pie: 'Ya se puede cerrar' }
      : { titulo: 'Semana en curso', pie: 'Abierta desde el lunes' };
  });

  /** Por qué no se puede cerrar todavía; null si se puede. */
  readonly bloqueo = computed(() => {
    if (this.cierreDeLaSemana()) {
      return 'Esta semana ya está cerrada';
    }
    if (!this.terminada()) {
      return 'Esta semana se cierra desde el lunes siguiente';
    }
    // Con algo pendiente no se cierra: la semana quedaría con datos a medias.
    if (this.incompletos() || this.sinResolver()) {
      return 'Faltan marcas por completar o justificaciones por resolver';
    }
    return null;
  });

  constructor() {
    this.cargar();
    // El estado de la semana sale del mismo dashboard que ya lo calcula, para
    // que las cifras no se contradigan entre pantallas.
    effect(() => {
      const ambito = this.idSubcartera();
      const lunes = this.lunes();
      const sabado = this.sabado();
      this.cargarProxima();
      if (!ambito) {
        this.incompletos.set(0);
        this.pierdenBono.set(0);
        this.personas.set(0);
        this.gente.set(new Set());
        return;
      }
      this.servicio.dashboard(lunes, sabado, ambito).subscribe({
        next: d => {
          this.incompletos.set(d.diasPorCompletar);
          this.pierdenBono.set(d.pierdenBono);
          this.personas.set(d.personas);
          this.gente.set(new Set(d.agentes.map(a => a.idUsuario)));
        },
        error: () => { /* las tarjetas quedan en cero; la lista sigue sirviendo */ }
      });
      this.servicio.justificaciones(lunes, sabado, ['PENDIENTE', 'REVISADA']).subscribe({
        next: j => this.justificacionesAbiertas.set(j),
        error: () => this.justificacionesAbiertas.set([])
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

  // ==================== HORARIO DE LA PRÓXIMA SEMANA ====================

  readonly proxima = signal<ProximaSemana | null>(null);
  readonly ajuste = signal<ExcepcionDeHorario | null>(null);
  ajusteDias = DIAS_DE_RECUPERACION[0].texto;
  ajusteMinutos = 0;
  protected readonly DIAS_DE_RECUPERACION = DIAS_DE_RECUPERACION;
  protected readonly textoDias = textoDias;

  readonly subProxima = computed(() => {
    const p = this.proxima();
    if (!p) {
      return '';
    }
    const corta = (f: string) => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
    const cuando = p.compartidoEn ? ` · compartido el ${corta(p.compartidoEn.slice(0, 10))}` : '';
    return `Semana del ${corta(p.lunes)} al ${corta(p.sabado)}${cuando}`;
  });

  private cargarProxima(): void {
    const sub = this.idSubcartera();
    if (!sub) {
      this.proxima.set(null);
      return;
    }
    this.servicio.proximaSemana(sub).subscribe({
      next: p => this.proxima.set(p),
      error: () => this.proxima.set(null)
    });
  }

  /** La hora de salida del equipo ese día más lo que se queda la persona. */
  salidaCon(e: ExcepcionDeHorario): string {
    const dia = this.proxima()?.dias.find(d => e.dias.includes(d.diaSemana));
    if (!dia) {
      return '—';
    }
    const [h, m] = dia.salida.split(':').map(Number);
    const total = h * 60 + m + e.minutosExtra;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }

  /**
   * Abre el ajuste con lo que hay: lo guardado, o lo que propone el sistema. Si
   * la persona no está en la semana cargada (otra subcartera), se propone aquí
   * con la misma cuenta: lo que debe por semana repartido de martes a viernes.
   */
  abrirAjuste(idRecuperacion: number): void {
    let e = this.proxima()?.excepciones.find(x => x.idRecuperacion === idRecuperacion) ?? null;
    if (!e) {
      const r = this.recuperaciones().find(x => x.id === idRecuperacion);
      if (!r) {
        return;
      }
      const porDia = Math.min(60, Math.ceil((r.minutosPorSemana || 0) / 4 / 5) * 5);
      e = { idRecuperacion: r.id, idUsuario: r.idUsuario, nombre: r.nombreAgente ?? '', dias: [2, 3, 4, 5],
            minutosExtra: porDia, guardada: false, motivo: `Recupera ${r.pendientes}`, pendientes: r.pendientes };
    }
    const actual = e.dias.join(',');
    this.ajusteDias = DIAS_DE_RECUPERACION.find(o => o.dias.join(',') === actual)?.texto
      ?? DIAS_DE_RECUPERACION[0].texto;
    this.ajusteMinutos = e.minutosExtra;
    this.error.set('');
    this.ajuste.set(e);
  }

  guardarAjuste(): void {
    const a = this.ajuste();
    if (!a) {
      return;
    }
    const minutos = Number(this.ajusteMinutos);
    if (!Number.isFinite(minutos) || minutos < 0 || minutos > 60) {
      this.error.set('Entre 0 y 60 minutos por día');
      return;
    }
    const dias = DIAS_DE_RECUPERACION.find(o => o.texto === this.ajusteDias)?.dias ?? [2, 3, 4, 5];
    this.guardando.set(true);
    this.servicio.ajustarRecuperacion(a.idRecuperacion, dias, minutos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.ajuste.set(null);
        this.toast.success(minutos ? 'Horario de la próxima semana ajustado' : 'Sin horario extendido esa semana');
        this.cargarProxima();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo guardar el ajuste');
      }
    });
  }

  /** Se comparte una vez por subcartera: lo propuesto que nadie tocó se guarda tal cual. */
  compartir(): void {
    const sub = this.idSubcartera();
    if (!sub) {
      return;
    }
    this.guardando.set(true);
    this.servicio.compartirSemana(sub).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success('Horario compartido: los asesores ya lo ven en Mi Asistencia');
        this.cargarProxima();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo compartir el horario');
      }
    });
  }

  cerrarSemana(): void {
    this.error.set('');
    this.guardando.set(true);
    this.servicio.cerrarSemana(this.lunes(), this.idSubcartera()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success('Semana cerrada');
        this.cargar();
        this.cargarProxima();
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

  /**
   * El Excel de una semana cerrada. Lo arma el backend con el mismo formato de
   * la hoja que RR.HH. ya lee; aquí solo se pide con las fechas del cierre.
   */
  descargarSemana(c: CierreSemana): void {
    this.servicio.excel(c.lunes, c.ultimoDia, c.idSubcartera).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `Asistencia_${c.lunes}_${c.ultimoDia}.xlsx`;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('No se pudo generar el Excel')
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
