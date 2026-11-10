import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { NombrePropioPipe } from '../../shared/ui/nombre-propio.pipe';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import { AmbitoAsistencia, Justificacion } from './asistencia.models';
import { hoy, sumarDias } from './asistencia.estilos';
import { Visor } from './visor-archivo.component';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, FUERTE, PILL, PRINCIPAL, REJILLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TR, TonoPill, VACIO, ZONA
} from './ui/clases';
import { TR_ABRE, TR_ELEGIDA } from './ui/ficha-clases';
import { BOTON_SEC, bajarExcel } from './ui/control-comun';
import { DecidirSolicitudComponent } from './ui/decidir-solicitud.component';
import { DetalleSolicitudComponent } from './ui/detalle-solicitud.component';
import { MedidorTabla } from './ui/medidor-tabla';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { CALCULO, DETALLE_SUB, enPalabras } from './ui/solicitud-clases';
import { VisorCertificadoComponent } from './ui/visor-certificado.component';

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
const hhmm = (h: string): string => h.slice(0, 5);

type Grupo = 'apr' | 'ok' | 'no';

const ESTADO: Record<string, [string, TonoPill]> = {
  PENDIENTE: ['Por revisar', 'am'], REVISADA: ['Por aprobar', 'info'], APROBADA: ['Aprobada', 'ok'], RECHAZADA: ['Rechazada', 'ro']
};

/** Las que ya pasaron por la supervisora: las que RR.HH. aprueba y las que resolvió. */
const esDeRrhh = (j: Justificacion): boolean =>
  j.estado === 'REVISADA' || j.estado === 'APROBADA' || (j.estado === 'RECHAZADA' && !!j.resueltaEn);

/**
 * Solicitudes de Control de asistencia: lo que RR.HH. aprueba. Por aprobar, aprobadas y rechazadas; cada
 * una se abre en su fila con su detalle, lo que deja por recuperar y, si espera, aprobar o rechazar. El
 * certificado se ve en la columna de la derecha, junto a la lista.
 */
