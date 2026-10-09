import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { AgentState } from '../../../core/models/agent-status.model';
import { ESTADOS_PANEL } from '../../../features/agent-dashboard/estados-panel';
import { ThemeService } from '../../../shared/services/theme.service';
import { ToastService } from '../../../shared/services/toast.service';
import { BotonDirective } from '../../../shared/ui/boton.directive';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { TarjetaDirective } from '../../../shared/ui/tarjeta.directive';
import { CambiosUmbrales, ConfigUmbralEstado, SubcarteraUmbral, UmbralesEstadoService } from '../../services/umbrales-estado.service';

/** Lo que se configura de un estado. Los tiempos van en minutos; `NaN` mientras el campo no tiene un número. */
interface Valor {
  verde: number;
  ambar: number;
  tope: number;
  activo: boolean;
  supervisor: boolean;
  sonido: boolean;
}

/** Configuración general y, por subcartera, solo los estados que tienen la suya. */
interface Juego {
  general: Record<string, Valor>;
  propios: Record<number, Record<string, Valor>>;
}

const GENERAL = 0;

const GRUPOS: { nombre: string; estados: AgentState[] }[] = [
  { nombre: 'Operativo', estados: [AgentState.DISPONIBLE, AgentState.GESTION_MANUAL] },
  {
    nombre: 'Pausas',
    estados: [AgentState.EN_REUNION, AgentState.CAPACITACION, AgentState.REFRIGERIO, AgentState.COMIDA, AgentState.SSHH, AgentState.AUSENTE, AgentState.SOPORTE]
  },
  { nombre: 'Del sistema', estados: [AgentState.EN_LLAMADA, AgentState.TIPIFICANDO] }
];

/** Tiempos que toma un estado al activarle el tope si no tenía unos válidos. */
const TIEMPOS_INICIALES = { verde: 5, ambar: 8, tope: 10 };

const tiemposValidos = (v: Valor): boolean =>
  [v.verde, v.ambar, v.tope].every(n => Number.isFinite(n) && n > 0) && v.verde < v.ambar && v.ambar < v.tope;

/** Con el tope activo, los tres tiempos tienen que ir en orden. */
const mal = (v: Valor): boolean => v.activo && !tiemposValidos(v);

const igual = (a: Valor | undefined, b: Valor | undefined): boolean => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/**
 * Umbrales de estado: los tiempos que dibujan la escala del asesor en cada estado y a quién se avisa
 * al pasar el tope. Hay una configuración general y cada subcartera puede tener la suya solo en los
 * estados que haga falta; el resto los toma de la general.
 *
 * Con una subcartera elegida, tocar cualquier valor de un estado lo deja con configuración propia.
 * Nada se envía hasta «Guardar cambios».
 */
