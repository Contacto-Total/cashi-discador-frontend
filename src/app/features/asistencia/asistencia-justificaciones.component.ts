import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { Justificacion } from './asistencia.models';
import { ESTADO_SOLICITUD, ESTILOS, abrirArchivo, descargarArchivo, hoy, sumarDias } from './asistencia.estilos';

/**
 * Bandeja de justificaciones.
 *
 * Son DOS decisiones y no una: la supervisora REVISA —confirma que la ausencia
 * ocurrió— y RR.HH. APRUEBA —decide si se paga y si se recupera—. Por eso los
 * botones cambian según el estado de la fila y nunca sale «Aprobar» sobre algo
 * que la supervisora aún no ha visto: es lo que pidió Emily, que a ella solo le
 * llegue lo ya revisado.
 *
 * RR.HH. no registra solicitudes: las registra el asesor desde Mi Asistencia o
 * su supervisora desde Asistencia del Equipo, y aquí solo se revisan y se
 * aprueban. Respeta el ámbito y el agente de arriba.
 */
/**
 * Lo que ve RR.HH.: lo que ya pasó por la supervisora. Las que esperan su
 * revisión no se ven (no le toca a RR.HH.), ni las que rechazó ella: esas no
 * llegaron nunca. Las rechazadas que se ven son las que rechazó RR.HH.
 */
const esDeRrhh = (j: Justificacion): boolean =>
  j.estado === 'REVISADA' || j.estado === 'APROBADA' || (j.estado === 'RECHAZADA' && !!j.resueltaEn);

