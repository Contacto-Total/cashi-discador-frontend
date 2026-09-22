import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaReporte, Justificacion, PerfilAsistencia, TipoDia } from './asistencia.models';
import {
  ESTILOS, TIPOS_DE_CALENDARIO, avisoAnticipacion, fechaTexto, hoy, lunesDe, primerDiaPermitido, sumarDias
} from './asistencia.estilos';

type TipoAlerta = 'MARCA' | 'PAUSA' | 'TARDANZA';

interface Alerta {
  idUsuario: number;
  nombre: string;
  /** Para ordenar: la fecha del día, o la del sábado para la alerta de la semana. */
  orden: string;
  dia: string;
  tipo: TipoAlerta;
  alerta: string;
  detalle: string;
}

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Las marcas faltantes y excesos: rojo lo que no se registró, ámbar lo que se pasó. */
const PASTILLA_ALERTA: Record<TipoAlerta, string> = {
  MARCA: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300',
  PAUSA: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300',
  TARDANZA: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300'
};

/**
 * Asistencia del Equipo: la vista de la supervisora.
 *
 * Solo lo que necesita para gestionar a su gente: las alertas para el llamado
 * de atención —marcas sin registrar, pausas más largas de lo permitido y
 * límites de tardanza excedidos— y las justificaciones que esperan su revisión.
 * Corregir, aprobar y cerrar la semana es de RR.HH., en Control de Asistencia.
 *
 * Las alertas no tienen tabla propia: salen del mismo reporte que ve RR.HH.,
 * así una y otra nunca cuentan cosas distintas.
 */