@Component({
  selector: 'app-umbrales-estado',
  standalone: true,
  imports: [NgClass, LucideAngularModule, PageHeaderComponent, TarjetaDirective, BotonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './umbrales-estado.component.html',
  host: { class: 'cashi-pantalla @container/umbrales flex min-h-0 flex-1 flex-col gap-3' }
})
export class UmbralesEstadoComponent implements OnInit {
  private readonly api = inject(UmbralesEstadoService);
  private readonly avisos = inject(ToastService);
  private readonly tema = inject(ThemeService);

  readonly GRUPOS = GRUPOS;

  /** Columnas de la cabecera y de cada fila. El ancho que sobra separa primero las columnas (hasta 2rem),
      después alarga la escala y al final se reparte entre ellas; en una tarjeta angosta la escala se
      retira y queda solo el sitio del botón. */
  readonly REJILLA = 'grid grid-cols-[8.75rem_minmax(7.25rem,clamp(18rem,42cqw,34rem))_9.5rem_11.75rem] items-center justify-between gap-x-[clamp(.75rem,calc(22.2cqw_-_8.24rem),2rem)] gap-y-[.25rem] px-2 '
    + '@max-[40.4rem]/tabla:grid-cols-[8.75rem_4.25rem_9.5rem_11.75rem] '
    + '@max-[37.5rem]/tabla:grid-cols-[minmax(4.5rem,8.75rem)_4.25rem_8.75rem_10.25rem] @max-[37.5rem]/tabla:gap-x-1 @max-[37.5rem]/tabla:px-1';
  readonly TIEMPOS = 'grid-cols-[repeat(3,3rem)] gap-1 @max-[37.5rem]/tabla:grid-cols-[repeat(3,2.75rem)]';
  readonly AVISOS = 'grid grid-cols-[repeat(3,3.75rem)] items-center justify-items-center gap-1 @max-[37.5rem]/tabla:grid-cols-[repeat(3,3.25rem)]';
  /** El tema antiguo fija con !important el aspecto de campos y listas: de ahí los `!`. */
  readonly CAMPO = 'font-cashi m-0! w-full rounded-lg border! bg-(--campo)! px-1! py-[.3125rem]! text-center text-[.875rem]! leading-[1.5]! text-foreground! tabular-nums outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';
  readonly LISTA = 'font-cashi m-0! h-auto! w-full rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-2! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  /** Botón de icono con estado. Encendido va teñido de verde; apagado, neutro y con el icono tachado. */
  readonly AVISO = 'grid size-7 flex-none place-items-center overflow-hidden rounded-lg border! p-0! bg-no-repeat [background-size:200%_100%] [background-position:130%_0] '
    + '[background-image:linear-gradient(110deg,transparent_38%,var(--brillo)_50%,transparent_62%)] '
    + '[transition:background-position_.7s_ease-out,scale_.7s_ease-out,background-color_.2s_ease-out,border-color_.2s_ease-out,color_.2s_ease-out] '
    + 'enabled:cursor-pointer enabled:shadow-[0_1px_2px_rgb(0_0_0/.05)] enabled:hover:[background-position:-30%_0] enabled:active:scale-[.94] enabled:active:duration-[120ms] '
    + 'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50';
  readonly AVISO_SI = 'border-(--ok-ln)! bg-(--ok-bg) text-(--ok) [--brillo:color-mix(in_srgb,var(--ok)_20%,transparent)] enabled:hover:bg-[color-mix(in_srgb,var(--ok)_16%,var(--card))]';
  readonly AVISO_NO = 'border-border! bg-card text-foreground/80 [--brillo:rgb(0_0_0/.06)] enabled:hover:bg-muted enabled:hover:text-foreground '
    + 'dark:bg-muted dark:[--brillo:rgb(255_255_255/.06)] dark:enabled:hover:bg-border';

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly guardando = signal(false);

  readonly subcarteras = signal<SubcarteraUmbral[]>([]);
  readonly cliente = signal('');
  readonly cartera = signal('');
  /** Subcartera elegida; 0 es la configuración general. */
  readonly sub = signal(GENERAL);

  private readonly guardado = signal<Juego>({ general: {}, propios: {} });
  private readonly trabajo = signal<Juego>({ general: {}, propios: {} });

  /** Cambia cuando hay que volver a crear las filas: sus campos solo toman el valor al nacer, para que
      escribir no les pise el texto a medias. */
  private readonly version = signal(0);
  private readonly versionDeFila = signal<Record<string, number>>({});
  /** Últimos tiempos válidos de cada fila: la escala no se redibuja con un orden inválido. */
  private readonly ultimaEscala = new Map<string, number[]>();

  readonly clientes = computed(() => [...new Set(this.subcarteras().map(s => s.cliente))]);
  private readonly delCliente = computed(() => this.subcarteras().filter(s => !this.cliente() || s.cliente === this.cliente()));
  readonly carteras = computed(() => [...new Set(this.delCliente().map(s => s.cartera))]);
  readonly deLaCartera = computed(() => this.delCliente().filter(s => !this.cartera() || s.cartera === this.cartera()));
  readonly porCliente = computed(() => this.clientes().map(nombre => ({ nombre, subs: this.subcarteras().filter(s => s.cliente === nombre) })));

  /** Estados de cada grupo que tienen configuración general; los que no, no se listan. */
  readonly grupos = computed(() => GRUPOS
    .map(g => ({ nombre: g.nombre, estados: g.estados.filter(e => !!this.trabajo().general[e]) }))
    .filter(g => g.estados.length));

  /** Cuántos estados cambiaron respecto de lo guardado, sumando general y subcarteras. */
  readonly cambios = computed(() => {
    const antes = this.guardado(), ahora = this.trabajo();
    let n = Object.keys(ahora.general).filter(e => !igual(antes.general[e], ahora.general[e])).length;
    for (const id of new Set([...Object.keys(antes.propios), ...Object.keys(ahora.propios)].map(Number))) {
      const a = antes.propios[id] ?? {}, b = ahora.propios[id] ?? {};
      n += [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(e => !igual(a[e], b[e])).length;
    }
    return n;
  });

  readonly hayInvalido = computed(() => {
    const t = this.trabajo();
    return [...Object.values(t.general), ...Object.values(t.propios).flatMap(p => Object.values(p))].some(mal);
  });

  readonly resumen = computed(() => {
    const n = this.cambios();
    return this.hayInvalido() ? 'Orden inválido: Verde < Ámbar < Tope' : n === 0 ? 'Sin cambios' : n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`;
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    forkJoin({ umbrales: this.api.getAll(), subcarteras: this.api.getSubcarteras() }).subscribe({
      next: r => {
        this.subcarteras.set(r.subcarteras);
        this.recibir(r.umbrales);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los umbrales');
        this.cargando.set(false);
      }
    });
  }

  // ----------------------------------------------------------------- Alcance

  elegirCliente(nombre: string): void {
    this.cliente.set(nombre);
    this.cartera.set('');
    this.fijarSub(GENERAL);
  }

  elegirCartera(nombre: string): void {
    this.cartera.set(nombre);
    this.fijarSub(GENERAL);
  }

  /** Elegir una subcartera deja también su cliente y su cartera en el filtro. */
  elegirSub(id: number | string, desdeLista = false): void {
    const s = this.subcarteras().find(x => x.idSubcartera === Number(id));
    if (s) {
      this.cliente.set(s.cliente);
      this.cartera.set(s.cartera);
    } else if (desdeLista) {
      this.cliente.set('');
      this.cartera.set('');
    }
    this.fijarSub(s ? s.idSubcartera : GENERAL);
  }

  private fijarSub(id: number): void {
    this.sub.set(id);
    this.version.update(n => n + 1);
  }

  /** Nombre en la lista del filtro: con el cliente cuando dos subcarteras se llaman igual. */
  rotuloSub(s: SubcarteraUmbral): string {
    return this.deLaCartera().filter(x => x.subcartera === s.subcartera).length > 1 ? `${s.subcartera} · ${s.cliente}` : s.subcartera;
  }

  personalizada(id: number): boolean {
    return Object.keys(this.trabajo().propios[id] ?? {}).length > 0;
  }

  // ----------------------------------------------------------------- Filas

  /** Lo que rige para el estado en el alcance elegido. */
  valor(e: string): Valor {
    const t = this.trabajo();
    return t.propios[this.sub()]?.[e] ?? t.general[e];
  }

  clave(e: string): string {
    return `${e}#${this.version()}#${this.versionDeFila()[e] ?? 0}`;
  }

  ficha(e: AgentState) {
    return ESTADOS_PANEL[e];
  }

  tinta(e: AgentState): string {
    const f = ESTADOS_PANEL[e];
    return this.tema.isDarkMode() ? f.oscuro ?? f.tono : f.tinta ?? f.tono;
  }

  mal(e: string): boolean {
    return mal(this.valor(e));
  }

  /** Hay algo que revertir: en una subcartera, que el estado tenga lo suyo; en General, cambios sin guardar. */
  revertible(e: string): boolean {
    const t = this.trabajo();
    return this.sub() ? !!t.propios[this.sub()]?.[e] : !igual(this.guardado().general[e], t.general[e]);
  }

  /** Anchos de los tres tramos de la escala, en porcentaje. Vacío si el estado no tiene tope. */
  tramos(e: string): number[] {
    const v = this.valor(e), llave = `${this.sub()}:${e}`;
    if (!v.activo) {
      return [];
    }
    if (tiemposValidos(v)) {
      this.ultimaEscala.set(llave, [v.verde / v.tope * 100, (v.ambar - v.verde) / v.tope * 100, (v.tope - v.ambar) / v.tope * 100]);
    }
    return this.ultimaEscala.get(llave) ?? [];
  }

  escribir(e: string, campo: 'verde' | 'ambar' | 'tope', texto: string): void {
    this.modificar(e, v => ({ ...v, [campo]: parseFloat(texto) }));
  }

  alternarTope(e: string): void {
    const antes = this.valor(e);
    this.modificar(e, v => v.activo ? { ...v, activo: false } : { ...v, ...(tiemposValidos(v) ? {} : TIEMPOS_INICIALES), activo: true });
    // Si tomó los tiempos iniciales, los campos se crean de nuevo para mostrarlos.
    if (!antes.activo && !tiemposValidos(antes)) {
      this.renovarFila(e);
    }
  }

  alternar(e: string, campo: 'supervisor' | 'sonido'): void {
    if (this.valor(e).activo) {
      this.modificar(e, v => ({ ...v, [campo]: !v[campo] }));
    }
  }

  revertir(e: string): void {
    const id = this.sub();
    this.trabajo.update(t => {
      if (!id) {
        return { ...t, general: { ...t.general, [e]: this.guardado().general[e] } };
      }
      const { [e]: _, ...resto } = t.propios[id] ?? {};
      const { [id]: __, ...otros } = t.propios;
      return { ...t, propios: Object.keys(resto).length ? { ...otros, [id]: resto } : otros };
    });
    this.renovarFila(e);
  }

  /** Aplica un cambio al estado en el alcance elegido. En una subcartera, el estado pasa a tener lo suyo. */
  private modificar(e: string, cambio: (v: Valor) => Valor): void {
    const id = this.sub();
    this.trabajo.update(t => {
      if (!id) {
        return { ...t, general: { ...t.general, [e]: cambio(t.general[e]) } };
      }
      const propios = t.propios[id] ?? {};
      return { ...t, propios: { ...t.propios, [id]: { ...propios, [e]: cambio(propios[e] ?? t.general[e]) } } };
    });
  }

  private renovarFila(e: string): void {
    this.versionDeFila.update(v => ({ ...v, [e]: (v[e] ?? 0) + 1 }));
  }

  // ----------------------------------------------------------------- Guardar

  descartar(): void {
    this.trabajo.set(this.guardado());
    this.version.update(n => n + 1);
  }

  guardar(): void {
    if (!this.cambios() || this.hayInvalido() || this.guardando()) {
      return;
    }
    this.guardando.set(true);
    this.api.guardar(this.diferencia()).subscribe({
      next: umbrales => {
        this.recibir(umbrales);
        this.guardando.set(false);
        this.avisos.success('Umbrales guardados.');
      },
      error: err => {
        this.guardando.set(false);
        this.avisos.error(err?.error?.error || 'No se pudieron guardar los umbrales');
      }
    });
  }

  private diferencia(): CambiosUmbrales {
    const antes = this.guardado(), ahora = this.trabajo();
    const fila = (estado: string, idSubcartera: number, v: Valor) => {
      const validos = tiemposValidos(v);
      return {
        estado, idSubcartera,
        umbralVerdeSegundos: validos ? Math.round(v.verde * 60) : null,
        umbralAmarilloSegundos: validos ? Math.round(v.ambar * 60) : null,
        tiempoMaximoSegundos: validos ? Math.round(v.tope * 60) : null,
        alertaSupervisor: v.supervisor, sonidoAlerta: v.sonido, activo: v.activo
      };
    };
    const cambios: CambiosUmbrales = { guardar: [], quitar: [] };
    for (const [e, v] of Object.entries(ahora.general)) {
      if (!igual(antes.general[e], v)) {
        cambios.guardar.push(fila(e, GENERAL, v));
      }
    }
    for (const id of new Set([...Object.keys(antes.propios), ...Object.keys(ahora.propios)].map(Number))) {
      const a = antes.propios[id] ?? {}, b = ahora.propios[id] ?? {};
      for (const e of new Set([...Object.keys(a), ...Object.keys(b)])) {
        if (!b[e]) {
          cambios.quitar.push({ estado: e, idSubcartera: id });
        } else if (!igual(a[e], b[e])) {
          cambios.guardar.push(fila(e, id, b[e]));
        }
      }
    }
    return cambios;
  }

  private recibir(umbrales: ConfigUmbralEstado[]): void {
    const juego: Juego = { general: {}, propios: {} };
    const minutos = (segundos: number) => +(segundos / 60).toFixed(2);
    for (const u of umbrales) {
      const v: Valor = {
        verde: minutos(u.umbralVerdeSegundos), ambar: minutos(u.umbralAmarilloSegundos), tope: minutos(u.tiempoMaximoSegundos),
        activo: !!u.activo, supervisor: !!u.alertaSupervisor, sonido: !!u.sonidoAlerta
      };
      if (!u.idSubcartera) {
        juego.general[u.estado] = v;
      } else {
        (juego.propios[u.idSubcartera] ??= {})[u.estado] = v;
      }
    }
    this.guardado.set(juego);
    this.trabajo.set(juego);
    this.ultimaEscala.clear();
    this.version.update(n => n + 1);
  }
}
