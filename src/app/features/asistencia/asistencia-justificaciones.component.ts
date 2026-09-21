import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { Justificacion, ResumenAgente, TipoDia } from './asistencia.models';
import { ESTADO_SOLICITUD, ESTILOS, FILA_SOLICITUD, hoy } from './asistencia.estilos';

/**
 * Bandeja de justificaciones.
 *
 * Son DOS decisiones y no una: la supervisora REVISA —confirma que la ausencia
 * ocurrió— y RR.HH. APRUEBA —decide si se paga y si se recupera—. Por eso los
 * botones cambian según el estado de la fila y nunca sale «Aprobar» sobre algo
 * que la supervisora aún no ha visto: es lo que pidió Emily, que a ella solo le
 * llegue lo ya revisado.
 *
 * Registrar una justificación se hace desde Mi Asistencia, también cuando la
 * escribe la supervisora por alguien: el formulario es el mismo y tenerlo en
 * dos sitios los haría divergir.
 */
@Component({
  selector: 'app-asistencia-justificaciones',
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
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Justificaciones</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            La registra la supervisora y la aprueba RR.HH.
          </p>
        </div>
        <button type="button" [class]="estilos.botonPrimario" (click)="abrirAlta()">
          <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
          Registrar justificación
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="estado-j">Estado</label>
          <select id="estado-j" [class]="estilos.campo + ' w-[210px]'"
                  [ngModel]="filtro()" (ngModelChange)="filtro.set($event); cargar()">
            @for (f of FILTROS; track f.clave) {
              <option [ngValue]="f.clave">{{ f.texto }}{{ cuenta(f.clave) ? ' (' + cuenta(f.clave) + ')' : '' }}</option>
            }
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="tipo-j">Tipo</label>
          <select id="tipo-j" [class]="estilos.campo + ' w-[210px]'"
                  [ngModel]="tipo()" (ngModelChange)="tipo.set($event); cargar()">
            <option value="">Todos</option>
            @for (t of tipos(); track t) { <option [value]="t">{{ t }}</option> }
          </select>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
    <div class="aparecer">

      @if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando solicitudes…</p>
      } @else {
        <div [class]="estilos.panel">
          <table class="w-full border-collapse">
            <caption class="sr-only">Justificaciones del rango</caption>
            <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
              <tr>
                <th scope="col" [class]="estilos.th">Solicitado</th>
                <th scope="col" [class]="estilos.th">Persona</th>
                <th scope="col" [class]="estilos.th">Rol</th>
                <th scope="col" [class]="estilos.th">Tipo</th>
                <th scope="col" [class]="estilos.th">Días</th>
                <th scope="col" [class]="estilos.th">Certificado</th>
                <th scope="col" [class]="estilos.th">Revisó</th>
                <th scope="col" [class]="estilos.th">Estado</th>
                <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              @for (j of solicitudes(); track j.id) {
                <!-- La fila pintada dice el estado sin necesidad de un círculo. -->
                <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800"
                    [class]="FILA_SOLICITUD[j.estado]">
                  <td [class]="estilos.td">{{ j.solicitadaEn | date: 'dd/MM HH:mm' }}</td>
                  <td [class]="estilos.td">
                    <span class="font-semibold">{{ j.nombreAgente }}</span>
                    <span class="ml-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ j.subcartera }}</span>
                  </td>
                  <td [class]="estilos.td">
                    @if (j.rol) {
                      <span [class]="j.rol === 'Supervisor' ? estilos.rolSupervisor : estilos.rolAsesor">
                        {{ j.rol }}
                      </span>
                    }
                  </td>
                  <td [class]="estilos.td">
                    {{ j.tipo }}
                    @if (j.recuperable) {
                      <span class="ml-1.5 rounded-full bg-[#f1f3f6] px-1.5 py-0.5 text-[10.5px] font-bold text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400">
                        se recupera
                      </span>
                    }
                    @if (j.pagado === false) {
                      <span class="ml-1.5 rounded-full bg-[#fdecec] px-1.5 py-0.5 text-[10.5px] font-bold text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300">
                        sin goce
                      </span>
                    }
                  </td>
                  <td [class]="estilos.td">
                    {{ j.fechaDesde | date: 'dd/MM' }}
                    @if (j.fechaHasta !== j.fechaDesde) { – {{ j.fechaHasta | date: 'dd/MM' }} }
                    <span class="ml-1 text-[#5f6c80] dark:text-slate-400">({{ j.dias }})</span>
                  </td>
                  <td [class]="estilos.td">
                    @if (j.tieneArchivo) {
                      <button type="button"
                              class="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2563eb] hover:underline"
                              (click)="verCertificado(j)">
                        <lucide-angular name="file-check" [size]="13" class="block"></lucide-angular>
                        Ver
                      </button>
                    } @else {
                      <span class="text-[#8491a3] dark:text-slate-500">—</span>
                    }
                  </td>
                  <td [class]="estilos.td">{{ j.revisadaPor ?? '—' }}</td>
                  <td [class]="estilos.td">
                    <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-bold"
                          [class]="ESTADO_SOLICITUD[j.estado].clase">
                      {{ ESTADO_SOLICITUD[j.estado].texto }}
                    </span>
                  </td>
                  <!-- Un solo botón: abre la solicitud, y dentro se dice a quién le
                       toca y qué puede hacer. Dos iconos que abrían lo mismo no
                       decían cuál servía para qué. -->
                  <td [class]="estilos.td + ' text-right'">
                    <button type="button" [class]="estilos.botonChico" (click)="abrir(j)"
                            [attr.aria-label]="'Abrir la solicitud de ' + j.nombreAgente">
                      <lucide-angular name="eye" [size]="13" class="block"></lucide-angular>
                      Abrir
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" class="px-3 py-14 text-center">
                    <strong class="block text-[13.5px]">Nada por aquí</strong>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                      No hay solicitudes con ese filtro en el rango elegido.
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
    </div>

    <!-- Registrar una justificación por otra persona. Lo hace la supervisora
         cuando el asesor está de baja y no puede entrar a pedirla. -->
    @if (alta()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarAlta()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,520px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-alta-just">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-alta-just" class="!m-0 text-[15px] font-extrabold">Registrar justificación</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                La registra la supervisora; RR.HH. la recibe para aprobar
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarAlta()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="f-persona">Para quién</label>
              <select id="f-persona" [class]="estilos.campo" [(ngModel)]="nueva.idUsuario">
                <option [ngValue]="null">Elige a la persona</option>
                @for (p of personas(); track p.idUsuario) {
                  <option [ngValue]="p.idUsuario">{{ p.nombreAgente }}</option>
                }
              </select>
              <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                Solo aparecen las personas de tu equipo. Queda anotado que la registraste tú.
              </p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="f-tipo">Tipo</label>
              <select id="f-tipo" [class]="estilos.campo" [(ngModel)]="nueva.idTipoDia">
                @for (t of catalogo(); track t.id) {
                  <option [ngValue]="t.id">{{ t.nombre }}</option>
                }
              </select>
            </div>

            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="f-desde">Desde</label>
                <input id="f-desde" type="date" [class]="estilos.campo" [(ngModel)]="nueva.fechaDesde">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="f-hasta">Hasta</label>
                <input id="f-hasta" type="date" [class]="estilos.campo" [(ngModel)]="nueva.fechaHasta">
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <span [class]="estilos.etiqueta">Certificado</span>
              <label class="flex cursor-pointer flex-col items-center gap-1 rounded-[10px] border border-dashed border-[#8491a3] p-[18px] text-center hover:bg-[#f4f6f9] dark:border-slate-600 dark:hover:bg-slate-800"
                     for="f-archivo">
                <lucide-angular name="upload" [size]="18" class="block text-[#8491a3]"></lucide-angular>
                <strong class="text-[12.5px]">{{ archivo()?.name ?? 'Elige una foto o un PDF' }}</strong>
                <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  {{ tipoElegido()?.exigeCertificado ? 'Obligatorio para este tipo' : 'Opcional' }} · hasta 10 MB
                </span>
              </label>
              <input id="f-archivo" type="file" class="sr-only"
                     accept="image/jpeg,image/png,image/webp,application/pdf"
                     (change)="elegirArchivo($event)">
            </div>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="f-comentario">Comentario</label>
              <textarea id="f-comentario" rows="2" [class]="estilos.area"
                        placeholder="Lo que quieras añadir para quien la apruebe"
                        [(ngModel)]="nueva.comentario"></textarea>
            </div>

            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarAlta()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="enviarAlta()"
                    [disabled]="guardando()">
              <lucide-angular name="send" [size]="15" class="block"></lucide-angular>
              {{ guardando() ? 'Enviando…' : 'Enviar a revisión' }}
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- Detalle y decisión -->
    @if (abierta(); as j) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrar()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,560px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-just">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-just" class="!m-0 text-[15px] font-extrabold">{{ j.tipo }}</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ j.nombreAgente }} · {{ j.fechaDesde | date: 'dd/MM/yyyy' }}
                @if (j.fechaHasta !== j.fechaDesde) { al {{ j.fechaHasta | date: 'dd/MM/yyyy' }} }
                · {{ j.dias }} {{ j.dias === 1 ? 'día' : 'días' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrar()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">

            <!-- Por dónde va: los dos pasos, dichos en orden -->
            <ol class="!m-0 flex list-none gap-2 !p-0">
              <li class="flex-1 rounded-lg border px-3 py-2"
                  [class]="j.revisadaEn
                    ? 'border-[#bfe3c8] bg-[#e8f5ec] dark:border-green-900 dark:bg-green-950/30'
                    : 'border-[#e6e9ee] bg-[#f6f7f9] dark:border-slate-700 dark:bg-slate-800/50'">
                <strong class="block text-[11.5px] uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">
                  1. Supervisora
                </strong>
                <span class="text-[12.5px]">
                  {{ j.revisadaPor ?? 'Sin revisar' }}
                  @if (j.revisadaEn) {
                    <span class="text-[#5f6c80] dark:text-slate-400">· {{ j.revisadaEn | date: 'dd/MM HH:mm' }}</span>
                  }
                </span>
              </li>
              <li class="flex-1 rounded-lg border px-3 py-2"
                  [class]="j.resueltaEn
                    ? 'border-[#bfe3c8] bg-[#e8f5ec] dark:border-green-900 dark:bg-green-950/30'
                    : 'border-[#e6e9ee] bg-[#f6f7f9] dark:border-slate-700 dark:bg-slate-800/50'">
                <strong class="block text-[11.5px] uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">
                  2. RR.HH.
                </strong>
                <span class="text-[12.5px]">
                  {{ j.resueltaPor ?? 'Sin resolver' }}
                  @if (j.resueltaEn) {
                    <span class="text-[#5f6c80] dark:text-slate-400">· {{ j.resueltaEn | date: 'dd/MM HH:mm' }}</span>
                  }
                </span>
              </li>
            </ol>

            @if (j.comentario) {
              <div class="flex flex-col gap-1">
                <span [class]="estilos.etiqueta">Comentario</span>
                <p class="!m-0 text-[13px]">{{ j.comentario }}</p>
              </div>
            }

            <div class="flex flex-col gap-1">
              <span [class]="estilos.etiqueta">Certificado</span>
              @if (j.tieneArchivo) {
                @if (vistaPrevia()) {
                  <img [src]="vistaPrevia()" alt="Certificado adjunto"
                       class="max-h-[280px] w-full rounded-lg border border-[#e6e9ee] object-contain dark:border-slate-700">
                } @else {
                  <button type="button" [class]="estilos.botonSecundario + ' self-start'" (click)="verCertificado(j)">
                    <lucide-angular name="file-check" [size]="15" class="block"></lucide-angular>
                    {{ j.archivoNombre ?? 'Abrir certificado' }}
                  </button>
                }
              } @else {
                <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">No adjuntó ninguno</span>
              }
            </div>

            @if (j.motivoResolucion) {
              <div class="flex flex-col gap-1">
                <span [class]="estilos.etiqueta">Motivo de la resolución</span>
                <p class="!m-0 text-[13px]">{{ j.motivoResolucion }}</p>
              </div>
            }

            @if (j.estado === 'PENDIENTE' || j.estado === 'REVISADA') {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="motivo-just">
                  Motivo
                </label>
                <textarea id="motivo-just" rows="2" [class]="estilos.area"
                          placeholder="Lo que quede registrado con la decisión"
                          [(ngModel)]="motivo"></textarea>
              </div>
            }

            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <!-- Mientras toca decidir, el pie son las dos decisiones y a quién le
               corresponde: «Cerrar» ahí sobra, para eso está la X de arriba.
               Solo cuando ya no queda nada que decidir queda «Cerrar». -->
          <footer class="flex flex-wrap items-center justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            @if (j.estado === 'PENDIENTE') {
              <span class="mr-auto text-[12px] font-semibold text-[#5f6c80] dark:text-slate-400">
                Le toca a la supervisora
              </span>
              <button type="button" [class]="estilos.botonSecundario" (click)="decidir(j, false)"
                      [disabled]="guardando()">
                <lucide-angular name="x-circle" [size]="15" class="block"></lucide-angular>
                Rechazar
              </button>
              <button type="button" [class]="estilos.botonPrimario" (click)="decidir(j, true)"
                      [disabled]="guardando()">
                <lucide-angular name="check" [size]="15" class="block"></lucide-angular>
                Revisar y enviar a RR.HH.
              </button>
            } @else if (j.estado === 'REVISADA') {
              <span class="mr-auto text-[12px] font-semibold text-[#5f6c80] dark:text-slate-400">
                Le toca a RR.HH.
              </span>
              <button type="button" [class]="estilos.botonSecundario" (click)="decidir(j, false)"
                      [disabled]="guardando()">
                <lucide-angular name="x-circle" [size]="15" class="block"></lucide-angular>
                Rechazar
              </button>
              <button type="button" [class]="estilos.botonPrimario" (click)="decidir(j, true)"
                      [disabled]="guardando()">
                <lucide-angular name="badge-check" [size]="15" class="block"></lucide-angular>
                Aprobar
              </button>
            } @else {
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrar()">Cerrar</button>
            }
          </footer>
        </div>
      </div>
    }
  `
})
export class AsistenciaJustificacionesComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADO_SOLICITUD = ESTADO_SOLICITUD;
  protected readonly FILA_SOLICITUD = FILA_SOLICITUD;

  /** Los dos primeros son las dos bandejas reales: la de cada paso. */
  protected readonly FILTROS = [
    { clave: 'TODAS', texto: 'Todas' },
    { clave: 'PENDIENTE', texto: 'Pendientes de revisar' },
    { clave: 'REVISADA', texto: 'Pendientes de aprobar' },
    { clave: 'APROBADA', texto: 'Aprobadas' },
    { clave: 'RECHAZADA', texto: 'Rechazadas' }
  ] as const;

  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  /** Lo que espera a alguien, para el número de la pestaña. */
  readonly sinResolverCambia = output<number>();
  /** El ámbito, para saber a quién puede registrarle una justificación. */
  readonly idSubcartera = input<number | null>(null);

  readonly solicitudes = signal<Justificacion[]>([]);
  readonly todas = signal<Justificacion[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly filtro = signal<string>('TODAS');
  readonly tipo = signal<string>('');

  /** Los tipos que de verdad aparecen en la bandeja, no el catálogo entero. */
  readonly tipos = computed(() =>
    [...new Set(this.todas().map(j => j.tipo).filter((t): t is string => !!t))].sort());

  readonly alta = signal(false);
  readonly personas = signal<ResumenAgente[]>([]);
  readonly catalogo = signal<TipoDia[]>([]);
  readonly archivo = signal<File | null>(null);
  nueva = {
    idUsuario: null as number | null,
    idTipoDia: null as number | null,
    fechaDesde: hoy(),
    fechaHasta: hoy(),
    comentario: ''
  };

  readonly tipoElegido = computed(() =>
    this.catalogo().find(t => t.id === this.nueva.idTipoDia) ?? null);

  readonly abierta = signal<Justificacion | null>(null);
  readonly vistaPrevia = signal<string | null>(null);
  readonly conforme = signal(true);
  motivo = '';

  /** Cuántas hay en cada bandeja, para el número del botón. */
  readonly pendientes = computed(() => this.todas().filter(j => j.estado === 'PENDIENTE').length);
  readonly revisadas = computed(() => this.todas().filter(j => j.estado === 'REVISADA').length);

  constructor() {
    effect(() => {
      const desde = this.desde();
      const hasta = this.hasta();
      this.cargarRango(desde, hasta);
    });

    // El selector de «Para quién» solo lista a quien está en el ámbito.
    effect(() => {
      const ambito = this.idSubcartera();
      if (!ambito) {
        this.personas.set([]);
        return;
      }
      this.servicio.reporte(this.desde(), this.hasta(), ambito).subscribe({
        next: r => this.personas.set(r.agentes),
        error: () => this.personas.set([])
      });
    });

    this.servicio.tiposDeDia().subscribe({
      next: t => {
        this.catalogo.set(t);
        this.nueva.idTipoDia = t[0]?.id ?? null;
      },
      error: () => this.catalogo.set([])
    });
  }

  // ==================== REGISTRAR POR OTRA PERSONA ====================

  abrirAlta(): void {
    this.alta.set(true);
    this.error.set('');
    this.archivo.set(null);
    this.nueva = {
      idUsuario: null,
      idTipoDia: this.catalogo()[0]?.id ?? null,
      fechaDesde: hoy(),
      fechaHasta: hoy(),
      comentario: ''
    };
  }

  cerrarAlta(): void {
    this.alta.set(false);
  }

  elegirArchivo(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    this.archivo.set(entrada.files?.[0] ?? null);
    this.error.set('');
  }

  enviarAlta(): void {
    if (!this.nueva.idUsuario) {
      this.error.set('Elige para quién es');
      return;
    }
    if (!this.nueva.idTipoDia) {
      this.error.set('Elige el tipo');
      return;
    }
    if (this.nueva.fechaHasta < this.nueva.fechaDesde) {
      this.error.set('La fecha final no puede ser anterior a la inicial');
      return;
    }
    if (this.tipoElegido()?.exigeCertificado && !this.archivo()) {
      this.error.set(`${this.tipoElegido()!.nombre} necesita certificado adjunto`);
      return;
    }

    this.guardando.set(true);
    this.servicio.crearJustificacion({
      idTipoDia: this.nueva.idTipoDia,
      fechaDesde: this.nueva.fechaDesde,
      fechaHasta: this.nueva.fechaHasta,
      comentario: this.nueva.comentario,
      idUsuario: this.nueva.idUsuario,
      archivo: this.archivo()
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarAlta();
        this.toast.success('Justificación registrada');
        this.cargarRango(this.desde(), this.hasta());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo registrar');
      }
    });
  }

  cuenta(clave: string): number {
    return clave === 'PENDIENTE' ? this.pendientes() : clave === 'REVISADA' ? this.revisadas() : 0;
  }

  cargar(): void {
    this.aplicarFiltro();
  }

  private cargarRango(desde: string, hasta: string): void {
    this.cargando.set(true);
    // Se traen todas y se filtra en el cliente: son decenas de filas y así los
    // contadores de las pestañas no necesitan una consulta por cada una.
    this.servicio.justificaciones(desde, hasta).subscribe({
      next: lista => {
        this.todas.set(lista);
        this.aplicarFiltro();
        this.sinResolverCambia.emit(this.pendientes() + this.revisadas());
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudieron cargar las justificaciones');
        this.cargando.set(false);
      }
    });
  }

  private aplicarFiltro(): void {
    const f = this.filtro();
    const t = this.tipo();
    this.solicitudes.set(this.todas().filter(j =>
      (f === 'TODAS' || j.estado === f) && (!t || j.tipo === t)));
  }

  // ==================== DECISIÓN ====================

  abrir(j: Justificacion): void {
    this.abierta.set(j);
    this.motivo = '';
    this.error.set('');
    this.conforme.set(true);
    this.vistaPrevia.set(null);

    // Si el certificado es una imagen se enseña dentro: obligar a abrir otra
    // pestaña para mirar una foto rompe el hilo de la revisión.
    if (j.tieneArchivo) {
      this.servicio.certificado(j.id).subscribe({
        next: blob => {
          if (blob.type.startsWith('image/')) {
            this.vistaPrevia.set(URL.createObjectURL(blob));
          }
        },
        error: () => { /* si no se puede, queda el botón de abrir */ }
      });
    }
  }

  cerrar(): void {
    this.abierta.set(null);
    this.vistaPrevia.set(null);
  }

  /**
   * Manda la decisión que toca según el estado: revisar si está pendiente,
   * resolver si ya la revisó la supervisora.
   */
  decidir(j: Justificacion, aFavor: boolean): void {
    if (!aFavor && !this.motivo.trim()) {
      this.conforme.set(false);
      this.error.set('Para rechazar hay que decir por qué');
      return;
    }

    this.guardando.set(true);
    const peticion = j.estado === 'PENDIENTE'
      ? this.servicio.revisarJustificacion(j.id, aFavor, this.motivo.trim())
      : this.servicio.resolverJustificacion(j.id, aFavor, this.motivo.trim());

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrar();
        this.toast.success(this.mensajeDe(j, aFavor));
        this.cargarRango(this.desde(), this.hasta());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo guardar la decisión');
      }
    });
  }

  private mensajeDe(j: Justificacion, aFavor: boolean): string {
    if (!aFavor) {
      return 'Solicitud rechazada';
    }
    return j.estado === 'PENDIENTE' ? 'Revisada. Pasa a RR.HH.' : 'Solicitud aprobada';
  }

  verCertificado(j: Justificacion): void {
    this.servicio.certificado(j.id).subscribe({
      next: blob => window.open(URL.createObjectURL(blob), '_blank'),
      error: () => this.toast.error('No se pudo abrir el certificado')
    });
  }
}