@Component({
  selector: 'app-control-solicitudes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, NombrePropioPipe, PiePaginaComponent, DetalleSolicitudComponent,
            DecidirSolicitudComponent, VisorCertificadoComponent],
  template: `
    <div [class]="REJILLA + (conCertificado() ? ' grid-cols-[minmax(0,1fr)_min(calc(28cqw_-_.42rem),22rem)]' : ' grid-cols-[minmax(0,1fr)]')">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />
        <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
          <div class="flex flex-wrap gap-[.375rem]">
            @for (g of GRUPOS; track g.clave) {
              <button type="button" [class]="PF" [style.--t]="g.t" [style.--t-bg]="g.bg" [attr.aria-pressed]="grupo() === g.clave" (click)="elegirGrupo(g.clave)">
                {{ g.texto }}<i class="font-semibold not-italic text-muted-foreground group-aria-pressed:text-(--t)">{{ cuenta(g.clave) }}</i>
              </button>
            }
          </div>
        </div>

        <div #zona [class]="ZONA">
          @if (cargando() && !todas().length) {
            <div [class]="VACIO">Cargando…</div>
          } @else if (!lista().length) {
            <div [class]="VACIO">Sin solicitudes</div>
          } @else {
            <div class="flex flex-[1_0_auto] flex-col">
              <div #caja [class]="TABLA_CAJA">
                <table [class]="TABLA">
                  <thead [class]="THEAD"><tr [class]="TR">
                    @if (conCertificado()) {
                      <th [class]="TH">Asesor</th><th [class]="TH">Tipo</th><th [class]="TH">Estado</th><th [class]="TH"></th>
                    } @else {
                      <th [class]="TH">Asesor</th><th [class]="TH">Tipo</th><th [class]="TH">Días</th><th [class]="TH">Revisó</th>
                      <th [class]="TH + ' text-right!'">Por recuperar</th><th [class]="TH">Estado</th><th [class]="TH"></th>
                    }
                  </tr></thead>
                  <tbody>
                    @for (s of paginaLista(); track s.id) {
                      @let abierta = abiertaId() === s.id;
                      @let e = estado(s);
                      <tr [class]="TR + ' ' + TR_ABRE + (abierta || certificado() === s.id ? TR_ELEGIDA : '')" (click)="abrir(s)" [attr.aria-expanded]="abierta">
                        <td [class]="celda(abierta, true)"><span [class]="FUERTE">{{ s.nombreAgente }}</span><span [class]="SEC">{{ s.subcartera | nombrePropio }}</span></td>
                        @if (conCertificado()) {
                          <td [class]="celda(abierta)">{{ s.tipo }}<span [class]="SEC">{{ dias(s) }}</span></td>
                        } @else {
                          <td [class]="celda(abierta)">{{ s.tipo }}@if (porHoras(s)) {<span [class]="SEC">Por horas</span>}</td>
                          <td [class]="celda(abierta)">{{ dias(s) }}</td>
                          <td [class]="celda(abierta)">{{ s.revisadaPor || '—' }}</td>
                          <td [class]="celda(abierta) + ' text-right!'">{{ deudas()[s.id] ? enHoras(deudas()[s.id]!) : '—' }}</td>
                        }
                        <td [class]="celda(abierta)"><span [class]="PILL[e[1]]">{{ e[0] }}</span></td>
                        <td [class]="celda(abierta) + ' w-8 pr-1! text-right!'">
                          <lucide-angular name="chevron-right" [size]="16" class="inline-flex text-muted-foreground transition-transform duration-200" [class.rotate-90]="abierta"></lucide-angular>
                        </td>
                      </tr>
                      @if (abierta) {
                        <tr [class]="TR">
                          <td [attr.colspan]="conCertificado() ? 4 : 7" class="border-0! border-b! border-solid! border-(--line2)! pt-0! pr-0! pb-5! pl-[calc(.625rem+1px)]! whitespace-normal!">
                            <app-detalle-solicitud [solicitud]="s" [segunda]="segunda()" [aviso]="avisoTele()" [certificadoAbierto]="certificado() === s.id" (certificado)="alternarCertificado(s)">
                              @if (deudas()[s.id]) {
                                <div [class]="CALCULO"><span class="text-muted-foreground">{{ s.estado === 'APROBADA' ? 'Abrió una deuda de' : 'Al aprobarla quedan por recuperar' }}</span><b class="font-bold">{{ enPalabras(deudas()[s.id]!) }}</b></div>
                              }
                              @if (s.motivoResolucion) { <p [class]="DETALLE_SUB">Motivo: {{ s.motivoResolucion }}</p> }
                              @if (s.estado === 'REVISADA' && !s.semanaCerrada) {
                                <app-decidir-solicitud id="ca-motivo" textoSi="Aprobar" [guardando]="guardando()" [error]="error()" (si)="decidir(s, true, $event)" (no)="decidir(s, false, $event)" />
                              }
                            </app-detalle-solicitud>
                          </td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
              <app-pie-pagina [total]="lista().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="pagina.set($event)" />
            </div>
          }
        </div>
      </section>
      @if (conCertificado()) {
        <div class="flex min-h-0 min-w-0 flex-col self-stretch">
          <app-visor-certificado [archivo]="visor.abierto()" [cargando]="visor.cargando()" [nombre]="nombreCertificado()" (cerrar)="cerrarCertificado()" />
        </div>
      }
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="cuenta('apr') ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ cuenta('apr') === 1 ? '1 solicitud por aprobar' : cuenta('apr') + ' solicitudes por aprobar' }}</span>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="excel()">
        <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel
      </button>
    </div>
  `
})
export class ControlSolicitudesComponent implements OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  readonly cabecera = input.required<TemplateRef<unknown>>();
  readonly ambito = input.required<AmbitoAsistencia>();
  readonly subcartera = input<string | null>(null);
  readonly lunes = input.required<string>();
  /** Se resolvió alguna: el contenedor vuelve a contar las que esperan. */
  readonly cambio = output<void>();

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH;
  protected readonly SEC = SEC; protected readonly FUERTE = FUERTE; protected readonly PILL = PILL; protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO;
  protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY; protected readonly TR_ABRE = TR_ABRE; protected readonly TR_ELEGIDA = TR_ELEGIDA; protected readonly BOTON_SEC = BOTON_SEC;
  protected readonly CALCULO = CALCULO; protected readonly DETALLE_SUB = DETALLE_SUB; protected readonly enHoras = enHoras; protected readonly enPalabras = enPalabras;
  /** Píldora que filtra: borde gris; elegida, del color de su grupo. */
  protected readonly PF = 'group inline-flex cursor-pointer items-center gap-2 rounded-full border border-solid border-border bg-transparent py-[.3125rem] pr-3 pl-[.625rem] [font-family:inherit] '
    + 'text-[.8125rem] leading-[1.5] font-semibold text-(--ink2) transition-colors duration-150 hover:border-[color-mix(in_oklab,var(--t)_40%,var(--border))] '
    + 'hover:bg-[color-mix(in_oklab,var(--t)_6%,transparent)] aria-pressed:border-(--t) aria-pressed:bg-(--t-bg) aria-pressed:text-(--t)';
  protected readonly GRUPOS: { clave: Grupo; texto: string; t: string; bg: string }[] = [
    { clave: 'apr', texto: 'Por aprobar', t: 'var(--am)', bg: 'var(--am-bg)' },
    { clave: 'ok', texto: 'Aprobadas', t: 'var(--ok)', bg: 'var(--ok-bg)' },
    { clave: 'no', texto: 'Rechazadas', t: 'var(--ro)', bg: 'var(--ro-bg)' }
  ];

  readonly todas = signal<Justificacion[]>([]);
  readonly cargando = signal(false);
  /** La gente del ámbito; null con «Todos». */
  readonly gente = signal<Set<number> | null>(null);
  readonly grupo = signal<Grupo>('apr');
  readonly pagina = signal(1);
  readonly abiertaId = signal<number | null>(null);
  readonly guardando = signal(false);
  readonly error = signal('');
  /** Lo que cada solicitud deja por recuperar, por id: se pide para las que se ven. */
  readonly deudas = signal<Record<number, number | null>>({});
  readonly segunda = signal('');
  readonly avisoTele = signal('');
  readonly certificado = signal<number | null>(null);
  protected readonly visor = new Visor();

  private readonly medidor = new MedidorTabla(() => ({
    // Con una fila abierta no se vuelve a medir: el panel no es una fila más.
    zona: this.zona?.nativeElement, caja: this.abiertaId() ? undefined : this.caja?.nativeElement, total: this.lista().length, amplia: false,
    clave: `${this.grupo()}|${this.conCertificado()}|${this.lista().length}`
  }));
  readonly porPagina = this.medidor.porPagina;

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;
  private pedidoGente = 0;

  constructor() {
    this.cargar();
    effect(() => {
      const ambito = this.ambito();
      untracked(() => this.cargarGente(ambito));
    });
    // Lo que dejan por recuperar las de la página a la vista.
    effect(() => {
      const visibles = this.paginaLista();
      untracked(() => this.pedirDeudas(visibles));
    });
  }

  ngOnDestroy(): void {
    this.medidor.cerrar();
    this.visor.cerrar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.servicio.justificaciones(sumarDias(hoy(), -90), sumarDias(hoy(), 60)).subscribe({
      next: j => { this.todas.set(j.filter(esDeRrhh)); this.cargando.set(false); },
      error: () => { this.cargando.set(false); this.toast.error('No se pudieron cargar las solicitudes'); }
    });
  }

  /** La gente del ámbito: la del reporte de hoy, que ya viene acotado al alcance. */
  private cargarGente(ambito: AmbitoAsistencia): void {
    const pedido = ++this.pedidoGente;
    this.pagina.set(1);
    if (!ambito.idCliente && !ambito.idCartera && !ambito.idSubcartera) {
      this.gente.set(null);
      return;
    }
    this.servicio.reporte(hoy(), hoy(), ambito).subscribe({
      next: r => { if (pedido === this.pedidoGente) this.gente.set(new Set(r.agentes.map(a => a.idUsuario))); },
      error: () => { if (pedido === this.pedidoGente) this.gente.set(null); }
    });
  }

  private readonly delAmbito = computed(() => {
    const gente = this.gente();
    return gente ? this.todas().filter(j => gente.has(j.idUsuario)) : this.todas();
  });

  private enGrupo(j: Justificacion, g: Grupo): boolean {
    return g === 'apr' ? j.estado === 'REVISADA' : g === 'ok' ? j.estado === 'APROBADA' : j.estado === 'RECHAZADA';
  }

  cuenta(g: Grupo): number {
    return this.delAmbito().filter(j => this.enGrupo(j, g)).length;
  }

  readonly lista = computed(() => this.delAmbito().filter(j => this.enGrupo(j, this.grupo()))
    .sort((a, b) => a.fechaDesde.localeCompare(b.fechaDesde)));
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.lista().length / this.porPagina()))));
  readonly paginaLista = computed(() => {
    const ini = (this.paginaActual() - 1) * this.porPagina();
    return this.lista().slice(ini, ini + this.porPagina());
  });

  readonly conCertificado = computed(() => !!this.certificado() && this.lista().some(s => s.id === this.certificado()));
  readonly nombreCertificado = computed(() => this.todas().find(s => s.id === this.certificado())?.archivoNombre || 'Certificado');

  elegirGrupo(g: Grupo): void {
    this.grupo.set(g);
    this.pagina.set(1);
    this.abiertaId.set(null);
    this.cerrarCertificado();
  }

  private pedirDeudas(visibles: Justificacion[]): void {
    for (const s of visibles) {
      if (s.id in this.deudas() || !(s.recuperable || s.remotoDesde)) continue;
      this.deudas.update(d => ({ ...d, [s.id]: null }));
      this.servicio.deudaDe(s.id).subscribe({
        next: d => this.deudas.update(m => ({ ...m, [s.id]: d.seRecupera && d.minutos ? d.minutos : null })),
        error: () => { /* sin la cifra, la columna dice «—» */ }
      });
    }
  }

  abrir(s: Justificacion): void {
    if (this.abiertaId() === s.id) {
      this.abiertaId.set(null);
      return;
    }
    this.abiertaId.set(s.id);
    this.error.set('');
    this.segunda.set('');
    this.avisoTele.set('');
    const tele = !!(s.remotoDesde && s.remotoHasta && s.oficinaDesde && s.oficinaHasta);
    // El horario de ese día y, en el teletrabajo por horas, lo que no cubre: como lo calcula el backend.
    this.servicio.solicitudPrevista({
      idTipoDia: s.idTipoDia, fechaDesde: s.fechaDesde, fechaHasta: tele ? s.fechaHasta : s.fechaDesde, idUsuario: s.idUsuario, idSolicitud: s.id,
      ...(tele ? { oficinaDesde: hhmm(s.oficinaDesde!), oficinaHasta: hhmm(s.oficinaHasta!), remotoDesde: hhmm(s.remotoDesde!), remotoHasta: hhmm(s.remotoHasta!) } : {})
    }).subscribe({
      next: p => {
        if (this.abiertaId() !== s.id) return;
        this.segunda.set(s.tipo?.toUpperCase() === 'TELETRABAJO' ? 'Presencial'
          : p.horaEntrada && p.horaSalida ? `Horario ${hhmm(p.horaEntrada)} a ${hhmm(p.horaSalida)}` : '');
        this.avisoTele.set((p.aviso ?? '').replace('no cubres tu horario', 'no cubre su horario'));
      },
      error: () => { /* sin el horario, el detalle sigue sirviendo */ }
    });
  }

  alternarCertificado(s: Justificacion): void {
    if (this.certificado() === s.id) {
      this.cerrarCertificado();
      return;
    }
    this.certificado.set(s.id);
    this.visor.abrir(this.servicio.certificado(s.id, s.archivoNombre), s.archivoNombre, () => { /* el visor dice que no se pudo */ });
  }

  cerrarCertificado(): void {
    this.certificado.set(null);
    this.visor.cerrar();
  }

  /** Aprobar o rechazar: el segundo paso, después de la supervisora. */
  decidir(s: Justificacion, aprobada: boolean, motivo: string): void {
    this.guardando.set(true);
    this.error.set('');
    this.servicio.resolverJustificacion(s.id, aprobada, motivo).subscribe({
      next: () => {
        this.guardando.set(false);
        this.abiertaId.set(null);
        this.cerrarCertificado();
        this.toast.success(aprobada ? `Solicitud aprobada: ${s.nombreAgente}` : `Solicitud rechazada: ${s.nombreAgente}`);
        this.cargar();
        this.cambio.emit();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo guardar la decisión');
      }
    });
  }

  excel(): void {
    bajarExcel(this.servicio.excel(this.lunes(), sumarDias(this.lunes(), 5), this.ambito()), `Asistencia_${this.lunes()}.xlsx`,
      () => this.toast.error('No se pudo generar el Excel'));
  }

  estado(s: Justificacion): [string, TonoPill] {
    return ESTADO[s.estado];
  }

  porHoras(s: Justificacion): boolean {
    return !!(s.remotoDesde || s.trabajaDesde);
  }

  /** «03/11» o «10/11 al 11/11». */
  dias(s: Justificacion): string {
    return !s.fechaHasta || s.fechaHasta === s.fechaDesde ? corta(s.fechaDesde) : `${corta(s.fechaDesde)} al ${corta(s.fechaHasta)}`;
  }

  /** Con la fila abierta, sus celdas no llevan raya: el panel de abajo sigue la misma fila. */
  celda(abierta: boolean, primera = false): string {
    return (primera ? TD_1 : TD) + (abierta ? ' border-b-transparent!' : '');
  }
}