@Component({
  selector: 'app-asistencia-justificaciones',
  standalone: true,
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
          <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Solicitudes</h1>
          <p class="!mb-0 !mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Permisos, descansos y citas del equipo
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="estado-j">Estado</label>
          <select id="estado-j" [class]="estilos.campo + ' !w-[210px]'"
                  [ngModel]="filtro()" (ngModelChange)="filtro.set($event); cargar()">
            @for (f of FILTROS; track f.clave) {
              <option [ngValue]="f.clave">{{ f.texto }}</option>
            }
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="tipo-j">Tipo</label>
          <select id="tipo-j" [class]="estilos.campo + ' !w-[210px]'"
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
            <caption class="sr-only">Solicitudes del rango</caption>
            <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
              <tr>
                <th scope="col" [class]="estilos.th">Fecha de solicitud</th>
                <th scope="col" [class]="estilos.th">Asesor</th>
                <th scope="col" [class]="estilos.th">Rol</th>
                <th scope="col" [class]="estilos.th">Tipo</th>
                <th scope="col" [class]="estilos.th">Fechas</th>
                <th scope="col" [class]="estilos.th">Certificado</th>
                <th scope="col" [class]="estilos.th">Revisado por</th>
                <th scope="col" [class]="estilos.th">Estado</th>
                <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              @for (j of solicitudes(); track j.id) {
                <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800">
                  <td [class]="estilos.td">{{ j.solicitadaEn | date: 'dd/MM' }}</td>
                  <td [class]="estilos.td + ' max-w-[180px] overflow-hidden text-ellipsis font-semibold'" [title]="j.nombreAgente">{{ j.nombreAgente }}</td>
                  <td [class]="estilos.td">
                    @if (j.rol) {
                      <span [class]="j.rol === 'Supervisor' ? estilos.rolSupervisor : estilos.rolAsesor">
                        {{ j.rol }}
                      </span>
                    }
                  </td>
                  <td [class]="estilos.td">{{ j.tipo }}</td>
                  <td [class]="estilos.td">
                    {{ j.fechaDesde | date: 'dd/MM' }}@if (j.fechaHasta !== j.fechaDesde) { – {{ j.fechaHasta | date: 'dd/MM' }}}@if (j.minutosExtra) { · +{{ j.minutosExtra }} min}
                  </td>
                  <td [class]="estilos.td">
                    @if (j.tieneArchivo) {
                      <button type="button" [class]="estilos.adjunto" (click)="verCertificado(j)"
                              [attr.aria-label]="'Abrir el certificado de ' + j.nombreAgente">{{ j.archivoNombre ?? 'certificado.pdf' }}</button>
                    } @else {
                      <span class="text-[#8491a3] dark:text-slate-500">—</span>
                    }
                  </td>
                  <td [class]="estilos.td + ' secundario'">
                    @if (j.revisadaPor) { {{ j.revisadaPor }} } @else { <span class="!text-[#8491a3] dark:!text-slate-500">—</span> }
                  </td>
                  <td [class]="estilos.td">
                    <span class="inline-flex items-center rounded-full px-[9px] py-0.5 text-[11.5px] font-bold"
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
                      <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                      Abrir
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" class="!px-3 !py-14 text-center">
                    <lucide-angular [name]="sinGente() ? 'users' : 'inbox'" [size]="26"
                                    class="mx-auto mb-1 block text-[#8491a3] dark:text-slate-500"></lucide-angular>
                    <strong class="block text-[13.5px]">
                      {{ sinGente() ? 'Sin asesores asignados' : 'Sin solicitudes para estos filtros' }}
                    </strong>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
    </div>

    <!-- Detalle y decisión: la ficha de la maqueta. El motivo aparece al rechazar. -->
    @if (abierta(); as j) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrar()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[min(88vh,760px)] w-[min(100%,560px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-just">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-just" class="!m-0 text-[15px] font-extrabold">Justificación</h2>
              <p class="!mb-0 !mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ j.tipo }} · {{ j.nombreAgente }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrar()" aria-label="Cerrar"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <dl class="ficha">
              <dt>Persona</dt><dd>{{ j.nombreAgente }}@if (j.subcartera) { · {{ j.subcartera }}}</dd>
              <dt>Días</dt><dd>{{ j.fechaDesde | date: 'dd/MM' }}@if (j.fechaHasta !== j.fechaDesde) { – {{ j.fechaHasta | date: 'dd/MM' }}}@if (j.minutosExtra) { · +{{ j.minutosExtra }} min}</dd>
              <dt>Solicitada</dt><dd>{{ j.solicitadaEn | date: 'dd/MM' }}@if (j.solicitadaPor) { por {{ j.solicitadaPor }}}</dd>
              <dt>Estado</dt>
              <dd><span class="inline-flex items-center rounded-full px-[9px] py-0.5 text-[11.5px] font-bold" [class]="ESTADO_SOLICITUD[j.estado].clase">{{ ESTADO_SOLICITUD[j.estado].texto }}</span></dd>
              <dt>Comentario</dt><dd>{{ j.comentario || '—' }}</dd>
              @if (j.motivoResolucion) {
                <dt>Motivo</dt><dd>{{ j.motivoResolucion }}</dd>
              }
            </dl>

            <div class="flex flex-col gap-1.5">
              <span>Certificado</span>
              @if (j.tieneArchivo) {
                <div class="flex items-start gap-3.5">
                  @if (vistaPrevia()) {
                    <img [src]="vistaPrevia()" alt="Certificado adjunto"
                         class="max-h-[150px] w-[190px] flex-none rounded-md border border-[#e6e9ee] object-contain dark:border-slate-800">
                  } @else {
                    <svg class="w-[190px] flex-none rounded-md" viewBox="0 0 220 150" role="img" aria-label="Vista previa del certificado">
                      <rect x="0" y="0" width="220" height="150" rx="6" class="fill-white stroke-[#e6e9ee] dark:fill-slate-900 dark:stroke-slate-800"/>
                      <rect x="16" y="18" width="70" height="7" rx="3.5" class="fill-[#8491a3]" opacity=".7"/>
                      <rect x="16" y="36" width="140" height="5" rx="2.5" class="fill-[#e6e9ee] dark:fill-slate-800"/>
                      <rect x="16" y="48" width="188" height="5" rx="2.5" class="fill-[#e6e9ee] dark:fill-slate-800"/>
                      <rect x="16" y="60" width="160" height="5" rx="2.5" class="fill-[#e6e9ee] dark:fill-slate-800"/>
                      <rect x="16" y="78" width="100" height="5" rx="2.5" class="fill-[#e6e9ee] dark:fill-slate-800"/>
                      <rect x="16" y="90" width="120" height="5" rx="2.5" class="fill-[#e6e9ee] dark:fill-slate-800"/>
                      <circle cx="176" cy="112" r="22" fill="none" stroke="#16a34a" stroke-width="2" opacity=".6"/>
                      <path d="M166 112l7 7 14-15" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>
                      <rect x="16" y="116" width="86" height="5" rx="2.5" class="fill-[#e6e9ee] dark:fill-slate-800"/>
                    </svg>
                  }
                  <div>
                    <strong>{{ j.archivoNombre ?? 'certificado.pdf' }}</strong>
                    <div class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ detalleArchivo() }}</div>
                    <button type="button" [class]="estilos.botonChico + ' mt-2'" (click)="descargar(j)">Descargar</button>
                  </div>
                </div>
              } @else {
                <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">Este tipo no lo exige</p>
              }
            </div>

            @if (rechazando()) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="motivo-just">Por qué se rechaza</label>
                <textarea id="motivo-just" maxlength="300" [class]="estilos.area + ' min-h-[74px] resize-y'"
                          placeholder="Ej.: no avisó y no trajo constancia"
                          [(ngModel)]="motivo" (ngModelChange)="error.set('')"></textarea>
                @if (error()) {
                  <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
                }
              </div>
            } @else if (error()) {
              <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
            }
          </div>

          <footer class="flex flex-wrap items-center justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            @if (j.semanaCerrada && j.estado === 'REVISADA') {
              <span class="mr-auto self-center text-[11.5px] text-[#5f6c80] dark:text-slate-400">Sus días son de una semana cerrada: ya no se resuelve</span>
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrar()">Cerrar</button>
            } @else if (j.estado === 'REVISADA') {
              <span class="mr-auto self-center text-[11.5px] text-[#5f6c80] dark:text-slate-400">Le toca a RR.HH.</span>
              <button type="button" [class]="estilos.botonSecundario" (click)="rechazar(j)" [disabled]="guardando()">
                {{ rechazando() ? 'Confirmar rechazo' : 'Rechazar' }}
              </button>
              <button type="button" [class]="estilos.botonPrimario" (click)="decidir(j, true)" [disabled]="guardando()">
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

  /** Los dos primeros son las dos bandejas reales: la de cada paso. */
  protected readonly FILTROS = [
    { clave: 'TODAS', texto: 'Todas' },
    { clave: 'REVISADA', texto: 'Pendientes de aprobar' },
    { clave: 'APROBADA', texto: 'Aprobadas' },
    { clave: 'RECHAZADA', texto: 'Rechazadas' }
  ] as const;

  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  /** Lo que espera a alguien, para el número de la pestaña. */
  readonly sinResolverCambia = output<number>();
  /** El ámbito y el agente de arriba: la bandeja solo muestra a su gente. */
  readonly idSubcartera = input<number | null>(null);
  readonly agente = input('');
  /** La gente del ámbito elegido; NULL sin subcartera (se ve toda la empresa). */
  readonly roster = signal<Set<number> | null>(null);
  readonly sinGente = computed(() => this.roster()?.size === 0);

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


  readonly abierta = signal<Justificacion | null>(null);
  readonly vistaPrevia = signal<string | null>(null);
  readonly conforme = signal(true);
  /** Al pulsar «Rechazar» aparece el motivo; el segundo clic confirma. */
  readonly rechazando = signal(false);
  /** «1 página · 240 KB»: lo que se sabe del certificado al traerlo. */
  readonly detalleArchivo = signal('');
  private archivoAbierto: Blob | null = null;
  motivo = '';

  /** Lo que le toca aprobar a RR.HH.: el número de la pestaña. */
  readonly revisadas = computed(() => this.todas().filter(j => j.estado === 'REVISADA').length);

  constructor() {
    // La bandeja no depende del rango del reporte: lo que espera a alguien se
    // ve aunque sea de otra semana, como en la maqueta. Tres meses atrás y dos
    // adelante, la misma ventana que usa la supervisora.
    this.cargarBandeja();

    // La gente del ámbito: la bandeja muestra solo sus solicitudes.
    effect(() => {
      const ambito = this.idSubcartera();
      if (!ambito) {
        this.roster.set(null);
        this.aplicarFiltro();
        return;
      }
      this.servicio.reporte(this.desde(), this.hasta(), ambito).subscribe({
        next: r => {
          this.roster.set(new Set(r.agentes.map(a => a.idUsuario)));
          this.aplicarFiltro();
        },
        error: () => this.roster.set(null)
      });
    });
    effect(() => {
      this.agente();
      this.aplicarFiltro();
    });
  }

  cargar(): void {
    this.aplicarFiltro();
  }

  private cargarBandeja(): void {
    const [desde, hasta] = [sumarDias(hoy(), -90), sumarDias(hoy(), 60)];
    this.cargando.set(true);
    // Se traen todas y se filtra en el cliente: son decenas de filas y así los
    // contadores de las pestañas no necesitan una consulta por cada una.
    this.servicio.justificaciones(desde, hasta).subscribe({
      next: lista => {
        this.todas.set(lista);
        this.aplicarFiltro();
        this.sinResolverCambia.emit(this.revisadas());
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudieron cargar las solicitudes');
        this.cargando.set(false);
      }
    });
  }

  private aplicarFiltro(): void {
    const f = this.filtro();
    const t = this.tipo();
    const gente = this.roster();
    const texto = this.agente().trim().toLowerCase();
    this.solicitudes.set(this.todas().filter(j => esDeRrhh(j)
      && (f === 'TODAS' || j.estado === f) && (!t || j.tipo === t)
      && (!gente || gente.has(j.idUsuario))
      && (!texto || (j.nombreAgente ?? '').toLowerCase().includes(texto))));
  }

  // ==================== DECISIÓN ====================

  abrir(j: Justificacion): void {
    this.abierta.set(j);
    this.motivo = '';
    this.error.set('');
    this.conforme.set(true);
    this.rechazando.set(false);
    this.vistaPrevia.set(null);
    this.detalleArchivo.set('');
    this.archivoAbierto = null;

    // Si el certificado es una imagen se enseña dentro: obligar a abrir otra
    // pestaña para mirar una foto rompe el hilo de la revisión. Si es un PDF,
    // la hoja dibujada, con sus páginas y su peso al lado.
    if (j.tieneArchivo) {
      this.servicio.certificado(j.id, j.archivoNombre).subscribe({
        next: blob => {
          this.archivoAbierto = blob;
          const peso = `${Math.max(1, Math.round(blob.size / 1024))} KB`;
          if (blob.type.startsWith('image/')) {
            this.vistaPrevia.set(URL.createObjectURL(blob));
            this.detalleArchivo.set(`Imagen · ${peso}`);
            return;
          }
          blob.arrayBuffer().then(datos => {
            // Contar «/Type /Page» (sin la «s» de /Pages) basta para un certificado escaneado.
            const texto = new TextDecoder('latin1').decode(datos);
            const paginas = (texto.match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
            this.detalleArchivo.set(paginas ? `${paginas} ${paginas === 1 ? 'página' : 'páginas'} · ${peso}` : peso);
          });
        },
        error: () => this.detalleArchivo.set('No se pudo traer el archivo')
      });
    }
  }

  /** Primero pide el motivo; con el motivo escrito, rechaza. */
  rechazar(j: Justificacion): void {
    if (!this.rechazando()) {
      this.rechazando.set(true);
      setTimeout(() => document.getElementById('motivo-just')?.focus());
      return;
    }
    this.decidir(j, false);
  }

  /** Descarga el certificado con su nombre y su extensión. */
  descargar(j: Justificacion): void {
    if (this.archivoAbierto) {
      descargarArchivo(this.archivoAbierto, j.archivoNombre);
      return;
    }
    this.servicio.certificado(j.id, j.archivoNombre).subscribe({
      next: blob => descargarArchivo(blob, j.archivoNombre),
      error: () => this.toast.error('No se pudo descargar el certificado')
    });
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
      this.error.set('Escribe el motivo: es lo que verá el asesor.');
      return;
    }

    this.guardando.set(true);
    this.servicio.resolverJustificacion(j.id, aFavor, this.motivo.trim()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrar();
        this.toast.success(aFavor ? 'Solicitud aprobada' : 'Solicitud rechazada');
        this.cargarBandeja();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo guardar la decisión');
      }
    });
  }



  /** Abre el certificado en otra pestaña: la foto o el PDF se ven, no se bajan con un nombre al azar. */
  verCertificado(j: Justificacion): void {
    abrirArchivo(this.servicio.certificado(j.id, j.archivoNombre), j.archivoNombre,
      () => this.toast.error('No se pudo abrir el certificado'));
  }
}
