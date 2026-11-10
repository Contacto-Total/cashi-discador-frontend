import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import {
  AsistenciaDia,
  AsistenciaReporte,
  Justificacion,
  MiPlan,
  TipoDia
} from './asistencia.models';
import {
  RECUPERACION, TIPOS_DE_CALENDARIO, abrirArchivo, hoy as hoyLocal, lunesDe as lunesLocal, sumarDias as sumarDiasLocal
} from './asistencia.estilos';
import {
  BARRA, BARRA_ESTADO, CABECERA, CABECERA_TEXTO, FUERTE, PANTALLA, PILL, PRINCIPAL, REJILLA,
  SEC, SUBTITULO, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TITULO, TR, TonoPill, VACIO, VACIO_CHICO, ZONA
} from './ui/clases';
import { MINI } from './ui/ficha-clases';
import { IndicadorComponent } from './ui/indicador.component';
import { FormularioSolicitudComponent } from './ui/formulario-solicitud.component';
import {
  AVISO, BOTONES, COLUMNA, COLUMNA_TARJETA, COLUMNA_TITULO, DESLIZA, DETALLE, DETALLE_SUB, DETALLE_TEXTO, DIAS_LARGOS, FILA, INSIGNIA,
  ITEM, ITEM_BOTON, ITEM_LINEA, ITEM_PILL, ITEM_TITULO, LISTA_FILAS
} from './ui/solicitud-clases';


/** Los meses escritos, en minúscula: el navegador en es-PE da «Setiembre» con mayúscula. */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const minutosDe = (h: string | null | undefined): number => (h ? Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5)) : 0);
const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** El estado de la solicitud como lo ve quien la pidió. */
const ESTADO_SOLICITUD: Record<string, [string, TonoPill]> = {
  PENDIENTE: ['Por revisar', 'am'],
  REVISADA: ['Por aprobar', 'info'],
  APROBADA: ['Aprobada', 'ok'],
  RECHAZADA: ['Rechazada', 'ro']
};

/**
 * Mi asistencia: lo que cada persona ve de sí misma.
 *
 * Las mismas horas y el mismo cálculo que ve RR.HH., que es lo que evita la discusión de «a mí me sale
 * otra cosa». Lo que NO ve es el juicio: aquí no aparece si pierde el bono ni la comparación con nadie.
 *
 * En la columna de la derecha, sus recuperaciones y sus solicitudes; el formulario para pedir una se abre
 * en esa misma tarjeta. La revisa la supervisora y la aprueba RR.HH.
 */