@Component({
  selector: 'app-asistencia-equipo',
  standalone: true,
  host: { class: 'cashi-asistencia' },
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    .ficha { display: grid; grid-template-columns: 118px 1fr; gap: 9px 14px; margin: 0; font-size: 13px }
    .ficha dt { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80; padding-top: 2px }
    .ficha dd { margin: 0 }
    :host-context(.dark) .ficha dt { color: #94a3b8 }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Asistencia del Equipo</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ resumen() }}</p>
        </div>
        <button type="button" [class]="estilos.botonPrimario" (click)="abrirRegistro()" [disabled]="!gente().length">
          <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
          Registrar justificación
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-cliente">Cliente</label>
          <select id="eq-cliente" [class]="estilos.campo + ' w-[178px]'"
                  [ngModel]="idCliente()" (ngModelChange)="elegirCliente($event)">
            <option [ngValue]="null">Elige uno</option>
            @for (c of clientes(); track c.id) {
              <option [ngValue]="c.id">{{ c.businessName || c.tenantName }}</option>
            }
          </select>
        </div>
        <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-cartera">Cartera</label>
          <select id="eq-cartera" [class]="estilos.campo + ' w-[178px]'"
                  [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)" [disabled]="!idCliente()">
            <option [ngValue]="null">Elige una</option>
            @for (c of carteras(); track c.id) {
              <option [ngValue]="c.id">{{ c.portfolioName }}</option>
            }
          </select>
        </div>
        <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-subcartera">Subcartera</label>
          <select id="eq-subcartera" [class]="estilos.campo + ' w-[178px]'"
                  [ngModel]="idSubcartera()" (ngModelChange)="cambiarSubcartera($event)" [disabled]="!idCartera()">
            <option [ngValue]="null">Elige una</option>
            @for (s of subcarteras(); track s.id) {
              <option [ngValue]="s.id">{{ s.subPortfolioName }}</option>
            }
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-semana-antes">Semana</label>
          <div class="flex h-[38px] items-center gap-2" role="group" aria-label="Semana">
            <button type="button" id="eq-semana-antes" [class]="estilos.botonIcono" (click)="moverSemana(-1)"
                    aria-label="Semana anterior">
              <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
            </button>
            <strong class="min-w-[150px] text-center text-[13px] tabular-nums">{{ textoSemana() }}</strong>
            <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(1)"
                    [disabled]="esSemanaActual()" aria-label="Semana siguiente">
              <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
      @if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando tu equipo…</p>
      } @else if (sinAsignar()) {
        <div [class]="estilos.vacio">
          <strong class="block text-[13.5px]">No tienes subcarteras asignadas</strong>
          <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Esta vista muestra a los asesores de las subcarteras que supervisas.
          </span>
        </div>
      } @else if (!idSubcartera()) {
        <div [class]="estilos.vacio">
          <strong class="block text-[13.5px]">Elige una subcartera</strong>
          <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Las alertas y las justificaciones son de los asesores de esa subcartera.
          </span>
        </div>
      } @else {
        <div class="aparecer">
          <!-- Resumen de la semana -->
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (k of kpis(); track k.titulo) {
              <div [class]="estilos.tarjeta + ' !px-4 !py-3.5'">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular [name]="k.icono" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">{{ k.titulo }}</h3>
                </div>
                <div [class]="estilos.cifra">
                  {{ k.cifra }}
                  @if (k.de !== null) {
                    <small [class]="estilos.unidad">de {{ k.de }}</small>
                  }
                </div>
                <p [class]="estilos.pie">{{ k.pie }}</p>
              </div>
            }
          </div>

          <!-- Alertas para llamado de atención -->
          <section class="mt-6" aria-labelledby="titulo-alertas">
            <div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
              <div>
                <h2 id="titulo-alertas" [class]="estilos.titulo + ' !mb-0'">Alertas para llamado de atención</h2>
                <p class="mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  Marcas sin registrar, pausas más largas de lo permitido y límites de tardanza excedidos
                </p>
              </div>
              <nav [class]="estilos.segmentos" aria-label="Filtrar alertas">
                @for (f of FILTROS; track f.clave) {
                  <button type="button"
                          [class]="estilos.tab + ' ' + (filtro() === f.clave ? estilos.tabActiva : estilos.tabApagada)"
                          [attr.aria-current]="filtro() === f.clave ? 'page' : null"
                          (click)="filtro.set(f.clave)">
                    {{ f.texto }}
                  </button>
                }
              </nav>
            </div>
            <div [class]="estilos.panel">
              <table class="w-full border-collapse">
                <caption class="sr-only">Alertas de la semana, por asesor</caption>
                <thead>
                  <tr>
                    <th scope="col" [class]="estilos.th">Asesor</th>
                    <th scope="col" [class]="estilos.th">Día</th>
                    <th scope="col" [class]="estilos.th">Alerta</th>
                    <th scope="col" [class]="estilos.th">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  @for (a of alertasVisibles(); track $index) {
                    <tr>
                      <td [class]="estilos.td + ' max-w-[200px] truncate font-semibold'">{{ a.nombre }}</td>
                      <td [class]="estilos.td">{{ a.dia }}</td>
                      <td [class]="estilos.td">
                        <span class="inline-flex items-center rounded-full px-[9px] py-0.5 text-[11.5px] font-bold"
                              [class]="PASTILLA_ALERTA[a.tipo]">{{ a.alerta }}</span>
                      </td>
                      <td [class]="estilos.td + ' secundario'">{{ a.detalle }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="!px-3 !py-10 text-center">
                        <strong class="block text-[13.5px]">Sin alertas</strong>
                        <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                          Nadie de tu equipo tiene alertas de este tipo en la semana.
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <!-- Justificaciones por revisar -->
          <section class="mt-6" aria-labelledby="titulo-just">
            <div class="mb-3">
              <h2 id="titulo-just" [class]="estilos.titulo + ' !mb-0'">Justificaciones por revisar</h2>
              <p class="mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                Confirma que la ausencia ocurrió; la aprobación es de RR.HH.
              </p>
            </div>
            <div [class]="estilos.panel">
              <table class="w-full border-collapse">
                <caption class="sr-only">Solicitudes que esperan tu revisión</caption>
                <thead>
                  <tr>
                    <th scope="col" [class]="estilos.th">Solicitada</th>
                    <th scope="col" [class]="estilos.th">Asesor</th>
                    <th scope="col" [class]="estilos.th">Tipo</th>
                    <th scope="col" [class]="estilos.th">Días</th>
                    <th scope="col" [class]="estilos.th">Adjunto</th>
                    <th scope="col" [class]="estilos.th"><span class="sr-only">Acción</span></th>
                  </tr>
                </thead>
                <tbody>
                  @for (j of porRevisar(); track j.id) {
                    <tr>
                      <td [class]="estilos.td + ' secundario'">{{ j.solicitadaEn | date: 'dd/MM HH:mm' }}</td>
                      <td [class]="estilos.td + ' max-w-[200px] truncate font-semibold'">{{ j.nombreAgente }}</td>
                      <td [class]="estilos.td">{{ j.tipo }}</td>
                      <td [class]="estilos.td">{{ diasDe(j) }}</td>
                      <td [class]="estilos.td">
                        @if (j.tieneArchivo) {
                          <button type="button" [class]="estilos.botonChico" (click)="verCertificado(j)">
                            {{ j.archivoNombre ?? 'Ver adjunto' }}
                          </button>
                        } @else {
                          <span class="text-[#8491a3] dark:text-slate-500">—</span>
                        }
                      </td>
                      <td [class]="estilos.td + ' text-right'">
                        <button type="button" [class]="estilos.botonChico" (click)="abrirRevision(j)">Revisar</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="!px-3 !py-10 text-center">
                        <strong class="block text-[13.5px]">Nada por revisar</strong>
                        <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                          Las solicitudes nuevas de tu equipo aparecen aquí.
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        </div>
      }
    </div>

    <!-- Revisar justificación -->
    @if (enRevision(); as j) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarRevision()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,540px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-revisar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-revisar" class="!m-0 text-[15px] font-extrabold">Revisar justificación</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ j.nombreAgente }} · solicitada el {{ j.solicitadaEn | date: 'dd/MM HH:mm' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarRevision()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <dl class="ficha">
              <dt>Tipo</dt><dd>{{ j.tipo }}</dd>
              <dt>Días</dt><dd>{{ diasDe(j) }}</dd>
              <dt>Comentario</dt><dd>{{ j.comentario || '—' }}</dd>
              <dt>Adjunto</dt>
              <dd>
                @if (j.tieneArchivo) {
                  <button type="button" [class]="estilos.botonChico" (click)="verCertificado(j)">
                    {{ j.archivoNombre ?? 'Ver adjunto' }}
                  </button>
                } @else {
                  Este tipo no lo exige
                }
              </dd>
            </dl>

            @if (rechazando()) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-motivo">Por qué se rechaza</label>
                <textarea id="eq-motivo" rows="3" [class]="estilos.area" placeholder="Ej.: no avisó y no trajo constancia"
                          [ngModel]="motivo()" (ngModelChange)="motivo.set($event); faltaMotivo.set(false)"></textarea>
                @if (faltaMotivo()) {
                  <p class="!m-0 text-xs text-[#b91c1c] dark:text-red-300">Escribe el motivo: es lo que verá el asesor.</p>
                }
              </div>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario + ' mr-auto'" (click)="rechazar(j)"
                    [disabled]="guardando()">
              {{ rechazando() ? 'Confirmar rechazo' : 'Rechazar' }}
            </button>
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarRevision()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="conforme(j)" [disabled]="guardando()">
              Conforme, enviar a RR.HH.
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- Registrar justificación -->
    @if (registrando()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="registrando.set(false)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,480px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-registrar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-registrar" class="!m-0 text-[15px] font-extrabold">Registrar justificación</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Para un asesor que no puede registrarla él mismo
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="registrando.set(false)" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-quien">Para quién</label>
              <select id="eq-quien" [class]="estilos.campo" [(ngModel)]="nueva.idUsuario">
                @for (p of gente(); track p.idUsuario) {
                  <option [ngValue]="p.idUsuario">{{ p.nombreAgente }}</option>
                }
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-tipo">Tipo</label>
              <select id="eq-tipo" [class]="estilos.campo" [(ngModel)]="nueva.idTipoDia">
                @for (t of tipos(); track t.id) {
                  <option [ngValue]="t.id">{{ t.nombre }}</option>
                }
              </select>
            </div>
            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-desde">Desde</label>
                <input id="eq-desde" type="date" [class]="estilos.campo" [attr.min]="primerDia()"
                       [(ngModel)]="nueva.fechaDesde">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-hasta">Hasta</label>
                <input id="eq-hasta" type="date" [class]="estilos.campo" [min]="nueva.fechaDesde"
                       [(ngModel)]="nueva.fechaHasta">
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-comentario">Comentario</label>
              <textarea id="eq-comentario" rows="3" [class]="estilos.area" placeholder="Qué pasó, en una línea"
                        [(ngModel)]="nueva.comentario"></textarea>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-adjunto">Certificado o constancia</label>
              <input id="eq-adjunto" type="file" accept=".pdf,.jpg,.jpeg,.png" class="text-[12.5px]"
                     (change)="elegirArchivo($event)">
              <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                {{ tipoElegido()?.exigeCertificado ? 'Obligatorio para este tipo' : 'Opcional' }} · hasta 10 MB
              </p>
            </div>
            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="registrando.set(false)">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="registrar()" [disabled]="guardando()">
              {{ guardando() ? 'Enviando…' : 'Enviar a RR.HH.' }}
            </button>
          </footer>
        </div>
      </div>
    }
  `
})
export class AsistenciaEquipoComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);

  protected readonly estilos = ESTILOS;
  protected readonly PASTILLA_ALERTA = PASTILLA_ALERTA;
  protected readonly FILTROS: { clave: 'todas' | TipoAlerta; texto: string }[] = [
    { clave: 'todas', texto: 'Todas' },
    { clave: 'MARCA', texto: 'Marcas sin registrar' },
    { clave: 'PAUSA', texto: 'Excesos de pausa' },
    { clave: 'TARDANZA', texto: 'Tardanza' }
  ];

  readonly perfil = signal<PerfilAsistencia | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  /** Arranca en la semana en curso: las alertas sirven el mismo día. */
  readonly lunes = signal(lunesDe(new Date()));
  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly pendientes = signal<Justificacion[]>([]);
  readonly tipos = signal<TipoDia[]>([]);
  readonly filtro = signal<'todas' | TipoAlerta>('todas');
  readonly cargando = signal(true);
  readonly guardando = signal(false);

  readonly enRevision = signal<Justificacion | null>(null);
  readonly rechazando = signal(false);
  readonly motivo = signal('');
  readonly faltaMotivo = signal(false);

  readonly registrando = signal(false);
  readonly error = signal('');
  private archivo: File | null = null;
  nueva = { idUsuario: null as number | null, idTipoDia: null as number | null,
            fechaDesde: hoy(), fechaHasta: hoy(), comentario: '' };

  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);

  /**
   * Lo que puede elegir: RR.HH. y ADMIN, todo; la supervisora, solo las
   * subcarteras que supervisa y, hacia arriba, sus carteras y clientes.
   */
  private readonly permitido = computed(() => {
    const p = this.perfil();
    if (!p || p.rrhh) {
      return null;
    }
    return {
      clientes: new Set(p.subcarteras.map(s => s.idCliente)),
      carteras: new Set(p.subcarteras.map(s => s.idCartera)),
      subcarteras: new Set(p.subcarteras.map(s => s.id))
    };
  });

  readonly sinAsignar = computed(() => {
    const p = this.perfil();
    return !!p && !p.rrhh && !p.subcarteras.length;
  });

  readonly sabado = computed(() => sumarDias(this.lunes(), 5));
  readonly esSemanaActual = computed(() => this.lunes() >= lunesDe(new Date()));

  readonly textoSemana = computed(() => {
    const [a, b] = [new Date(this.lunes() + 'T00:00:00'), new Date(this.sabado() + 'T00:00:00')];
    const mes = MESES[b.getMonth()].slice(0, 3);
    return `${a.getDate()} – ${b.getDate()} ${mes}`;
  });

  readonly gente = computed(() => this.reporte()?.agentes ?? []);

  readonly resumen = computed(() => {
    const [a, b] = [new Date(this.lunes() + 'T00:00:00'), new Date(this.sabado() + 'T00:00:00')];
    const conAlerta = new Set(this.alertas().map(x => x.idUsuario)).size;
    return `Semana del ${a.getDate()} al ${b.getDate()} de ${MESES[b.getMonth()]}`
      + ` · ${this.gente().length} asesores · ${conAlerta} con alertas`;
  });

  /**
   * Las alertas salen del reporte. Una marca que falta solo cuenta cuando el día
   * ya terminó: hoy a mediodía el almuerzo todavía no se ha marcado y no es
   * falta de nadie.
   */
  readonly alertas = computed<Alerta[]>(() => {
    const r = this.reporte();
    if (!r) {
      return [];
    }
    const ahora = new Date();
    const hoyTexto = fechaTexto(ahora);
    const horaAhora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const tolDia = r.toleranciaDiaMin ?? 10;
    const tolSemana = r.toleranciaSemanaMin ?? 30;
    const salida: Alerta[] = [];

    for (const d of r.dias) {
      if (d.estado === 'NO_LABORABLE' || d.estado === 'JUSTIFICADO' || d.estado === 'FALTA' || d.fecha > hoyTexto) {
        continue;
      }
      const base = { idUsuario: d.idUsuario, nombre: d.nombreAgente, orden: d.fecha, dia: this.diaCorto(d.fecha) };
      const terminado = d.fecha < hoyTexto || (!!d.horaSalidaHorario && horaAhora >= d.horaSalidaHorario.slice(0, 5));

      if (terminado) {
        this.faltanteDePausa(salida, base, d.marcasFaltantes, 'ALMUERZO', 'almuerzo', d.almuerzoInicio, d.almuerzoFin);
        this.faltanteDePausa(salida, base, d.marcasFaltantes, 'BREAK', 'break', d.breakInicio, d.breakFin);
      }
      if ((d.excesoAlmuerzoMin ?? 0) > 0) {
        salida.push({ ...base, tipo: 'PAUSA', alerta: 'Exceso de almuerzo',
          detalle: this.detalleExceso(d.almuerzoInicio, d.almuerzoFin, d.excesoAlmuerzoMin!) });
      }
      if ((d.excesoBreakMin ?? 0) > 0) {
        salida.push({ ...base, tipo: 'PAUSA', alerta: 'Exceso de break',
          detalle: this.detalleExceso(d.breakInicio, d.breakFin, d.excesoBreakMin!) });
      }
      if ((d.minutosTardanza ?? 0) > tolDia) {
        salida.push({ ...base, tipo: 'TARDANZA', alerta: 'Límite diario excedido',
          detalle: `Ingresó ${d.entrada?.slice(0, 5) ?? '—'} · tardanza ${this.duracion(d.minutosTardanza!)}` });
      }
    }

    for (const s of r.semanas) {
      if (s.superoToleranciaSemanal) {
        salida.push({ idUsuario: s.idUsuario, nombre: s.nombreAgente, orden: this.sabado(), dia: 'Semana',
          tipo: 'TARDANZA', alerta: 'Límite semanal excedido',
          detalle: `${this.duracion(s.minutosTardanza)} en la semana · límite ${this.duracion(tolSemana)}` });
      }
    }

    return salida.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.orden.localeCompare(b.orden));
  });

  readonly alertasVisibles = computed(() =>
    this.alertas().filter(a => this.filtro() === 'todas' || a.tipo === this.filtro()));

  /** Solo las de su gente: la bandeja es de toda la empresa. */
  readonly porRevisar = computed(() => {
    const suyos = new Set(this.gente().map(p => p.idUsuario));
    return this.pendientes().filter(j => suyos.has(j.idUsuario));
  });

  readonly kpis = computed(() => {
    const a = this.alertas();
    const cuenta = (t: TipoAlerta) => a.filter(x => x.tipo === t).length;
    return [
      { titulo: 'Por llamar la atención', icono: 'bell', cifra: new Set(a.map(x => x.idUsuario)).size,
        de: this.gente().length as number | null, pie: 'Asesores con alguna alerta esta semana' },
      { titulo: 'Marcas sin registrar', icono: 'pencil', cifra: cuenta('MARCA'), de: null,
        pie: 'Break o almuerzo sin marcar' },
      { titulo: 'Excesos de pausa', icono: 'coffee', cifra: cuenta('PAUSA'), de: null,
        pie: 'Break o almuerzo más largo de lo permitido' },
      { titulo: 'Justificaciones por revisar', icono: 'file-text', cifra: this.porRevisar().length, de: null,
        pie: 'Esperan tu revisión para pasar a RR.HH.' }
    ];
  });

  ngOnInit(): void {
    this.servicio.perfil().subscribe({
      next: p => {
        this.perfil.set(p);
        this.cargando.set(false);
        this.cargarClientes();
      },
      error: () => {
        this.cargando.set(false);
        this.toast.error('No se pudo saber qué subcarteras supervisas');
      }
    });
    this.servicio.tiposDeDia().subscribe({
      next: t => this.tipos.set(t.filter(x => !TIPOS_DE_CALENDARIO.includes(x.codigo))),
      error: () => this.tipos.set([])
    });
  }

  // ==================== ÁMBITO ====================

  /** Sin filtrar por `isActive`, como en Control de Asistencia: Financiera Oh está inactiva en QAS. */
  private cargarClientes(): void {
    this.clientesServicio.getAllTenants().subscribe({
      next: c => {
        const permitido = this.permitido();
        const lista = c.filter(x => !permitido || permitido.clientes.has(x.id))
          .sort((a, b) => (a.businessName || a.tenantName).localeCompare(b.businessName || b.tenantName));
        this.clientes.set(lista);
        if (lista.length === 1) {
          this.elegirCliente(lista[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
  }

  elegirCliente(id: number | null): void {
    this.idCliente.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.reporte.set(null);
    if (!id) {
      return;
    }
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => {
        const permitido = this.permitido();
        const lista = c.filter(x => !permitido || permitido.carteras.has(x.id))
          .sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.carteras.set(lista);
        if (lista.length === 1) {
          this.elegirCartera(lista[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    this.reporte.set(null);
    if (!id) {
      return;
    }
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const permitido = this.permitido();
        const lista = s.filter(x => !permitido || permitido.subcarteras.has(x.id))
          .sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(lista);
        if (lista.length === 1) {
          this.cambiarSubcartera(lista[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  cambiarSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.reporte.set(null);
    if (id) {
      this.cargar();
    }
  }

  moverSemana(n: number): void {
    this.lunes.set(sumarDias(this.lunes(), 7 * n));
    this.cargar();
  }

  private cargar(): void {
    const sub = this.idSubcartera();
    if (!sub) {
      this.cargando.set(false);
      return;
    }
    this.cargando.set(true);
    this.servicio.reporte(this.lunes(), this.sabado(), sub).subscribe({
      next: r => {
        this.reporte.set(r);
        this.cargando.set(false);
      },
      error: () => {
        this.reporte.set(null);
        this.cargando.set(false);
        this.toast.error('No se pudo cargar la asistencia del equipo');
      }
    });
    this.cargarPendientes();
  }

  /** Las pendientes de revisión de los últimos tres meses y las que vienen. */
  private cargarPendientes(): void {
    this.servicio.justificaciones(sumarDias(hoy(), -90), sumarDias(hoy(), 60), ['PENDIENTE']).subscribe({
      next: j => this.pendientes.set(j),
      error: () => this.pendientes.set([])
    });
  }

  // ==================== REVISAR ====================

  abrirRevision(j: Justificacion): void {
    this.enRevision.set(j);
    this.rechazando.set(false);
    this.motivo.set('');
    this.faltaMotivo.set(false);
  }

  cerrarRevision(): void {
    this.enRevision.set(null);
  }

  conforme(j: Justificacion): void {
    this.decidir(j, true, 'Enviada a RR.HH. para su aprobación');
  }

  /** El primer clic pide el motivo; el segundo rechaza. */
  rechazar(j: Justificacion): void {
    if (!this.rechazando()) {
      this.rechazando.set(true);
      return;
    }
    if (!this.motivo().trim()) {
      this.faltaMotivo.set(true);
      return;
    }
    this.decidir(j, false, 'Rechazada: el asesor verá el motivo');
  }

  private decidir(j: Justificacion, aFavor: boolean, mensaje: string): void {
    this.guardando.set(true);
    this.servicio.revisarJustificacion(j.id, aFavor, this.motivo().trim() || undefined).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarRevision();
        this.toast.success(mensaje);
        this.cargarPendientes();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo guardar la revisión');
      }
    });
  }

  verCertificado(j: Justificacion): void {
    this.servicio.certificado(j.id).subscribe({
      next: blob => window.open(URL.createObjectURL(blob), '_blank'),
      error: () => this.toast.error('No se pudo abrir el adjunto')
    });
  }

  // ==================== REGISTRAR ====================

  /** Método y no computed: `nueva` es un objeto del formulario, no una signal. */
  tipoElegido(): TipoDia | null {
    return this.tipos().find(t => t.id === this.nueva.idTipoDia) ?? null;
  }

  primerDia(): string | null {
    return primerDiaPermitido(this.tipoElegido());
  }

  abrirRegistro(): void {
    this.nueva = { idUsuario: this.gente()[0]?.idUsuario ?? null, idTipoDia: this.tipos()[0]?.id ?? null,
                   fechaDesde: hoy(), fechaHasta: hoy(), comentario: '' };
    this.archivo = null;
    this.error.set('');
    this.registrando.set(true);
  }

  elegirArchivo(evento: Event): void {
    this.archivo = (evento.target as HTMLInputElement).files?.[0] ?? null;
  }

  registrar(): void {
    const tipo = this.tipoElegido();
    if (!this.nueva.idUsuario || !tipo) {
      this.error.set('Elige a la persona y el tipo');
      return;
    }
    if (this.nueva.fechaHasta < this.nueva.fechaDesde) {
      this.error.set('La fecha final no puede ser anterior a la inicial');
      return;
    }
    const primerDia = this.primerDia();
    if (primerDia && this.nueva.fechaDesde < primerDia) {
      this.error.set(avisoAnticipacion(tipo));
      return;
    }
    if (tipo.exigeCertificado && !this.archivo) {
      this.error.set(`${tipo.nombre} necesita certificado adjunto`);
      return;
    }

    const nombre = this.gente().find(p => p.idUsuario === this.nueva.idUsuario)?.nombreAgente ?? '';
    this.guardando.set(true);
    this.servicio.crearJustificacion({
      idUsuario: this.nueva.idUsuario,
      idTipoDia: tipo.id,
      fechaDesde: this.nueva.fechaDesde,
      fechaHasta: this.nueva.fechaHasta,
      comentario: this.nueva.comentario.trim() || undefined,
      archivo: this.archivo
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.registrando.set(false);
        this.toast.success(`Registrada para ${nombre} y enviada a RR.HH.`);
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo registrar la justificación');
      }
    });
  }

  // ==================== APOYO ====================

  diasDe(j: Justificacion): string {
    const corta = (f: string) => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
    return j.fechaDesde === j.fechaHasta ? corta(j.fechaDesde) : `${corta(j.fechaDesde)} al ${corta(j.fechaHasta)}`;
  }

  private diaCorto(fecha: string): string {
    return `${DIAS_CORTOS[new Date(fecha + 'T00:00:00').getDay()]} ${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`;
  }

  /** «0:19»: una duración, no una hora de reloj. */
  private duracion(minutos: number): string {
    return `${Math.floor(minutos / 60)}:${String(minutos % 60).padStart(2, '0')}`;
  }

  /** «+14 min · 74 de 60»: cuánto se pasó, cuánto usó y cuánto tenía. */
  private detalleExceso(inicio: string | null, fin: string | null, exceso: number): string {
    if (!inicio || !fin) {
      return `+${exceso} min`;
    }
    const aMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
    const usado = aMin(fin) - aMin(inicio);
    return `+${exceso} min · ${usado} de ${usado - exceso}`;
  }

  /**
   * La pausa que falta, dicha según qué parte falta: ninguna de las dos marcas,
   * o solo la vuelta, o solo la salida.
   */
  private faltanteDePausa(salida: Alerta[], base: Omit<Alerta, 'tipo' | 'alerta' | 'detalle'>,
                          faltantes: string[], prefijo: 'ALMUERZO' | 'BREAK', nombre: string,
                          inicio: string | null, fin: string | null): void {
    const faltaInicio = faltantes.includes(`${prefijo}_INICIO`);
    const faltaFin = faltantes.includes(`${prefijo}_FIN`);
    if (faltaInicio && faltaFin) {
      salida.push({ ...base, tipo: 'MARCA', alerta: `No marcó ${nombre}`,
        detalle: `Sin salida ni regreso del ${nombre}` });
    } else if (faltaFin) {
      salida.push({ ...base, tipo: 'MARCA', alerta: `No marcó el regreso del ${nombre}`,
        detalle: `Salió al ${nombre} a las ${inicio?.slice(0, 5) ?? '—'}` });
    } else if (faltaInicio) {
      salida.push({ ...base, tipo: 'MARCA', alerta: `No marcó la salida al ${nombre}`,
        detalle: `Regresó del ${nombre} a las ${fin?.slice(0, 5) ?? '—'}` });
    }
  }
}
