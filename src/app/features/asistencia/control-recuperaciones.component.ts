import { ChangeDetectionStrategy, Component, TemplateRef, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import { AmbitoAsistencia, BloquePlan, DeudaEquipoPlan, DiaPlan, PlanEquipoPedido, PlanSemana } from './asistencia.models';
import { hoy, lunesDe, sumarDias } from './asistencia.estilos';
import { AVATARES_PERSONAL } from './avatares-personal';
import { BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, PILL, PRINCIPAL, REJILLA, VACIO, ZONA } from './ui/clases';
import { AVATAR, MINI, tonoSubcartera } from './ui/ficha-clases';
import { BOTON_APAGADO, BOTON_SEC, rangoSemana } from './ui/control-comun';
import { DIAS_CORTOS } from './ui/semana-celdas';

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const aMin = (h: string | null | undefined): number => (h ? Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5)) : 0);
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/** Una fila de la línea de tiempo: una persona que debe horas, o el plan del equipo de un mes. */
interface FilaPlan {
  clave: string;
  /** El plan al que pertenece: el de la persona o el del equipo de ese mes. */
  idUsuario: number | null;
  mes: string | null;
  nombre: string;
  linea: string;
  total: number;
  recuperado: number;
}

/**
 * Recuperaciones: la semana como línea de tiempo. Una fila por persona que debe horas (y una por cada plan
 * del equipo, cuando se deben días sin asignación), una casilla por día con lo planificado y el avance al
 * final. Se suma de 30 en 30, se ajusta de 15 en 15 y se guarda desde la barra de abajo.
 */