@Component({
  selector: 'app-mi-asistencia',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [LucideAngularModule, TarjetaDirective, BotonDirective, IndicadorComponent, FormularioSolicitudComponent],
  template: `
    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)_min(calc(28cqw_-_.42rem),22rem)] @max-[48.001rem]/p5:grid-cols-[minmax(0,1fr)] @max-[48.001rem]/p5:grid-rows-[auto] @max-[48.001rem]/p5:overflow-y-auto'">
      <section appTarjeta [class]="PRINCIPAL + ' @max-[48.001rem]/p5:min-h-[32rem]'">
        <div [class]="CABECERA">
          <div [class]="CABECERA_TEXTO">
            <p role="heading" aria-level="1" [class]="TITULO">Mi asistencia</p>
            <p [class]="SUBTITULO">{{ subtitulo() }}</p>
          </div>
          <div class="flex min-w-0 flex-nowrap items-center gap-x-3 gap-y-2">
            @if (enTeletrabajo()) { <span [class]="INSIGNIA">Teletrabajo</span> }
            <div class="flex flex-none items-center gap-[.375rem]">
              <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI + ' h-[2.375rem]!'" (click)="moverSemana(-1)" aria-label="Semana anterior">
                <lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular>
              </button>
              <span class="min-w-[9.5rem] text-center text-[.875rem] font-semibold">{{ rangoTexto() }}</span>
              <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI + ' h-[2.375rem]!'" (click)="moverSemana(1)" [disabled]="esSemanaActual()" aria-label="Semana siguiente">
                <lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
              </button>
            </div>
            @if (!esSemanaActual()) {
              <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI + ' h-[2.375rem]!'" (click)="irAEstaSemana()">Esta semana</button>
            }
          </div>
        </div>

        <div class="mb-5 grid flex-none grid-cols-4 items-stretch gap-3 @max-[44.001rem]/p5:grid-cols-2">
          <app-indicador [valor]="horario()?.entrada ?? '—'" [unidad]="horario() ? 'a ' + horario()!.salida : ''" rotulo="Mi horario" [detalle]="pausasTexto()" />
          <app-indicador [valor]="enHoras(minutosTrabajados())" [unidad]="'de ' + enHoras(minutosJornada())" rotulo="Horas de la semana"
                         [detalle]="minutosRemotos() ? 'Remotas ' + enHoras(minutosRemotos()) : 'Todas presenciales'" />
          <app-indicador [valor]="diasTrabajados() + ' de ' + diasProgramados()" rotulo="Días registrados">
            <span [class]="'mt-[.375rem] block text-[.75rem] leading-[1.5] ' + (porCompletar() ? 'text-(--am)' : 'text-(--ink2)')">{{
              porCompletar() ? (porCompletar() === 1 ? '1 día por completar' : porCompletar() + ' días por completar') : 'Sin marcas pendientes' }}</span>
          </app-indicador>
          <app-indicador [valor]="abiertas().length" rotulo="Solicitudes abiertas" [detalle]="abiertaTexto()" />
        </div>

        <div [class]="ZONA">
          @if (filas().length) {
            <div [class]="TABLA_CAJA">
              <table [class]="TABLA + ' [&_td:last-child]:min-w-[7.5rem] [&_td:last-child]:whitespace-normal'">
                <caption class="sr-only">Mis marcas de la semana</caption>
                <thead [class]="THEAD">
                  <tr [class]="TR">
                    <th scope="col" [class]="TH">Día</th>
                    <th scope="col" [class]="TH">Entrada</th>
                    <th scope="col" [class]="TH">Almuerzo</th>
                    <th scope="col" [class]="TH">Break</th>
                    <th scope="col" [class]="TH">Salida</th>
                    <th scope="col" [class]="TH">Horas</th>
                    <th scope="col" [class]="TH">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (d of filas(); track d.fecha) {
                    @let previsto = !esSabado(d.fecha);
                    <tr [class]="TR">
                      <td [class]="TD_1"><span [class]="FUERTE">{{ nombreDia(d.fecha) }}</span><span [class]="SEC">{{ corta(d.fecha) }}</span></td>
                      <td [class]="TD">{{ d.entrada ? hhmm(d.entrada) : '—' }}
                        @if (d.entrada) {
                          @if (d.estado === 'TARDE') {
                            <span [class]="SEC_TARDE">Tarde {{ d.tardanza }}</span>
                          } @else if (d.entradaAutorizada) {
                            <span [class]="SEC">Autorizado {{ hhmm(d.entradaAutorizada) }}</span>
                          } @else if (previsto && d.horaEntradaHorario) {
                            <span [class]="SEC">Previsto {{ hhmm(d.horaEntradaHorario) }}</span>
                          }
                        }
                      </td>
                      <td [class]="TD">{{ tramo(d.almuerzoInicio, d.almuerzoFin) }}
                        @if (duracionPausa(d.almuerzoInicio, d.almuerzoFin); as m) { <span [class]="SEC">{{ m }}</span> }
                      </td>
                      <td [class]="TD">{{ tramo(d.breakInicio, d.breakFin) }}
                        @if (duracionPausa(d.breakInicio, d.breakFin); as m) { <span [class]="SEC">{{ m }}</span> }
                      </td>
                      <td [class]="TD">{{ d.salida ? hhmm(d.salida) : '—' }}
                        @if (d.salida && previsto && d.horaSalidaHorario) { <span [class]="SEC">Previsto {{ hhmm(d.horaSalidaHorario) }}</span> }
                      </td>
                      <td [class]="TD"><span [class]="FUERTE">{{ d.minutosTrabajados == null ? '—' : enHoras(d.minutosTrabajados) }}</span>
                        @if (dondeDe(d); as donde) { <span [class]="SEC">{{ donde }}</span> }
                      </td>
                      <td [class]="TD">
                        @let e = estadoDe(d);
                        <span [class]="PILL[e[1]]">{{ e[0] }}</span>
                        @if (notaDe(d); as nota) { <span [class]="SEC + ' whitespace-normal'">{{ nota }}</span> }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else if (!cargando()) {
            <div [class]="VACIO">Sin marcas en esta semana</div>
          }
        </div>
      </section>

      <div [class]="COLUMNA">
        @if (misBloques().length) {
          <section appTarjeta [class]="COLUMNA_TARJETA" aria-label="Tus recuperaciones">
            <p role="heading" aria-level="2" [class]="COLUMNA_TITULO">Tus recuperaciones</p>
            <ul [class]="LISTA_FILAS">
              @for (b of misBloques(); track b.fecha) {
                <li [class]="FILA">
                  <div [class]="ITEM">
                    <span [class]="ITEM_TITULO">{{ diaLargo(b.fecha) }}</span>
                    <small [class]="ITEM_LINEA">{{ esSabado(b.fecha) ? 'Sin hora fija' : 'Sales a las ' + enHoras(minutosDe(b.salida) + b.minutos) }}</small>
                    <span [class]="PILL.neu + ITEM_PILL">+{{ b.minutos }} min</span>
                  </div>
                </li>
              }
            </ul>
          </section>
        }

        @if (formulario()) {
          <app-formulario-solicitud [tipos]="tipos()" [editar]="editando()" [diasAVista]="dias()" [solicitudes]="solicitudes()"
                                    [enTeletrabajoDe]="teletrabajo" (cerrar)="formulario.set(false)" (listo)="alGuardar()" />
        } @else {
          <section appTarjeta [class]="COLUMNA_TARJETA" aria-label="Solicitudes">
            <p role="heading" aria-level="2" [class]="COLUMNA_TITULO">Solicitudes</p>
            <div [class]="DESLIZA">
              <ul [class]="LISTA_FILAS">
                @for (s of solicitudes(); track s.id) {
                  @let estado = estadoSolicitud(s);
                  <li [class]="FILA">
                    <button type="button" [class]="ITEM_BOTON" [attr.aria-expanded]="abierta() === s.id" (click)="abierta.set(abierta() === s.id ? null : s.id)">
                      <span [class]="ITEM_TITULO">{{ s.tipo }}</span>
                      <small [class]="ITEM_LINEA">{{ rangoSolicitud(s) }}</small>
                      <span [class]="PILL[estado[1]] + ITEM_PILL">{{ estado[0] }}</span>
                    </button>
                    @if (abierta() === s.id) {
                      <div [class]="DETALLE">
                        @if (horasSolicitud(s); as horas) { <p [class]="DETALLE_TEXTO">{{ horas }}</p> }
                        @if (s.comentario) { <p [class]="DETALLE_TEXTO">{{ s.comentario }}</p> }
                        @if (s.tieneArchivo) {
                          <button type="button" [class]="DETALLE_SUB + ' inline-flex cursor-pointer items-center gap-1 self-start border-0! bg-transparent p-0! [font-family:inherit] hover:text-foreground hover:underline'"
                                  (click)="verCertificado(s)"><lucide-angular name="paperclip" [size]="14" class="flex"></lucide-angular>{{ s.archivoNombre || 'Adjunto' }}</button>
                        }
                        @if (s.estado === 'RECHAZADA') { <p [class]="AVISO.ro">Rechazada{{ s.motivoResolucion ? ': ' + s.motivoResolucion : '' }}</p> }
                        @if (s.modificable || yaPlanificada(s)) {
                          <div [class]="BOTONES">
                            <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" [disabled]="!s.modificable" [title]="s.modificable ? '' : (s.motivoNoModificable ?? '')" (click)="abrirSolicitud(s)">
                              <lucide-angular name="pencil" [size]="14" class="flex"></lucide-angular>Modificar
                            </button>
                          </div>
                        }
                      </div>
                    }
                  </li>
                }
              </ul>
              @if (!solicitudes().length) { <div [class]="VACIO_CHICO">Sin solicitudes</div> }
            </div>
          </section>
        }
      </div>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="BARRA_ESTADO">{{ barraTexto() }}</span>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC + ' ' + BOTON_APAGADO" [disabled]="formulario()" (click)="abrirSolicitud()">Nueva solicitud</button>
    </div>
  `
})
export class MiAsistenciaComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly CABECERA = CABECERA;
  protected readonly CABECERA_TEXTO = CABECERA_TEXTO; protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO;
  protected readonly ZONA = ZONA; protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD;
  protected readonly TR = TR; protected readonly TH = TH; protected readonly TD = TD; protected readonly TD_1 = TD_1; protected readonly SEC = SEC;
  protected readonly FUERTE = FUERTE; protected readonly PILL = PILL; protected readonly VACIO = VACIO; protected readonly VACIO_CHICO = VACIO_CHICO;
  protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly MINI = MINI;
  protected readonly INSIGNIA = INSIGNIA; protected readonly COLUMNA = COLUMNA; protected readonly COLUMNA_TARJETA = COLUMNA_TARJETA;
  protected readonly COLUMNA_TITULO = COLUMNA_TITULO; protected readonly DESLIZA = DESLIZA; protected readonly LISTA_FILAS = LISTA_FILAS;
  protected readonly FILA = FILA; protected readonly ITEM = ITEM; protected readonly ITEM_BOTON = ITEM_BOTON; protected readonly ITEM_TITULO = ITEM_TITULO;
  protected readonly ITEM_LINEA = ITEM_LINEA; protected readonly ITEM_PILL = ITEM_PILL; protected readonly DETALLE = DETALLE;
  protected readonly DETALLE_TEXTO = DETALLE_TEXTO; protected readonly DETALLE_SUB = DETALLE_SUB; protected readonly AVISO = AVISO; protected readonly BOTONES = BOTONES;
  /** Secundario en oscuro: el gris de los botones, como en el artifact. */
  protected readonly BOTON_SEC = 'dark:bg-muted dark:hover:bg-border';
  /** Deshabilitado como en el molde: gris, sin el degradado ni la transparencia del botón común. */
  protected readonly BOTON_APAGADO = 'disabled:[background-image:none]! disabled:bg-muted! disabled:text-muted-foreground! disabled:opacity-100! disabled:border-transparent!';
  /** La segunda línea de la entrada cuando llegó tarde: en ámbar. */
  protected readonly SEC_TARDE = 'block text-[.75rem] leading-[1.5] font-normal text-(--am)!';

  protected readonly enHoras = enHoras;
  protected readonly minutosDe = minutosDe;

  readonly cargando = signal(false);
  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly solicitudes = signal<Justificacion[]>([]);
  /** La solicitud desplegada en la lista. */
  readonly abierta = signal<number | null>(null);
  /** Su plan de recuperación de hoy en adelante y las pausas de su horario. */
  readonly miPlan = signal<MiPlan | null>(null);
  readonly tipos = signal<TipoDia[]>([]);
  /** Si hoy trabaja en teletrabajo (su modalidad en Personal): sus horas ya son remotas. */
  readonly enTeletrabajo = signal(false);
  /** Su subcartera de hoy, para la cabecera. */
  private readonly subcartera = signal<string | null>(null);

  readonly formulario = signal(false);
  /** La solicitud que se está modificando; null al registrar una nueva. */
  readonly editando = signal<Justificacion | null>(null);


  /** El lunes de la semana que se está viendo. */
  readonly lunes = signal(this.lunesDe(new Date()));

  /** «Valeria Valdivieso, Castigo»: el primer nombre, los apellidos y su subcartera. */
  readonly subtitulo = computed(() => {
    const usuario = this.auth.getCurrentUser();
    const propio = (t: string) => /\p{Ll}/u.test(t) ? t : t.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
    const nombre = usuario
      ? [usuario.firstName?.trim().split(/\s+/)[0], usuario.lastName?.trim()].filter(Boolean).join(' ') || usuario.username
      : '';
    const sub = this.subcartera();
    return [nombre && propio(nombre), sub && propio(sub)].filter(Boolean).join(', ');
  });

  readonly dias = computed<AsistenciaDia[]>(() => this.reporte()?.dias ?? []);

  /** Hasta hoy, de lunes a viernes, y el sábado solo si trabajó: es opcional y sin marcas no dice nada. */
  readonly filas = computed(() => this.dias().filter(d => {
    const dia = new Date(d.fecha + 'T00:00:00').getDay();
    return d.fecha <= this.hoy() && dia !== 0 && (dia !== 6 || !!d.entrada);
  }));

  readonly semana = computed(() => (this.reporte()?.semanas ?? [])[0] ?? null);
  readonly minutosTrabajados = computed(() => this.semana()?.minutosTrabajados ?? 0);
  readonly minutosJornada = computed(() => this.semana()?.minutosJornada ?? 0);
  readonly minutosRemotos = computed(() => this.semana()?.minutosRemotos ?? 0);

  /** Días con jornada hasta hoy, sábado incluido si lo tenía. */
  readonly diasProgramados = computed(() => this.dias().filter(d =>
    d.fecha <= this.hoy() && new Date(d.fecha + 'T00:00:00').getDay() !== 0 && (d.minutosJornada ?? 0) > 0).length);
  /** De lunes a viernes, los días que vino. */
  readonly diasTrabajados = computed(() => this.dias().filter(d => d.fecha <= this.hoy() && !this.esSabado(d.fecha)
    && (d.estado === 'PUNTUAL' || d.estado === 'TARDE' || d.estado === 'INCOMPLETO')).length);
  /** Días a los que les falta alguna marca; el de hoy, mientras está en curso, no. */
  readonly porCompletar = computed(() => this.filas().filter(d => (d.marcasFaltantes ?? []).length > 0 && !this.enCurso(d)).length);

  /** Las que siguen su camino. Una que la semana cerró sin revisar ya no se mueve. */
  readonly abiertas = computed(() =>
    this.solicitudes().filter(s => (s.estado === 'PENDIENTE' && !s.semanaCerrada) || s.estado === 'REVISADA'));

  /** «Permiso, en la supervisora»: dónde está la última que sigue abierta. */
  readonly abiertaTexto = computed(() => {
    const ultima = this.abiertas()[0];
    return ultima ? `${ultima.tipo}, ${ultima.estado === 'PENDIENTE' ? 'en la supervisora' : 'en RR.HH.'}` : 'Ninguna en curso';
  });

  /** «3 al 8 de noviembre» o «27 de octubre al 1 de noviembre»: de lunes a sábado. */
  readonly rangoTexto = computed(() => {
    const inicio = new Date(this.lunes() + 'T00:00:00');
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 5);
    const mes = (f: Date) => MESES[f.getMonth()];
    return inicio.getMonth() === fin.getMonth()
      ? `${inicio.getDate()} al ${fin.getDate()} de ${mes(fin)}`
      : `${inicio.getDate()} de ${mes(inicio)} al ${fin.getDate()} de ${mes(fin)}`;
  });

  readonly esSemanaActual = computed(() => this.lunes() === this.lunesDe(new Date()));

  /** Esta semana: hasta cuándo se registran sus solicitudes. Otra: cuál se está viendo. */
  readonly barraTexto = computed(() => this.esSemanaActual()
    ? `Solicitudes de esta semana hasta el lunes ${this.corta(this.sumarDias(this.lunes(), 7))}`
    : `Semana del ${this.rangoTexto()}`);

  /** El horario que más se repite en la semana: es el que la persona reconoce como «el suyo». */
  readonly horario = computed(() => {
    const cuenta = new Map<string, number>();
    for (const d of this.dias()) {
      if (d.horaEntradaHorario && d.horaSalidaHorario && !this.esSabado(d.fecha)) {
        const clave = `${this.hhmm(d.horaEntradaHorario)}|${this.hhmm(d.horaSalidaHorario)}`;
        cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1);
      }
    }
    const [clave] = [...cuenta.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
    if (!clave) {
      return null;
    }
    const [entrada, salida] = clave.split('|');
    return { entrada, salida };
  });

  /** «Almuerzo 13:00, break 17:00»; sin hora de break, solo el almuerzo. */
  readonly pausasTexto = computed(() => {
    const p = this.miPlan();
    if (!p?.horaAlmuerzo) {
      return '';
    }
    return `Almuerzo ${this.hhmm(p.horaAlmuerzo)}${p.horaBreak ? ', break ' + this.hhmm(p.horaBreak) : ''}`;
  });

  /** Sus recuperaciones confirmadas de hoy en adelante. */
  readonly misBloques = computed(() => (this.miPlan()?.bloques ?? []).filter(b => b.confirmado)
    .sort((a, b) => a.fecha.localeCompare(b.fecha)));

  ngOnInit(): void {
    this.servicio.tiposDeDia().subscribe({
      next: t => {
        // La recuperación no se pide: la planifica RR.HH.
        const deAusencia = t.filter(x => !TIPOS_DE_CALENDARIO.includes(x.codigo) && x.codigo !== RECUPERACION);
        this.tipos.set(deAusencia);
      },
      error: () => this.toast.error('No se pudieron cargar los tipos de solicitud')
    });
    this.cargar();
    this.cargarSolicitudes();
    this.cargarRecuperaciones();
  }

  /** Su plan de recuperación y las pausas de su horario. */
  private cargarRecuperaciones(): void {
    this.servicio.miPlan().subscribe({
      next: p => this.miPlan.set(p),
      error: () => { /* si falla, la pantalla sigue sirviendo sin las pausas ni las recuperaciones */ }
    });
  }

  cargar(): void {
    this.cargando.set(true);
    const lunes = this.lunes();
    this.servicio.reporteMio(lunes, this.sumarDias(lunes, 5)).subscribe({
      next: r => {
        if (lunes !== this.lunes()) {
          return;  // llegó tarde: ya se está viendo otra semana
        }
        this.reporte.set(r);
        this.cargando.set(false);
        // La modalidad y la subcartera de hoy salen de la semana actual: la de otra semana puede ser otra.
        if (lunes === this.lunesDe(new Date())) {
          const hasta = [...(r.dias ?? [])].filter(d => d.fecha <= this.hoy() && !this.esSabado(d.fecha)
            && new Date(d.fecha + 'T00:00:00').getDay() !== 0).pop();
          this.enTeletrabajo.set(hasta?.origenRemoto === 'MODALIDAD');
          this.subcartera.set(hasta?.subcartera ?? r.dias?.[0]?.subcartera ?? null);
        } else if (!this.subcartera()) {
          this.subcartera.set(r.dias?.[0]?.subcartera ?? null);
        }
      },
      error: () => {
        this.toast.error('No se pudieron cargar tus horas');
        this.cargando.set(false);
      }
    });
  }

  private cargarSolicitudes(): void {
    this.servicio.misJustificaciones().subscribe({
      next: s => this.solicitudes.set(s),
      error: () => this.toast.error('No se pudieron cargar tus solicitudes')
    });
  }

  moverSemana(paso: number): void {
    this.lunes.set(this.sumarDias(this.lunes(), paso * 7));
    this.cargar();
  }

  irAEstaSemana(): void {
    this.lunes.set(this.lunesDe(new Date()));
    this.cargar();
  }


  // ==================== SOLICITUD ====================

  /** Abre el formulario vacío, o con una solicitud ya enviada para modificarla. */
  abrirSolicitud(sol: Justificacion | null = null): void {
    this.editando.set(sol);
    this.formulario.set(true);
  }

  /** Guardada: el formulario se cierra y se vuelve a cargar lo que cambió. */
  alGuardar(): void {
    this.formulario.set(false);
    this.cargarSolicitudes();
    this.cargar();
  }

  /** El asesor que pide: su modalidad de hoy. */
  protected readonly teletrabajo = (): boolean => this.enTeletrabajo();

  /** La aprobada que ya no se modifica porque su recuperación está en marcha: se enseña, deshabilitada. */
  yaPlanificada(s: Justificacion): boolean {
    return s.estado === 'APROBADA' && s.modificable === false && (s.motivoNoModificable ?? '').startsWith('RR.HH.');
  }

  /** Abre el certificado en otra pestaña; no se descarga sin pedirlo. */
  verCertificado(s: Justificacion): void {
    abrirArchivo(this.servicio.certificado(s.id, s.archivoNombre), s.archivoNombre,
      () => this.toast.error('No se pudo abrir el certificado'));
  }

  // ==================== LA TABLA ====================

  /** Hoy, con entrada y sin salida: todavía no se juzga. */
  private enCurso(d: AsistenciaDia): boolean {
    return d.fecha === this.hoy() && !!d.entrada && !d.salida;
  }

  /** La píldora del día. Con marcas que faltan es incompleto; el día no laborable o justificado dice su tipo. */
  estadoDe(d: AsistenciaDia): [string, TonoPill] {
    if (this.enCurso(d)) {
      return ['En curso', 'neu'];
    }
    if (d.estado === 'INCOMPLETO' || ((d.estado === 'PUNTUAL' || d.estado === 'TARDE') && (d.marcasFaltantes ?? []).length)) {
      return ['Incompleto', 'am'];
    }
    switch (d.estado) {
      case 'PUNTUAL': return ['Puntual', 'ok'];
      case 'TARDE': return ['Tarde', 'am'];
      case 'FALTA': return ['Falta', 'ro'];
      case 'JUSTIFICADO': return [d.tipoDia ?? 'Justificado', 'info'];
      default: return [d.tipoDia ?? 'No laborable', 'neu'];
    }
  }

  /**
   * Lo que la tabla no dice de las horas del día: la solicitud que lo cubre y lo que queda por recuperar,
   * o lo que debe si no pidió nada.
   */
  notaDe(d: AsistenciaDia): string | null {
    const enRevision = (e?: string | null) => e === 'PENDIENTE' || e === 'REVISADA';
    if (d.solicitud && enRevision(d.estadoSolicitud)) {
      return `${d.solicitud} en revisión`;
    }
    if (d.solicitud && d.estadoSolicitud === 'APROBADA' && d.estado !== 'JUSTIFICADO') {
      return d.minutosDeuda ? `${d.solicitud} · debe ${enHoras(d.minutosDeuda)}` : d.solicitud;
    }
    if (d.minutosDebe) {
      return `Debe ${enHoras(d.minutosDebe)}`;
    }
    if (enRevision(d.estadoTeletrabajo)) {
      return 'Teletrabajo en revisión';
    }
    if (d.estadoTeletrabajo === 'APROBADA' && d.remotoDesde && d.minutosDeuda) {
      return `Teletrabajo · debe ${enHoras(d.minutosDeuda)}`;
    }
    return null;
  }

  /** Dónde trabajó: en la oficina, en remoto o repartido. */
  dondeDe(d: AsistenciaDia): string {
    if (d.minutosTrabajados == null || d.estado === 'NO_LABORABLE') {
      return '';
    }
    const remoto = d.minutosRemotos ?? 0;
    return remoto && (d.minutosPresenciales ?? 0) ? `Remoto ${enHoras(remoto)}` : remoto ? 'Remoto' : 'Presencial';
  }

  /** «13:00 – 13:45»; con una sola marca, la que falta en raya. */
  tramo(inicio: string | null, fin: string | null): string {
    return inicio || fin ? `${inicio ? this.hhmm(inicio) : '—'} – ${fin ? this.hhmm(fin) : '—'}` : '—';
  }

  /** «45 min»: lo que duró una pausa cerrada. */
  duracionPausa(inicio: string | null, fin: string | null): string {
    return inicio && fin ? `${minutosDe(fin) - minutosDe(inicio)} min` : '';
  }

  // ==================== LAS SOLICITUDES ====================

  /** Una que la supervisora no revisó antes del cierre de su semana sale «Sin revisar»: ya no va a cambiar. */
  estadoSolicitud(s: Justificacion): [string, TonoPill] {
    return s.estado === 'PENDIENTE' && s.semanaCerrada ? ['Sin revisar', 'neu'] : ESTADO_SOLICITUD[s.estado];
  }

  /** «Lunes 10/11» o «10/11 al 12/11». */
  rangoSolicitud(s: Justificacion): string {
    return !s.fechaHasta || s.fechaHasta === s.fechaDesde ? this.diaLargo(s.fechaDesde) : `${this.corta(s.fechaDesde)} al ${this.corta(s.fechaHasta)}`;
  }

  /** Las horas de una solicitud por horas: las del permiso o las del teletrabajo. */
  horasSolicitud(s: Justificacion): string {
    if (s.remotoDesde && s.remotoHasta && s.oficinaDesde && s.oficinaHasta) {
      return `Oficina ${this.hhmm(s.oficinaDesde)}–${this.hhmm(s.oficinaHasta)}, remoto ${this.hhmm(s.remotoDesde)}–${this.hhmm(s.remotoHasta)}`;
    }
    return s.trabajaDesde && s.trabajaHasta ? `De ${this.hhmm(s.trabajaDesde)} a ${this.hhmm(s.trabajaHasta)}` : '';
  }

  // ==================== APOYO ====================

  esSabado(fecha: string): boolean {
    return new Date(fecha + 'T00:00:00').getDay() === 6;
  }

  nombreDia(fecha: string): string {
    return DIAS_LARGOS[new Date(fecha + 'T00:00:00').getDay()];
  }

  /** «Lunes 28/09». */
  diaLargo(fecha: string): string {
    return `${this.nombreDia(fecha)} ${this.corta(fecha)}`;
  }

  protected hhmm(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  protected corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  /** Fechas locales: con toISOString, en Lima, desde las 19:00 ya es el día siguiente. */
  protected hoy(): string {
    return hoyLocal();
  }

  private lunesDe(fecha: Date): string {
    return lunesLocal(fecha);
  }

  private sumarDias(fecha: string, dias: number): string {
    return sumarDiasLocal(fecha, dias);
  }
}