@Component({
  selector: 'app-control-recuperaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective],
  template: `
    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)]'">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />
        @if (!ambito().idSubcartera) {
          <div [class]="ZONA"><div [class]="VACIO">Elige una subcartera en el filtro</div></div>
        } @else {
          <div class="mb-[.75rem] flex min-w-0 flex-none flex-wrap items-center gap-x-3 gap-y-2">
            <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI + ' h-[2.375rem]!'" (click)="moverSemana(-7)" aria-label="Semana anterior"><lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular></button>
            <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI + ' h-[2.375rem]!'" (click)="moverSemana(7)" aria-label="Semana siguiente"><lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular></button>
            <span class="text-[1rem] font-bold">{{ mesTitulo() }}</span>
            <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI + ' h-[2.375rem]!'" (click)="irAHoy()">Hoy</button>
            <span [class]="PILL[estado()[1]]">{{ estado()[0] }}</span>
            <span class="text-[.75rem] text-muted-foreground">Semana del {{ rangoLunes() }}</span>
          </div>

          <div [class]="ZONA">
            @if (cargando() && !plan()) {
              <div [class]="VACIO">Cargando…</div>
            } @else if (!filas().length) {
              <div class="flex flex-[1_0_auto] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center">
                <span class="text-[.9375rem] font-semibold text-foreground">Nadie de {{ subcartera() }} debe horas</span>
                <span class="max-w-[28rem] text-[.8125rem] text-muted-foreground">Cuando se aprueba un permiso que se recupera, la persona aparece aquí para repartir sus horas en la semana.</span>
                <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI + ' mt-[.25rem]'" (click)="irA.emit('base')">Ver el horario base</button>
              </div>
            } @else {
              <div class="@container/lt5 flex flex-col overflow-hidden rounded-[.75rem] border border-(--line2)">
                <div [class]="COLS">
                  <div [class]="CAB_EXTREMO">Asesor</div>
                  @for (d of dias(); track d.fecha) {
                    <div class="flex min-h-[3.25rem] flex-col items-center justify-center gap-px border-b border-l border-(--line2) px-3 py-2 text-[.75rem] text-muted-foreground">
                      <span class="text-[.8125rem] font-bold" [class]="d.fecha === hoyTexto ? 'text-primary' : d.fecha < hoyTexto ? 'text-muted-foreground' : 'text-foreground'">{{ DIAS_CORTOS[diaDe(d.fecha)] }} {{ +d.fecha.slice(8, 10) }}</span>
                      <small class="text-[.6875rem]">{{ lineaDia(d) }}</small>
                    </div>
                  }
                  <div [class]="CAB_EXTREMO + ' items-start! border-l border-(--line2) pl-4! text-left!'">Avance</div>
                </div>
                @for (f of filas(); track f.clave; let primera = $first) {
                  @let planeado = planeadoSemana(f);
                  @let falta = faltaDe(f);
                  <div [class]="COLS + ' min-h-24' + (primera ? '' : ' [&>*]:border-t [&>*]:border-(--line2)')">
                    <div class="flex min-w-0 items-center gap-[.625rem] px-4 py-3">
                      @if (f.idUsuario != null) {
                        <span [class]="AVATAR + ' size-9 @max-[62.001rem]/lt5:hidden'" [style.color]="tono()" [innerHTML]="avatar(f.idUsuario)" aria-hidden="true"></span>
                      } @else {
                        <span class="inline-grid size-9 flex-none place-items-center rounded-full bg-muted text-muted-foreground @max-[62.001rem]/lt5:hidden" aria-hidden="true"><lucide-angular name="users" [size]="16" class="flex"></lucide-angular></span>
                      }
                      <div class="flex min-w-0 flex-col gap-[.125rem]">
                        <span class="truncate text-[.8125rem] font-semibold text-foreground">{{ f.nombre }}</span>
                        <small class="text-[.6875rem] text-muted-foreground">{{ f.linea }}</small>
                      </div>
                    </div>
                    @for (d of dias(); track d.fecha) {
                      @let m = minutos(f, d.fecha);
                      @let futuro = d.fecha > hoyTexto;
                      @if (d.noLaborable) {
                        <div class="flex min-h-24 min-w-0 flex-col items-center justify-center border-l border-(--line2) bg-[color-mix(in_oklab,var(--ro-bg)_55%,var(--card))] p-[.625rem] text-[.6875rem] text-(--ro) @max-[62.001rem]/lt5:p-2">
                          <small>{{ d.noLaborable }}</small>
                        </div>
                      } @else if (m) {
                        <div class="flex min-h-24 min-w-0 flex-col justify-center border-l border-(--line2) p-[.625rem] @max-[62.001rem]/lt5:p-2">
                          <div [class]="'flex min-h-[4.25rem] flex-col justify-center gap-1 rounded-[.5rem] border bg-(--am-bg) px-[.625rem] py-2 @max-[62.001rem]/lt5:p-2 ' + (pendiente(f, d.fecha) ? 'border-dashed border-(--am-pt)' : 'border-solid border-[color-mix(in_oklab,var(--am-pt)_35%,var(--card))]')">
                            <div class="h-[.375rem] overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--am-pt)_20%,var(--card))]" [title]="'Tope del día: ' + palabras(tope(d))">
                              <i class="block h-full rounded-full bg-(--am-pt)" [style.width.%]="m / tope(d) * 100 > 100 ? 100 : m / tope(d) * 100"></i>
                            </div>
                            <span class="truncate text-[.75rem] font-semibold text-foreground @max-[62.001rem]/lt5:whitespace-normal">{{ enHoras(inicio(d)) }} – {{ enHoras(inicio(d) + m) }}</span>
                            <span class="text-[.6875rem] text-(--am)">+{{ m }} min</span>
                            @if (futuro) {
                              <div class="-mr-1 -mb-1 ml-auto flex">
                                <button type="button" [class]="AC" (click)="ajustar(f, d, -15)" aria-label="15 minutos menos" title="15 minutos menos"><lucide-angular name="minus" [size]="13" class="flex"></lucide-angular></button>
                                <button type="button" [class]="AC" (click)="ajustar(f, d, 15)" aria-label="15 minutos más" title="15 minutos más"><lucide-angular name="plus" [size]="13" class="flex"></lucide-angular></button>
                                <button type="button" [class]="AC" (click)="poner(f, d.fecha, 0)" aria-label="Quitar" title="Quitar"><lucide-angular name="x" [size]="13" class="flex"></lucide-angular></button>
                              </div>
                            }
                          </div>
                        </div>
                      } @else if (futuro && falta) {
                        <div class="flex min-h-24 min-w-0 flex-col justify-center border-l border-(--line2) p-[.625rem] @max-[62.001rem]/lt5:p-2">
                          <button type="button" [class]="AGREGAR" (click)="ajustar(f, d, 30)" [attr.aria-label]="'Sumar 30 minutos el ' + DIAS_CORTOS[diaDe(d.fecha)] + ' ' + corta(d.fecha)">
                            <lucide-angular name="plus" [size]="14" class="flex"></lucide-angular>30 min
                          </button>
                        </div>
                      } @else {
                        <div class="min-h-24 min-w-0 border-l border-(--line2) p-[.625rem]"></div>
                      }
                    }
                    <div class="flex min-w-0 flex-col items-stretch justify-center gap-[.4375rem] border-l border-(--line2) px-4 py-3 text-left">
                      <div class="text-[.75rem] whitespace-nowrap text-muted-foreground"><span class="text-[.875rem] font-bold text-foreground">{{ enHoras(f.recuperado + planeado) }}</span> de {{ enHoras(f.total) }}</div>
                      <div class="h-[.375rem] overflow-hidden rounded-full bg-(--line2)" role="img" [attr.aria-label]="enHoras(f.recuperado + planeado) + ' de ' + enHoras(f.total)">
                        <i class="block h-full rounded-full" [class]="falta ? 'bg-(--am-pt)' : 'bg-(--ok-pt)'" [style.width.%]="f.total ? (f.recuperado + planeado) / f.total * 100 > 100 ? 100 : (f.recuperado + planeado) / f.total * 100 : 100"></i>
                      </div>
                      <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-[.125rem]">
                        <em class="text-[.6875rem] font-semibold not-italic" [class]="falta ? 'text-(--am)' : 'text-(--ok)'">{{ falta ? 'Falta ' + enHoras(falta) : 'Completo' }}</em>
                        @if (falta) {
                          <button type="button" class="inline-flex cursor-pointer items-center gap-1 self-start border-0! bg-transparent p-0! [font-family:inherit] text-[.75rem] font-semibold text-primary hover:underline hover:underline-offset-[3px]" [disabled]="guardando()" (click)="proponer(f)">Proponer</button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      @if (!ambito().idSubcartera) {
        <span [class]="BARRA_ESTADO">Sin subcartera elegida</span>
      } @else {
        <span [class]="cambios() ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ cambios() ? (cambios() === 1 ? '1 cambio sin guardar' : cambios() + ' cambios sin guardar') : 'Sin cambios' }}</span>
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC + ' ' + BOTON_APAGADO" [disabled]="!cambios() || guardando()" (click)="descartar()">Descartar</button>
        <button type="button" appBoton [class]="'px-4! ' + BOTON_APAGADO" [disabled]="!cambios() || guardando()" (click)="guardar()">
          <lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Guardar cambios
        </button>
      }
    </div>
  `
})
export class ControlRecuperacionesComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly cabecera = input.required<TemplateRef<unknown>>();
  readonly ambito = input.required<AmbitoAsistencia>();
  readonly subcartera = input<string | null>(null);
  readonly lunes = input.required<string>();
  /** La semana a la vista, para el subtítulo de la cabecera. */
  readonly semana = output<string>();
  /** Lleva a otra parte de la pantalla: «base» es el horario base en Configuración. */
  readonly irA = output<string>();

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly PILL = PILL; protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY;
  protected readonly MINI = MINI; protected readonly AVATAR = AVATAR; protected readonly BOTON_SEC = BOTON_SEC;
  protected readonly BOTON_APAGADO = BOTON_APAGADO; protected readonly DIAS_CORTOS = DIAS_CORTOS; protected readonly enHoras = enHoras; protected readonly corta = corta;
  protected readonly hoyTexto = hoy();
  /** Las columnas: la persona, los seis días y el avance; más angostas si la tarjeta lo es. */
  protected readonly COLS = 'grid grid-cols-[minmax(12rem,1.5fr)_repeat(6,minmax(0,1fr))_minmax(11rem,1.25fr)] @max-[62.001rem]/lt5:grid-cols-[minmax(9rem,1.1fr)_repeat(6,minmax(0,1fr))_minmax(7.5rem,.9fr)]';
  protected readonly CAB_EXTREMO = 'flex min-h-[3.25rem] flex-col items-center justify-center border-b border-(--line2) px-3 py-2 text-center text-[.6875rem] font-semibold tracking-[.04em] text-muted-foreground uppercase';
  /** Las acciones de un bloque: botones chicos sin caja. */
  protected readonly AC = 'inline-flex size-[1.375rem] cursor-pointer items-center justify-center rounded-[.375rem] border-0! bg-transparent p-0! text-muted-foreground hover:bg-[color-mix(in_oklab,var(--am-pt)_18%,transparent)] hover:text-(--am)';
  protected readonly AGREGAR = 'flex min-h-[4.25rem] w-full cursor-pointer flex-row items-center justify-center gap-1 rounded-[.5rem] border border-dashed border-border bg-transparent px-[.625rem] py-2 '
    + '[font-family:inherit] text-[.75rem] font-medium text-muted-foreground transition-colors duration-150 hover:border-(--am-pt) hover:bg-(--am-bg) hover:text-(--am) @max-[62.001rem]/lt5:p-2';

  readonly semanaVista = signal(sumarDias(lunesDe(new Date()), 7));
  readonly plan = signal<PlanSemana | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  /** Lo cambiado y sin guardar, por plan: «p:12» de una persona, «e:2026-10» del equipo de un mes. Fecha → minutos. */
  readonly borrador = signal<Record<string, Record<string, number>>>({});
  private pedido = 0;
  private readonly avatares: SafeHtml[] = AVATARES_PERSONAL.map(a => this.sanitizer.bypassSecurityTrustHtml(a));

  constructor() {
    effect(() => this.semana.emit(this.semanaVista()));
    effect(() => {
      const sub = this.ambito().idSubcartera, lunes = this.semanaVista();
      untracked(() => this.cargar(lunes, sub ?? null));
    });
  }

  private cargar(lunes: string, sub: number | null): void {
    const pedido = ++this.pedido;
    if (!sub) {
      this.plan.set(null);
      return;
    }
    this.cargando.set(true);
    this.servicio.planSemana(lunes, sub).subscribe({
      next: p => { if (pedido === this.pedido) { this.plan.set(p); this.cargando.set(false); } },
      error: () => { if (pedido === this.pedido) { this.cargando.set(false); this.toast.error('No se pudo cargar el plan de la semana'); } }
    });
  }

  moverSemana(dias: number): void {
    this.semanaVista.set(sumarDias(this.semanaVista(), dias));
  }

  irAHoy(): void {
    this.semanaVista.set(lunesDe(new Date()));
  }

  readonly rangoLunes = computed(() => rangoSemana(this.semanaVista(), sumarDias));
  readonly mesTitulo = computed(() => {
    const d = new Date(this.semanaVista() + 'T00:00:00');
    return `${MESES[d.getMonth()]} ${d.getFullYear()}`;
  });
  readonly estado = computed<[string, 'ok' | 'info' | 'neu']>(() => {
    const lunes = this.semanaVista(), sabado = sumarDias(lunes, 5), h = hoy();
    return h >= lunes && h <= sabado ? ['En curso', 'ok'] : lunes > h ? ['Por planificar', 'info'] : ['Pasada', 'neu'];
  });

  /** Lunes a sábado: el sábado aunque no se trabaje, para recuperar ahí. */
  readonly dias = computed<DiaPlan[]>(() => {
    const p = this.plan();
    return [0, 1, 2, 3, 4, 5].map(i => sumarDias(this.semanaVista(), i)).map(f => p?.dias.find(d => d.fecha === f)
      ?? { fecha: f, entrada: '08:00', salida: '18:30', abierto: this.diaDe(f) === 6, noLaborable: null, horaAlmuerzo: null, minutosAlmuerzo: null, horaBreak: null, minutosBreak: null });
  });

  /** Quién debe: una fila por persona y una por cada plan del equipo. */
  readonly filas = computed<FilaPlan[]>(() => {
    const p = this.plan();
    if (!p) return [];
    const porPersona = new Map<number, FilaPlan & { vence: string }>();
    for (const d of p.deudas) {
      const ya = porPersona.get(d.idUsuario);
      if (ya) {
        ya.total += d.total;
        ya.recuperado += d.recuperado;
        if (d.vence < ya.vence) ya.vence = d.vence;
      } else {
        porPersona.set(d.idUsuario, { clave: 'p:' + d.idUsuario, idUsuario: d.idUsuario, mes: null, nombre: d.nombre, linea: '', total: d.total, recuperado: d.recuperado, vence: d.vence });
        porPersona.get(d.idUsuario)!.linea = d.origen;
      }
    }
    // Quien tiene recuperaciones esta semana aunque ya no deba aparece igual.
    for (const b of p.bloques.filter(x => !x.clave && x.minutos)) {
      if (!porPersona.has(b.idUsuario)) {
        porPersona.set(b.idUsuario, { clave: 'p:' + b.idUsuario, idUsuario: b.idUsuario, mes: null, nombre: b.nombre, linea: 'Recuperación', total: 0, recuperado: 0, vence: '' });
      }
    }
    const personas = [...porPersona.values()].map(f => ({ ...f, linea: f.linea + (f.vence ? `, vence ${corta(f.vence)}` : '') }));
    const equipos = p.equipos.map((e: DeudaEquipoPlan) => ({
      clave: 'e:' + e.clave, idUsuario: null, mes: e.clave, nombre: 'Equipo', linea: `${e.origen}${e.vence ? ', vence ' + corta(e.vence) : ''}`,
      total: e.gente[0]?.total ?? 0, recuperado: e.gente.length ? Math.min(...e.gente.map(g => g.recuperado)) : 0
    }));
    return [...personas, ...equipos];
  });

  // ---------- Lo planificado ----------

  /** Los bloques guardados de un plan, de hoy en adelante y los de esta semana. */
  private guardados(f: FilaPlan): BloquePlan[] {
    const p = this.plan();
    if (!p) return [];
    const delPlan = (b: BloquePlan) => f.mes ? b.clave === f.mes && b.equipo : !b.clave && b.idUsuario === f.idUsuario;
    const vistos = new Map<string, BloquePlan>();
    for (const b of [...p.bloques, ...p.futuros].filter(delPlan)) vistos.set(b.fecha, b);
    return [...vistos.values()];
  }

  minutos(f: FilaPlan, fecha: string): number {
    const cambio = this.borrador()[f.clave]?.[fecha];
    return cambio ?? this.guardados(f).find(b => b.fecha === fecha)?.minutos ?? 0;
  }

  pendiente(f: FilaPlan, fecha: string): boolean {
    return this.borrador()[f.clave]?.[fecha] !== undefined;
  }

  planeadoSemana(f: FilaPlan): number {
    return this.dias().reduce((t, d) => t + this.minutos(f, d.fecha), 0);
  }

  faltaDe(f: FilaPlan): number {
    return Math.max(0, f.total - f.recuperado - this.planeadoSemana(f));
  }

  /** Hasta 1 hora después de la salida; el sábado, hasta 4 horas. */
  tope(d: DiaPlan): number {
    return d.abierto || this.diaDe(d.fecha) === 6 ? 240 : 60;
  }

  /** Se recupera al salir; el sábado, desde las 09:00. */
  inicio(d: DiaPlan): number {
    return d.abierto || this.diaDe(d.fecha) === 6 ? 540 : aMin(d.salida);
  }

  poner(f: FilaPlan, fecha: string, minutos: number): void {
    const guardado = this.guardados(f).find(b => b.fecha === fecha)?.minutos ?? 0;
    this.borrador.update(todo => {
      const plan = { ...(todo[f.clave] ?? {}) };
      if (minutos === guardado) delete plan[fecha]; else plan[fecha] = minutos;
      return { ...todo, [f.clave]: plan };
    });
  }

  ajustar(f: FilaPlan, d: DiaPlan, paso: number): void {
    const actual = this.minutos(f, d.fecha), nuevo = Math.max(0, actual + paso);
    if (nuevo > this.tope(d)) {
      this.toast.error(this.diaDe(d.fecha) === 6 ? 'Ese día ya llegó a su tope: el sábado son hasta 4 horas' : 'Ese día ya llegó a su tope: hasta 1 hora después de la salida');
      return;
    }
    this.poner(f, d.fecha, nuevo);
  }

  readonly cambios = computed(() => Object.values(this.borrador()).reduce((t, p) => t + Object.keys(p).length, 0));

  descartar(): void {
    this.borrador.set({});
  }

  // ---------- Proponer y guardar ----------

  /** El plan de hoy en adelante de una fila, con lo cambiado. */
  private planDe(f: FilaPlan): { fecha: string; minutos: number }[] {
    const h = hoy(), mapa = new Map<string, number>();
    for (const b of this.guardados(f).filter(x => x.fecha >= h)) mapa.set(b.fecha, b.minutos);
    for (const [fecha, m] of Object.entries(this.borrador()[f.clave] ?? {})) mapa.set(fecha, m);
    return [...mapa].filter(([, m]) => m > 0).map(([fecha, minutos]) => ({ fecha, minutos })).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  /** El plan del equipo que se manda: el de todos y lo que cada uno debe aparte, tal como estaba. */
  private pedidoEquipo(f: FilaPlan, equipo: { fecha: string; minutos: number }[]): PlanEquipoPedido {
    const aparte: Record<number, { fecha: string; minutos: number }[]> = {};
    for (const b of (this.plan()?.futuros ?? []).filter(x => x.clave === f.mes && !x.equipo && x.fecha >= hoy())) {
      (aparte[b.idUsuario] ??= []).push({ fecha: b.fecha, minutos: b.minutos });
    }
    return { equipo, aparte };
  }

  /** Lo que propone el sistema: queda como cambio sin guardar, para revisarlo antes. */
  proponer(f: FilaPlan): void {
    const sub = this.ambito().idSubcartera;
    const aplicar = (bloques: { fecha: string; minutos: number }[]) => {
      const nuevo: Record<string, number> = {};
      const guardados = new Map(this.guardados(f).map(b => [b.fecha, b.minutos]));
      const fechas = new Set([...bloques.map(b => b.fecha), ...[...guardados.keys()].filter(x => x >= hoy())]);
      for (const fecha of fechas) {
        const m = bloques.find(b => b.fecha === fecha)?.minutos ?? 0;
        if (m !== (guardados.get(fecha) ?? 0)) nuevo[fecha] = m;
      }
      this.borrador.update(todo => ({ ...todo, [f.clave]: nuevo }));
    };
    this.guardando.set(true);
    const pedido$: Observable<{ bloques: { fecha: string; minutos: number }[]; falta: number; mensaje: string }> = f.mes && sub
      ? this.servicio.proponerEquipo(sub, f.mes, this.pedidoEquipo(f, this.planDe(f))).pipe(map(r => ({ bloques: r.equipo, falta: r.falta, mensaje: r.mensaje })))
      : this.servicio.proponerPlan(f.idUsuario!, this.planDe(f));
    pedido$.subscribe({
      next: r => {
        this.guardando.set(false);
        aplicar(r.bloques);
        if (r.falta > 0) this.toast.error(r.mensaje); else this.toast.success(r.mensaje);
      },
      error: (respuesta: { error?: { error?: string } }) => { this.guardando.set(false); this.toast.error(respuesta?.error?.error ?? 'No se pudo proponer'); }
    });
  }

  /** Guarda cada plan cambiado: el de la persona, o el del equipo de ese mes. */
  guardar(): void {
    const sub = this.ambito().idSubcartera;
    const cambiadas = this.filas().filter(f => Object.keys(this.borrador()[f.clave] ?? {}).length);
    if (!sub || !cambiadas.length) return;
    this.guardando.set(true);
    let pendientes = cambiadas.length, fallo = '';
    for (const f of cambiadas) {
      const plan = this.planDe(f);
      const guardar$ = f.mes ? this.servicio.guardarEquipo(sub, f.mes, this.pedidoEquipo(f, plan)) : this.servicio.guardarPlan(f.idUsuario!, plan);
      guardar$.subscribe({
        next: () => this.alTerminar(--pendientes, fallo),
        error: respuesta => { fallo = respuesta?.error?.error ?? `No se pudo guardar el plan de ${f.nombre}`; this.alTerminar(--pendientes, fallo); }
      });
    }
  }

  private alTerminar(pendientes: number, fallo: string): void {
    if (pendientes > 0) return;
    this.guardando.set(false);
    if (fallo) {
      this.toast.error(fallo);
      return;
    }
    this.borrador.set({});
    this.toast.success('Recuperaciones guardadas: cada asesor las ve en Mi asistencia');
    this.cargar(this.semanaVista(), this.ambito().idSubcartera ?? null);
  }

  // ---------- Apoyo ----------

  diaDe(fecha: string): number {
    return new Date(fecha + 'T00:00:00').getDay();
  }

  lineaDia(d: DiaPlan): string {
    return d.noLaborable ? d.noLaborable : d.abierto || this.diaDe(d.fecha) === 6 ? 'Opcional 09:00' : 'Sale ' + d.salida.slice(0, 5);
  }

  avatar(idUsuario: number): SafeHtml {
    return this.avatares[idUsuario % this.avatares.length];
  }

  /** El color de la subcartera elegida, para los avatares. */
  readonly tono = computed(() => tonoSubcartera(null, this.subcartera()));

  palabras(m: number): string {
    const h = Math.floor(m / 60), n = m % 60;
    return h && n ? `${h} h ${n} min` : h ? (h === 1 ? '1 hora' : `${h} horas`) : `${n} minutos`;
  }
}
