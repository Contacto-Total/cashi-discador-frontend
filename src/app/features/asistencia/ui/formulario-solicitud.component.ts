import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, concatMap, from, toArray } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { BotonDirective } from '../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../shared/ui/tarjeta.directive';
import { AsistenciaService } from '../asistencia.service';
import { AsistenciaDia, AsistenciaReporte, Justificacion, SolicitudPrevista, TipoDia } from '../asistencia.models';
import {
  avisoAnticipacion, hoy as hoyLocal, inicioDiasSinCompletar, primerDiaPermitido, sumarDias as sumarDiasLocal
} from '../asistencia.estilos';
import { CAMPO, ENTRADA, ETIQUETA, LISTA } from './clases';
import { ERROR, MINI } from './ficha-clases';
import {
  ADJUNTO, AVISO, BOTONES, CALCULO, CASILLA, COLUMNA_TARJETA, COLUMNA_TITULO, DESLIZA, DIAS_LARGOS, DIA_CASILLA, DIA_CASILLA_NOTA,
  FILA_CAMPOS, OPCION, OPCIONES, OPCION_LINEA, OPCION_PUNTO, OPCION_TITULO, PILA, TRIO, TRIO_BOTON, TRIO_DOS, enPalabras
} from './solicitud-clases';

const DESCANSO_MEDICO = 'DESCANSO_MEDICO';
const CITA_MEDICA = 'CITA_MEDICA';
const TELETRABAJO = 'TELETRABAJO';
/** Por debajo de esto, lo que faltó no es algo que pedir: es lo normal de entrar y salir a su hora. */
const MINIMO_FALTANTE = 10;
const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Un día sin completar que el permiso puede cubrir. */
interface DiaSinCompletar {
  fecha: string;
  etiqueta: string;
  /** Qué pasó ese día: «Trabajó 06:00 de 09:30». */
  detalle: string;
  /** Lo que faltó; null si todavía no se puede calcular. */
  falto: number | null;
}

/** Lo que el formulario resuelve antes de enviar: lo que quedará por recuperar, o por qué no se puede. */
interface TotalSolicitud {
  minutos: number | null;
  error: string;
  /** La solicitud que ya cubre ese día, para ofrecer modificarla. */
  repetida: Justificacion | null;
}

/** Un día del rango de la solicitud, con lo que hoy figura en él. */
interface DiaQueCubre {
  fecha: string;
  etiqueta: string;
  texto: string;
  marcable: boolean;
  /** Tiene entrada y marcarlo lo deja como no trabajado: sale sin marcar. */
  sinMarcar: boolean;
}

/** Quien puede recibir la solicitud cuando la registra la supervisora. */
export interface PersonaSolicitud {
  idUsuario: number;
  nombre: string;
}

/**
 * Formulario de una solicitud, en la tarjeta de la columna lateral. Lo usan el asesor para sí (Mi
 * asistencia) y la supervisora para alguien de su equipo (Asistencia del equipo): con `personas`, el
 * formulario pregunta para quién y la solicitud va a nombre de esa persona.
 *
 * Cada tipo pide lo suyo: el permiso, para un día que ya pasó o uno que viene; la cita médica, un día que
 * viene con su constancia; el teletrabajo, por días o por horas; los demás, un rango de fechas.
 */
@Component({
  selector: 'app-formulario-solicitud',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [FormsModule, LucideAngularModule, TarjetaDirective, BotonDirective],
  template: `
  <section appTarjeta [class]="COLUMNA_TARJETA" aria-labelledby="titulo-solicitud">
    <div class="mb-[.75rem] flex items-center">
      <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="cerrar.emit()"><lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Solicitudes</button>
    </div>
    <p role="heading" aria-level="2" id="titulo-solicitud" [class]="COLUMNA_TITULO">{{ titulo() }}</p>
    <div [class]="DESLIZA">
      <div [class]="PILA">
        @if (editando() && editando()!.estado !== 'PENDIENTE') {
          <p [class]="AVISO.am">Al guardar vuelve a «Por revisar»: tu supervisora y RR.HH. la aprueban de nuevo.</p>
        }
        @if (paraOtro()) {
          <div [class]="CAMPO">
            <label for="j-quien" [class]="ETIQUETA">Para quién</label>
            <select id="j-quien" [class]="LISTA" [ngModel]="idUsuario()" (ngModelChange)="elegirPersona($event)">
              @for (p of personas(); track p.idUsuario) { <option [ngValue]="p.idUsuario">{{ p.nombre }}</option> }
            </select>
          </div>
        }
        <div [class]="CAMPO">
          <label for="j-tipo" [class]="ETIQUETA">Tipo</label>
          <select id="j-tipo" [class]="LISTA" [ngModel]="nuevo.idTipoDia" (ngModelChange)="elegirTipo($event)">
            @for (t of tipos(); track t.id) { <option [ngValue]="t.id">{{ t.nombre }}</option> }
          </select>
        </div>

        @if (modo() === 'permiso') {
          <div [class]="OPCIONES" role="radiogroup" aria-label="Para cuándo">
            @for (o of CUANDO; track o.valor) {
              <button type="button" role="radio" [attr.aria-checked]="cuando() === o.valor" [class]="OPCION" (click)="elegirCuando(o.valor)">
                <span [class]="OPCION_PUNTO"></span>
                <span class="min-w-0"><span [class]="OPCION_TITULO">{{ o.titulo }}</span><small [class]="OPCION_LINEA">{{ o.pie }}</small></span>
              </button>
            }
          </div>
        }

        @if (verPasado()) {
          <div [class]="CAMPO">
            <span [class]="ETIQUETA">Días sin completar</span>
            @if (sinCompletar().length) {
              <div>
                @for (f of sinCompletar(); track f.fecha) {
                  <label [class]="DIA_CASILLA">
                    <input type="checkbox" [class]="CASILLA" [checked]="marcados().has(f.fecha)" (change)="alternarSinCompletar(f.fecha)">
                    <span>{{ f.etiqueta }}</span>
                    <small [class]="DIA_CASILLA_NOTA">{{ f.detalle }}</small>
                  </label>
                }
              </div>
            } @else {
              <p class="m-0 text-[.875rem] leading-[1.5] text-muted-foreground">{{ cargandoRecientes() ? 'Buscando tus días…' : 'Sin días por cubrir en semanas abiertas' }}</p>
            }
          </div>
        }

        @if (verFuturo()) {
          <div [class]="TRIO" role="radiogroup" aria-label="Qué necesitas">
            @for (o of QUE; track o.valor) {
              <button type="button" [attr.aria-pressed]="que() === o.valor" [class]="TRIO_BOTON" (click)="elegirQue(o.valor)">{{ o.texto }}</button>
            }
          </div>
          <div [class]="FILA_CAMPOS">
            <div [class]="CAMPO">
              <label for="j-dia" [class]="ETIQUETA">{{ que() === 'todo' && modo() === 'permiso' ? 'Desde' : 'Día' }}</label>
              <input id="j-dia" type="date" [class]="ENTRADA" [attr.min]="primerDiaFuturo()" [ngModel]="diaFuturo()" (ngModelChange)="cambiarDia($event)">
            </div>
            @if (que() === 'todo') {
              @if (modo() === 'permiso') {
                <div [class]="CAMPO">
                  <label for="j-dia-hasta" [class]="ETIQUETA">Hasta</label>
                  <input id="j-dia-hasta" type="date" [class]="ENTRADA" [attr.min]="diaFuturo()" [ngModel]="hastaFuturo()" (ngModelChange)="hastaFuturo.set($event); prever()">
                </div>
              }
            } @else {
              <div [class]="CAMPO">
                <label for="j-hora" [class]="ETIQUETA">{{ que() === 'entrar' ? 'Entra a las' : 'Sale a las' }}</label>
                <input id="j-hora" type="time" step="300" [class]="ENTRADA" [ngModel]="horaElegida()" (ngModelChange)="cambiarHora($event)">
              </div>
            }
          </div>
        }

        @if (modo() === 'tele') {
          @if (enTeletrabajo()) {
            <p [class]="AVISO.info">{{ paraOtro() ? nombrePersona() + ' trabaja en teletrabajo: sus horas ya cuentan como remotas.' : 'Trabajas en teletrabajo: tus horas ya cuentan como remotas.' }}</p>
          } @else {
            <div [class]="TRIO_DOS" role="radiogroup" aria-label="Cómo">
              <button type="button" [attr.aria-pressed]="teleModo() === 'dias'" [class]="TRIO_BOTON" (click)="elegirTeleModo('dias')">Días completos</button>
              <button type="button" [attr.aria-pressed]="teleModo() === 'horas'" [class]="TRIO_BOTON" (click)="elegirTeleModo('horas')">Por horas</button>
            </div>
            @if (teleModo() === 'horas') {
              <div [class]="CAMPO">
                <label for="j-dia" [class]="ETIQUETA">Día</label>
                <input id="j-dia" type="date" [class]="ENTRADA" [attr.min]="primerDiaFuturo()" [ngModel]="diaFuturo()" (ngModelChange)="cambiarDia($event)">
              </div>
              <div [class]="FILA_CAMPOS">
                <div [class]="CAMPO">
                  <label for="j-od" [class]="ETIQUETA">Oficina desde</label>
                  <input id="j-od" type="time" step="300" [class]="ENTRADA" [ngModel]="oficinaDesde()" (ngModelChange)="cambiarHoraTele(oficinaDesde, $event)">
                </div>
                <div [class]="CAMPO">
                  <label for="j-oh" [class]="ETIQUETA">Oficina hasta</label>
                  <input id="j-oh" type="time" step="300" [class]="ENTRADA" [ngModel]="oficinaHasta()" (ngModelChange)="cambiarHoraTele(oficinaHasta, $event)">
                </div>
              </div>
              <div [class]="FILA_CAMPOS">
                <div [class]="CAMPO">
                  <label for="j-rd" [class]="ETIQUETA">Remoto desde</label>
                  <input id="j-rd" type="time" step="300" [class]="ENTRADA" [ngModel]="remotoDesde()" (ngModelChange)="cambiarHoraTele(remotoDesde, $event)">
                </div>
                <div [class]="CAMPO">
                  <label for="j-rh" [class]="ETIQUETA">Remoto hasta</label>
                  <input id="j-rh" type="time" step="300" [class]="ENTRADA" [ngModel]="remotoHasta()" (ngModelChange)="cambiarHoraTele(remotoHasta, $event)">
                </div>
              </div>
              @if (avisoTele(); as aviso) { <p [class]="AVISO.am" aria-live="polite">{{ aviso }}</p> }
            }
          }
        }

        @if (verRango()) {
          <div [class]="FILA_CAMPOS">
            <div [class]="CAMPO">
              <label for="j-desde" [class]="ETIQUETA">Desde</label>
              <input id="j-desde" type="date" [class]="ENTRADA" [attr.min]="primerDia()" [ngModel]="nuevo.fechaDesde" (ngModelChange)="cambiarDesde($event)">
            </div>
            <div [class]="CAMPO">
              <label for="j-hasta" [class]="ETIQUETA">Hasta</label>
              <input id="j-hasta" type="date" [class]="ENTRADA" [attr.min]="nuevo.fechaDesde" [ngModel]="nuevo.fechaHasta" (ngModelChange)="nuevo.fechaHasta = $event; cargarRango()">
            </div>
          </div>
          @if (diasQueCubre(); as filasRango) {
            @if (filasRango.length) {
              <div [class]="CAMPO">
                <span [class]="ETIQUETA">{{ esDescanso() ? 'Días del certificado' : 'Días que cubre' }}</span>
                <div>
                  @for (f of filasRango; track f.fecha) {
                    <label [class]="DIA_CASILLA + (f.marcable ? '' : ' cursor-default opacity-55')">
                      <input type="checkbox" [class]="CASILLA" [disabled]="!f.marcable" [checked]="marcado(f)" (change)="alternarDia(f)">
                      <span>{{ f.etiqueta }}</span>
                      <small [class]="DIA_CASILLA_NOTA">{{ f.texto }}</small>
                    </label>
                  }
                </div>
              </div>
            }
          }
        }

        @if (pideCertificado()) {
          <div [class]="CAMPO">
            <span [class]="ETIQUETA">{{ modo() === 'cita' ? 'Constancia' : 'Certificado' }}</span>
            <label [class]="ADJUNTO" for="j-archivo">
              <lucide-angular name="paperclip" [size]="16" class="flex flex-none text-muted-foreground"></lucide-angular>
              <span class="min-w-0 truncate">{{ textoAdjunto() }}</span>
            </label>
            <input id="j-archivo" type="file" class="sr-only" accept="image/jpeg,image/png,image/webp,application/pdf" (change)="elegirArchivo($event)">
          </div>
        }

        @if (modo() === 'cita') {
          <div [class]="CALCULO"><span class="text-muted-foreground">Horas por recuperar</span><span class="font-bold">No se recupera</span></div>
        } @else if (modo() === 'permiso' && total().minutos) {
          <div [class]="CALCULO" aria-live="polite"><span class="text-muted-foreground">Horas por recuperar</span><span class="font-bold">{{ enPalabras(total().minutos!) }}</span></div>
        }

        @if (!(modo() === 'tele' && enTeletrabajo())) {
          <div [class]="CAMPO">
            <label for="j-comentario" [class]="ETIQUETA">Comentario</label>
            <textarea id="j-comentario" maxlength="500" [class]="TEXTAREA" placeholder="Motivo"
                      [ngModel]="nuevo.comentario" (ngModelChange)="nuevo.comentario = $event; errorComentario.set(false)"></textarea>
          </div>
        }

        @if (errorComentario()) {
          <p [class]="ERROR">Escribe el motivo: es lo que va a leer {{ paraOtro() ? 'RR.HH.' : 'tu supervisora' }}</p>
        } @else if (error() || total().error) {
          <p [class]="ERROR">{{ error() || total().error }}</p>
        }
        @if (total().repetida; as otra) {
          <div [class]="BOTONES">
            <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" [disabled]="!otra.modificable" [title]="otra.modificable ? '' : (otra.motivoNoModificable ?? '')" (click)="abrir(otra)">
              <lucide-angular name="pencil" [size]="16" class="flex"></lucide-angular>Modificarla
            </button>
          </div>
        }

        <div [class]="BOTONES">
          <button type="button" appBoton [class]="'px-4! ' + BOTON_APAGADO" (click)="enviar()" [disabled]="enviando() || (modo() === 'tele' && enTeletrabajo())">
            <lucide-angular name="check" [size]="16" class="flex"></lucide-angular>{{ enviando() ? (editando() ? 'Guardando…' : 'Enviando…') : editando() ? 'Guardar cambios' : paraOtro() ? 'Registrar' : 'Enviar a revisión' }}
          </button>
          <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="cerrar.emit()">Cancelar</button>
        </div>
      </div>
    </div>
  </section>
  `
})
export class FormularioSolicitudComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  /** Los tipos que se pueden pedir. */
  readonly tipos = input<TipoDia[]>([]);
  /** Con personas, la registra la supervisora para una de ellas; sin, es del asesor que la pide. */
  readonly personas = input<PersonaSolicitud[]>([]);
  /** La persona elegida al abrir. */
  readonly para = input<number | null>(null);
  /** La solicitud que se modifica; null al registrar una nueva. */
  readonly editar = input<Justificacion | null>(null);
  /** Lo que ya se sabe de la semana a la vista: se usa mientras llega lo demás. */
  readonly diasAVista = input<AsistenciaDia[]>([]);
  /** Las solicitudes ya hechas: para ofrecer modificar la que cubre el mismo día. */
  readonly solicitudes = input<Justificacion[]>([]);
  /** Si esa persona trabaja en teletrabajo: no pide teletrabajo, sus horas ya son remotas. */
  readonly enTeletrabajoDe = input<(idUsuario: number | null) => boolean>(() => false);

  readonly cerrar = output<void>();
  /** Se guardó: la pantalla vuelve a cargar lo suyo. */
  readonly listo = output<void>();

  protected readonly COLUMNA_TARJETA = COLUMNA_TARJETA; protected readonly COLUMNA_TITULO = COLUMNA_TITULO;
  protected readonly DESLIZA = DESLIZA; protected readonly PILA = PILA; protected readonly AVISO = AVISO; protected readonly CAMPO = CAMPO;
  protected readonly ETIQUETA = ETIQUETA; protected readonly LISTA = LISTA; protected readonly ENTRADA = ENTRADA; protected readonly ERROR = ERROR;
  protected readonly MINI = MINI; protected readonly OPCIONES = OPCIONES; protected readonly OPCION = OPCION; protected readonly OPCION_PUNTO = OPCION_PUNTO;
  protected readonly OPCION_TITULO = OPCION_TITULO; protected readonly OPCION_LINEA = OPCION_LINEA; protected readonly DIA_CASILLA = DIA_CASILLA;
  protected readonly CASILLA = CASILLA; protected readonly DIA_CASILLA_NOTA = DIA_CASILLA_NOTA; protected readonly TRIO = TRIO; protected readonly TRIO_DOS = TRIO_DOS;
  protected readonly TRIO_BOTON = TRIO_BOTON; protected readonly FILA_CAMPOS = FILA_CAMPOS; protected readonly ADJUNTO = ADJUNTO; protected readonly CALCULO = CALCULO;
  protected readonly BOTONES = BOTONES;
  protected readonly BOTON_SEC = 'dark:bg-muted dark:hover:bg-border';
  /** Deshabilitado como en el molde: gris, sin el degradado ni la transparencia del botón común. */
  protected readonly BOTON_APAGADO = 'disabled:[background-image:none]! disabled:bg-muted! disabled:text-muted-foreground! disabled:opacity-100! disabled:border-transparent!';
  /** El comentario: el campo de texto con dos líneas a la vista y su relleno. */
  protected readonly TEXTAREA = ENTRADA.replace('py-[.375rem]!', 'py-2!').replace('leading-[normal]!', '') + ' block h-auto! min-h-[2.75rem]! resize-y';
  protected readonly enPalabras = enPalabras;
  protected readonly CUANDO = [
    { valor: 'pasado' as const, titulo: 'Un día que ya pasó', pie: 'No completó la jornada o no vino' },
    { valor: 'futuro' as const, titulo: 'Hoy o un día que viene', pie: 'Salir antes, entrar tarde o faltar' }
  ];
  protected readonly QUE = [
    { valor: 'salir' as const, texto: 'Salir antes' },
    { valor: 'entrar' as const, texto: 'Entrar más tarde' },
    { valor: 'todo' as const, texto: 'Todo el día' }
  ];

  /** La persona a la que va la solicitud; null es quien la pide. */
  readonly idUsuario = signal<number | null>(null);
  readonly paraOtro = computed(() => this.personas().length > 0);
  readonly nombrePersona = computed(() => this.personas().find(p => p.idUsuario === this.idUsuario())?.nombre ?? '');
  readonly enTeletrabajo = computed(() => this.enTeletrabajoDe()(this.idUsuario()));
  readonly titulo = computed(() => this.paraOtro() ? 'Registrar solicitud' : this.editando() ? 'Modificar solicitud' : 'Nueva solicitud');

  readonly enviando = signal(false);
  readonly error = signal('');
  readonly archivo = signal<File | null>(null);
  readonly errorComentario = signal(false);

  /** El rango que se está pidiendo y lo que figura en cada día ya pasado (los futuros no están). */
  readonly rango = signal({ desde: '', hasta: '' });
  readonly diasConocidos = signal(new Map<string, AsistenciaDia>());
  /** Los días que se desmarcaron: la solicitud no los cubre. */
  readonly desmarcados = signal(new Set<string>());
  /** Los días con entrada que se marcaron: salen sin marcar y solo el descanso médico los cubre. */
  readonly conEntradaMarcados = signal(new Set<string>());
  readonly idTipoNuevo = signal<number | null>(null);
  private readonly tipoNuevo = computed(() => this.tipos().find(t => t.id === this.idTipoNuevo()) ?? null);
  readonly pideCertificado = computed(() => !!this.tipoNuevo()?.exigeCertificado);
  readonly seRecupera = computed(() => !!this.tipoNuevo()?.recuperable);
  readonly esDescanso = computed(() => this.tipoNuevo()?.codigo === DESCANSO_MEDICO);
  readonly modo = computed<'permiso' | 'cita' | 'tele' | 'rango'>(() =>
    this.seRecupera() ? 'permiso'
      : this.tipoNuevo()?.codigo === CITA_MEDICA ? 'cita'
      : this.tipoNuevo()?.codigo === TELETRABAJO ? 'tele' : 'rango');
  readonly cuando = signal<'pasado' | 'futuro'>('pasado');
  readonly verPasado = computed(() => this.modo() === 'permiso' && this.cuando() === 'pasado');
  readonly verFuturo = computed(() => this.modo() === 'cita' || (this.modo() === 'permiso' && this.cuando() === 'futuro'));
  readonly teleModo = signal<'dias' | 'horas'>('dias');
  readonly verTeleHoras = computed(() => this.modo() === 'tele' && !this.enTeletrabajo() && this.teleModo() === 'horas');
  readonly verRango = computed(() => this.modo() === 'rango' || (this.modo() === 'tele' && !this.enTeletrabajo() && this.teleModo() === 'dias'));
  readonly oficinaDesde = signal('08:00');
  readonly oficinaHasta = signal('12:00');
  readonly remotoDesde = signal('14:00');
  readonly remotoHasta = signal('18:30');
  /** Mientras no toque las horas, la oficina empieza a su entrada y lo remoto termina a su salida. */
  private horasTeleTocadas = false;

  readonly editando = signal<Justificacion | null>(null);

  readonly diasRecientes = signal<AsistenciaDia[]>([]);
  readonly cargandoRecientes = signal(false);
  readonly marcados = signal(new Set<string>());
  readonly faltaMarcar = signal(false);
  private turnoRecientes = 0;

  readonly que = signal<'salir' | 'entrar' | 'todo'>('salir');
  readonly diaFuturo = signal('');
  readonly hastaFuturo = signal('');
  readonly horaSalir = signal('15:00');
  readonly horaEntrar = signal('10:00');
  readonly horaElegida = computed(() => (this.que() === 'entrar' ? this.horaEntrar() : this.horaSalir()));
  readonly prevista = signal<SolicitudPrevista | null>(null);
  readonly errorPrevista = signal<{ texto: string; idSolicitud: number | null } | null>(null);
  private turnoPrevista = 0;

  nuevo = {
    idTipoDia: null as number | null,
    fechaDesde: this.hoy(),
    fechaHasta: this.hoy(),
    comentario: ''
  };

  /**
   * Los días sin completar de las semanas abiertas: sin entrada, con menos horas que su jornada o con
   * marcas a medias. El que ya tiene una solicitud no vuelve a salir, salvo que sea la que se modifica.
   */
  readonly sinCompletar = computed<DiaSinCompletar[]>(() => {
    const hoy = this.hoy();
    const propia = this.editando()?.id ?? null;
    const filas: DiaSinCompletar[] = [];
    for (const d of this.diasRecientes()) {
      const suya = !!d.idSolicitud && d.idSolicitud === propia;
      if (d.fecha >= hoy || d.semanaCerrada || d.estado === 'NO_LABORABLE' || (d.idSolicitud && !suya)
          || (d.estado === 'JUSTIFICADO' && !suya)) {
        continue;
      }
      const jornada = d.minutosJornada ?? 0;
      const etiqueta = this.diaLargo(d.fecha);
      if (!d.entrada) {
        if (jornada > 0) {
          filas.push({ fecha: d.fecha, etiqueta, detalle: 'No vino', falto: jornada });
        }
      } else if (d.minutosTrabajados == null) {
        // Sin todas sus marcas no hay horas: se puede pedir, y se calcula cuando RR.HH. las complete.
        filas.push({ fecha: d.fecha, etiqueta, detalle: 'Faltan marcas', falto: null });
      } else if ((d.minutosFaltantes ?? jornada - d.minutosTrabajados) > MINIMO_FALTANTE) {
        const falto = d.minutosFaltantes ?? jornada - d.minutosTrabajados;
        filas.push({ fecha: d.fecha, etiqueta, falto, detalle: `Trabajó ${enHoras(d.minutosTrabajados)} de ${enHoras(jornada)}` });
      }
    }
    return filas;
  });

  /** Lo que quedará por recuperar, o por qué no se puede pedir así. */
  readonly total = computed<TotalSolicitud>(() => {
    if (this.verPasado()) {
      const elegidos = this.sinCompletar().filter(f => this.marcados().has(f.fecha));
      return { minutos: elegidos.reduce((t, f) => t + (f.falto ?? 0), 0) || null, repetida: null,
               error: this.faltaMarcar() && !elegidos.length ? 'Marca al menos un día' : '' };
    }
    if (this.verRango()) {
      const { desde, hasta } = this.rango();
      return { minutos: null, repetida: null, error: desde && hasta && hasta < desde ? 'La fecha final no puede ser anterior a la inicial' : '' };
    }
    if (!this.verFuturo() && !this.verTeleHoras()) {
      return { minutos: null, error: '', repetida: null };
    }
    const error = this.errorPrevista();
    if (error) {
      return { minutos: null, error: error.texto,
               repetida: error.idSolicitud ? this.solicitudes().find(x => x.id === error.idSolicitud) ?? null : null };
    }
    return { minutos: this.modo() === 'permiso' ? this.prevista()?.minutos ?? null : null, error: '', repetida: null };
  });

  /** Al modificar una que ya trae su adjunto y no cambia de tipo, no hace falta subirlo otra vez. */
  readonly conservaAdjunto = computed(() => {
    const e = this.editando();
    return !!e?.tieneArchivo && e.idTipoDia === this.idTipoNuevo();
  });

  /**
   * Los días de lunes a viernes del rango, cada uno con lo que hoy figura; NULL si el rango está al revés.
   * El de una semana cerrada o con otra solicitud no se puede marcar.
   */
  readonly diasQueCubre = computed(() => {
    const { desde, hasta } = this.rango();
    if (!desde || !hasta || hasta < desde) {
      return null;
    }
    const conocidos = this.diasConocidos();
    const hoy = this.hoy();
    const propia = this.editando()?.id ?? null;
    // El descanso médico manda sobre las marcas: también cubre el día en que se entró y hubo que salir.
    const esDescansoMedico = this.esDescanso();
    const filas: DiaQueCubre[] = [];
    for (let f = desde; f <= hasta && filas.length < 31; f = this.sumarDias(f, 1)) {
      const diaSemana = new Date(f + 'T00:00:00').getDay();
      if (diaSemana === 0 || diaSemana === 6) {
        continue;  // sábado y domingo: no se espera a nadie, no hay nada que cubrir
      }
      const d = conocidos.get(f);
      const conEntrada = f <= hoy && !!d && (d.estado === 'PUNTUAL' || d.estado === 'TARDE' || d.estado === 'INCOMPLETO');
      // La tardanza sí se cubre: una cita médica a primera hora hace llegar tarde.
      const [texto, marcable]: [string, boolean] = d?.idSolicitud && d.idSolicitud !== propia
          ? [`Ya tiene ${(d.solicitud ?? 'solicitud').toLowerCase()}`, false]
        : d?.semanaCerrada ? ['Semana cerrada', false]
        : f > hoy ? ['Aún no llega', true]
        : f === hoy && !!d?.entrada && !d.salida ? ['En curso', true]
        : !d || d.estado === 'FALTA' ? ['No trabajado', true]
        : d.estado === 'TARDE' ? ['Llegó tarde', true]
        : d.estado === 'NO_LABORABLE' ? [d.tipoDia ?? 'No laborable', false]
        : d.estado === 'JUSTIFICADO' ? [d.tipoDia ?? 'Justificado', d.idSolicitud === propia && !!propia]
        : ['Trabajado', esDescansoMedico];
      filas.push({ fecha: f, etiqueta: this.diaLargo(f), texto, marcable, sinMarcar: esDescansoMedico && conEntrada });
    }
    return filas;
  });

  /** Método y no computed: `nuevo` es un objeto del formulario, no una signal. */
  tipoElegido(): TipoDia | null {
    return this.tipos().find(t => t.id === this.nuevo.idTipoDia) ?? null;
  }

  primerDia(): string | null {
    return primerDiaPermitido(this.tipoElegido());
  }

  ngOnInit(): void {
    this.idUsuario.set(this.paraOtro() ? this.para() ?? this.personas()[0]?.idUsuario ?? null : null);
    this.abrir(this.editar());
  }

  /** Deja el formulario vacío, o con una solicitud ya enviada para modificarla. */
  abrir(sol: Justificacion | null): void {
    this.editando.set(sol);
    this.error.set('');
    this.errorComentario.set(false);
    this.faltaMarcar.set(false);
    this.archivo.set(null);
    const tipo = (sol ? this.tipos().find(t => t.id === sol.idTipoDia) : null) ?? this.tipos()[0] ?? null;
    this.nuevo = {
      idTipoDia: tipo?.id ?? null,
      fechaDesde: sol?.fechaDesde ?? this.hoy(),
      fechaHasta: sol?.fechaHasta ?? this.hoy(),
      comentario: sol?.comentario ?? ''
    };
    this.idTipoNuevo.set(this.nuevo.idTipoDia);

    const proximo = this.diaHabilDespuesDe(this.hoy());
    this.marcados.set(new Set());
    this.cuando.set('pasado');
    this.que.set('salir');
    this.horaSalir.set('15:00');
    this.horaEntrar.set('10:00');
    this.diaFuturo.set(proximo);
    this.hastaFuturo.set(proximo);
    this.teleModo.set('dias');
    this.ponerHorasTele('08:00', '12:00', '14:00', '18:30');
    this.horasTeleTocadas = false;
    if (sol && this.modo() !== 'rango') {
      this.ponerLoDe(sol);
    }
    this.ponerConocidos();
    this.cargarRango();
    this.cargarRecientes();
    this.prever();
  }

  /** La supervisora cambia de persona: sus días son otros. */
  elegirPersona(id: number): void {
    this.idUsuario.set(id);
    this.error.set('');
    this.marcados.set(new Set());
    this.ponerConocidos();
    this.cargarRango();
    this.cargarRecientes();
    this.prever();
  }

  /** Lo de la semana a la vista que es de esta persona. */
  private ponerConocidos(): void {
    const id = this.idUsuario();
    this.diasConocidos.set(new Map(this.diasAVista().filter(d => id == null || d.idUsuario === id).map(d => [d.fecha, d])));
  }

  /** Sus días: los del asesor que pide, o los de la persona elegida. */
  private reporteDe(desde: string, hasta: string): Observable<AsistenciaReporte> {
    const id = this.idUsuario();
    return id == null ? this.servicio.reporteMio(desde, hasta) : this.servicio.reporte(desde, hasta, null, [id]);
  }

  /** Deja el formulario como quedó la solicitud que se va a modificar. */
  private ponerLoDe(sol: Justificacion): void {
    if (this.modo() === 'tele') {
      if (sol.remotoDesde && sol.remotoHasta && sol.oficinaDesde && sol.oficinaHasta) {
        this.teleModo.set('horas');
        this.diaFuturo.set(sol.fechaDesde);
        this.ponerHorasTele(sol.oficinaDesde, sol.oficinaHasta, sol.remotoDesde, sol.remotoHasta);
        this.horasTeleTocadas = true;
      }
      return;
    }
    const queViene = !!sol.trabajaDesde || sol.fechaDesde >= this.hoy() || this.modo() === 'cita';
    if (!queViene) {
      const dias = new Set<string>();
      for (let f = sol.fechaDesde; f <= sol.fechaHasta; f = this.sumarDias(f, 1)) {
        dias.add(f);
      }
      this.marcados.set(dias);
      return;
    }
    this.cuando.set('futuro');
    this.diaFuturo.set(sol.fechaDesde);
    this.hastaFuturo.set(sol.fechaHasta);
    if (!sol.trabajaDesde || !sol.trabajaHasta) {
      this.que.set('todo');
      return;
    }
    // Si salía antes o entraba más tarde se sabe al ver su horario de ese día.
    this.horaSalir.set(this.hhmm(sol.trabajaHasta));
    this.servicio.solicitudPrevista({ idTipoDia: sol.idTipoDia, fechaDesde: sol.fechaDesde, fechaHasta: sol.fechaDesde,
                                      idUsuario: this.idUsuario(), idSolicitud: sol.id }).subscribe({
      next: p => {
        if (this.editando()?.id === sol.id && p.horaEntrada && this.hhmm(p.horaEntrada) !== this.hhmm(sol.trabajaDesde!)) {
          this.que.set('entrar');
          this.horaEntrar.set(this.hhmm(sol.trabajaDesde!));
          this.prever();
        }
      },
      error: () => { /* sin su horario se queda como «salir antes» */ }
    });
  }

  private ponerHorasTele(od: string, oh: string, rd: string, rh: string): void {
    this.oficinaDesde.set(this.hhmm(od));
    this.oficinaHasta.set(this.hhmm(oh));
    this.remotoDesde.set(this.hhmm(rd));
    this.remotoHasta.set(this.hhmm(rh));
  }

  /** Los días del mes: de ahí salen los que quedaron sin completar. */
  private cargarRecientes(): void {
    const turno = ++this.turnoRecientes;
    const id = this.idUsuario();
    this.diasRecientes.set([]);
    this.cargandoRecientes.set(true);
    this.reporteDe(inicioDiasSinCompletar(), this.hoy()).subscribe({
      next: r => {
        if (turno === this.turnoRecientes) {
          this.diasRecientes.set((r.dias ?? []).filter(d => id == null || d.idUsuario === id));
          this.cargandoRecientes.set(false);
        }
      },
      error: () => {
        if (turno === this.turnoRecientes) {
          this.cargandoRecientes.set(false);
        }
      }
    });
  }

  elegirCuando(valor: 'pasado' | 'futuro'): void {
    this.cuando.set(valor);
    this.error.set('');
    this.prever();
  }

  elegirQue(valor: 'salir' | 'entrar' | 'todo'): void {
    this.que.set(valor);
    this.prever();
  }

  elegirTeleModo(valor: 'dias' | 'horas'): void {
    this.teleModo.set(valor);
    this.error.set('');
    this.prever();
  }

  cambiarDia(dia: string): void {
    this.diaFuturo.set(dia);
    // El rango de «Todo el día» nunca termina antes de empezar.
    if (!this.hastaFuturo() || this.hastaFuturo() < dia) {
      this.hastaFuturo.set(dia);
    }
    this.prever();
  }

  cambiarHora(hora: string): void {
    (this.que() === 'entrar' ? this.horaEntrar : this.horaSalir).set(hora);
    this.prever();
  }

  cambiarHoraTele(campo: { set(v: string): void }, hora: string): void {
    campo.set(hora);
    this.horasTeleTocadas = true;
    this.prever();
  }

  /** El hasta nunca queda antes del desde. */
  cambiarDesde(desde: string): void {
    this.nuevo.fechaDesde = desde;
    if (desde && this.nuevo.fechaHasta < desde) {
      this.nuevo.fechaHasta = desde;
    }
    this.cargarRango();
  }

  alternarSinCompletar(fecha: string): void {
    this.marcados.update(s => {
      const copia = new Set(s);
      copia.has(fecha) ? copia.delete(fecha) : copia.add(fecha);
      return copia;
    });
    this.faltaMarcar.set(false);
    this.error.set('');
  }

  /** El permiso se puede pedir para hoy; lo que lleva anticipación, desde el día que toca. */
  primerDiaFuturo(): string {
    return this.primerDia() ?? this.hoy();
  }

  /** La cita médica es de un día: «todo el día» no abre un rango. */
  private hastaDelFuturo(): string {
    const dia = this.diaFuturo();
    return this.que() === 'todo' && this.modo() === 'permiso' ? (this.hastaFuturo() || dia) : dia;
  }

  /**
   * Pregunta al backend qué resultaría del día que viene tal como está puesto: él conoce el horario de ese
   * día, los feriados y si ya hay otra solicitud.
   */
  prever(): void {
    const turno = ++this.turnoPrevista;
    this.prevista.set(null);
    this.errorPrevista.set(null);
    const idTipoDia = this.nuevo.idTipoDia;
    const tele = this.verTeleHoras();
    if ((!this.verFuturo() && !tele) || !idTipoDia) {
      return;
    }
    const dia = this.diaFuturo();
    const que = this.que();
    const hora = this.horaElegida();
    const hasta = tele ? dia : this.hastaDelFuturo();
    const falta = !dia ? 'Elige el día' : !tele && que !== 'todo' && !hora ? 'Indica la hora'
      : tele && ![this.oficinaDesde(), this.oficinaHasta(), this.remotoDesde(), this.remotoHasta()].every(Boolean) ? 'Indica las horas en la oficina y en remoto'
      : hasta < dia ? 'La fecha final no puede ser anterior a la inicial' : '';
    if (falta) {
      this.errorPrevista.set({ texto: falta, idSolicitud: null });
      return;
    }
    this.servicio.solicitudPrevista({
      idTipoDia, fechaDesde: dia, fechaHasta: hasta,
      saleALas: !tele && que === 'salir' ? hora : null,
      entraALas: !tele && que === 'entrar' ? hora : null,
      ...(tele ? this.horasTele() : {}),
      idUsuario: this.idUsuario(),
      idSolicitud: this.editando()?.id ?? null
    }).subscribe({
      next: p => {
        if (turno !== this.turnoPrevista) {
          return;
        }
        // Mientras no las toque, la oficina empieza a su entrada de ese día y lo remoto termina a su salida.
        if (tele && !this.horasTeleTocadas && p.horaEntrada && p.horaSalida
            && (this.hhmm(p.horaEntrada) !== this.oficinaDesde() || this.hhmm(p.horaSalida) !== this.remotoHasta())) {
          this.oficinaDesde.set(this.hhmm(p.horaEntrada));
          this.remotoHasta.set(this.hhmm(p.horaSalida));
          this.prever();
          return;
        }
        this.prevista.set(p);
      },
      error: respuesta => {
        if (turno === this.turnoPrevista) {
          this.errorPrevista.set({ texto: respuesta?.error?.error ?? 'No se pudo calcular',
                                   idSolicitud: respuesta?.error?.idSolicitud ?? null });
        }
      }
    });
  }

  /** El aviso de lo que el teletrabajo por horas no cubre, dicho para quien lo lee. */
  avisoTele(): string {
    const aviso = this.prevista()?.aviso ?? '';
    return this.paraOtro() ? aviso.replace('no cubres tu horario', 'no cubre su horario') : aviso;
  }

  private horasTele(): { oficinaDesde: string; oficinaHasta: string; remotoDesde: string; remotoHasta: string } {
    return { oficinaDesde: this.oficinaDesde(), oficinaHasta: this.oficinaHasta(), remotoDesde: this.remotoDesde(), remotoHasta: this.remotoHasta() };
  }

  /**
   * Trae lo que figura en los días ya pasados del rango. Lo que se trae se guarda: al mover las fechas no
   * se vuelve a pedir lo mismo.
   */
  cargarRango(): void {
    const { fechaDesde: desde, fechaHasta: hasta } = this.nuevo;
    const id = this.idUsuario();
    this.rango.set({ desde, hasta });
    this.desmarcados.set(new Set());
    this.conEntradaMarcados.set(new Set());
    if (!desde || !hasta || hasta < desde) {
      return;
    }
    // Hasta hoy (lo futuro no tiene nada) y a lo sumo seis semanas: la lista enseña 31 días.
    const tope = [hasta, this.hoy(), this.sumarDias(desde, 45)].sort()[0];
    if (desde > tope) {
      return;
    }
    this.reporteDe(desde, tope).subscribe({
      next: r => {
        if (id === this.idUsuario()) {
          this.diasConocidos.update(m => new Map([...m, ...(r.dias ?? []).filter(d => id == null || d.idUsuario === id).map(d => [d.fecha, d] as const)]));
        }
      },
      error: () => { /* sin lo del rango, la lista enseña los días con lo que ya se sabía */ }
    });
  }

  /** Si la solicitud cubre ese día. */
  marcado(f: DiaQueCubre): boolean {
    return f.marcable && (f.sinMarcar ? this.conEntradaMarcados().has(f.fecha) : !this.desmarcados().has(f.fecha));
  }

  alternarDia(f: DiaQueCubre): void {
    (f.sinMarcar ? this.conEntradaMarcados : this.desmarcados).update(s => {
      const copia = new Set(s);
      copia.has(f.fecha) ? copia.delete(f.fecha) : copia.add(f.fecha);
      return copia;
    });
    this.error.set('');
  }

  /**
   * Los tramos seguidos de días marcados. Uno desmarcado en medio parte la solicitud en dos; lo trabajado o
   * no laborable no corta, porque en esos días la solicitud no cambia nada. Con descanso médico, el día con
   * entrada sin marcar sí corta: dentro del tramo contaría como no trabajado.
   */
  private tramos(): { desde: string; hasta: string }[] {
    const tramos: { desde: string; hasta: string }[] = [];
    let actual: { desde: string; hasta: string } | null = null;
    for (const f of this.diasQueCubre() ?? []) {
      if (!f.marcable) {
        continue;
      }
      if (!this.marcado(f)) {
        actual = null;
      } else if (actual) {
        actual.hasta = f.fecha;
      } else {
        actual = { desde: f.fecha, hasta: f.fecha };
        tramos.push(actual);
      }
    }
    return tramos;
  }

  elegirTipo(id: number): void {
    this.nuevo.idTipoDia = id;
    this.idTipoNuevo.set(id);
    this.conEntradaMarcados.set(new Set());
    this.error.set('');
    this.faltaMarcar.set(false);
    if (!this.pideCertificado()) {
      this.archivo.set(null);
    }
    // Lo que lleva anticipación no se pide para hoy.
    const primero = this.primerDiaFuturo();
    if (this.diaFuturo() < primero) {
      this.diaFuturo.set(this.diaHabilDespuesDe(this.sumarDias(primero, -1)));
      this.hastaFuturo.set(this.diaFuturo());
    }
    this.prever();
  }

  elegirArchivo(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    this.archivo.set(entrada.files?.[0] ?? null);
    this.error.set('');
  }

  enviar(): void {
    const idTipoDia = this.nuevo.idTipoDia;
    if (!idTipoDia) {
      this.error.set('Elige el tipo');
      return;
    }
    if (this.paraOtro() && !this.idUsuario()) {
      this.error.set('Elige para quién es');
      return;
    }
    if (this.modo() === 'tele' && this.enTeletrabajo()) {
      return;
    }

    // Cada pedido es una solicitud: un tramo de días seguidos, o un día con sus horas.
    let pedidos: { desde: string; hasta: string; trabajaDesde?: string | null; trabajaHasta?: string | null }[];
    if (this.verPasado()) {
      const fechas = this.sinCompletar().filter(f => this.marcados().has(f.fecha)).map(f => f.fecha);
      if (!fechas.length) {
        this.faltaMarcar.set(true);
        return;
      }
      pedidos = this.seguidos(fechas);
    } else if (this.verFuturo()) {
      const p = this.prevista();
      if (!p) {
        return;  // el error ya dice por qué no se puede, o todavía calcula
      }
      const porHoras = this.que() !== 'todo';
      pedidos = [{
        desde: this.diaFuturo(),
        hasta: porHoras ? this.diaFuturo() : this.hastaDelFuturo(),
        trabajaDesde: porHoras ? p.trabajaDesde : null,
        trabajaHasta: porHoras ? p.trabajaHasta : null
      }];
    } else if (this.verTeleHoras()) {
      if (!this.prevista()) {
        return;
      }
      pedidos = [{ desde: this.diaFuturo(), hasta: this.diaFuturo() }];
    } else {
      if (this.nuevo.fechaHasta < this.nuevo.fechaDesde) {
        this.error.set('La fecha final no puede ser anterior a la inicial');
        return;
      }
      pedidos = this.tramos();
      if (!pedidos.length) {
        this.error.set('Marca al menos un día');
        return;
      }
      const primerDia = this.primerDia();
      if (primerDia && pedidos[0].desde < primerDia) {
        this.error.set(avisoAnticipacion(this.tipoElegido()!));
        return;
      }
    }

    if (this.tipoElegido()?.exigeCertificado && !this.archivo() && !this.conservaAdjunto()) {
      this.error.set(`${this.tipoElegido()!.nombre} necesita ${this.modo() === 'cita' ? 'la constancia adjunta' : 'certificado adjunto'}`);
      return;
    }
    if (!this.nuevo.comentario.trim()) {
      this.errorComentario.set(true);
      document.getElementById('j-comentario')?.focus();
      return;
    }

    this.error.set('');
    this.enviando.set(true);
    const editando = this.editando();
    const idUsuario = this.idUsuario();
    const nombre = this.nombrePersona();
    const comentario = this.nuevo.comentario.trim();
    const archivo = this.pideCertificado() ? this.archivo() : null;
    const horas = this.verTeleHoras() ? this.horasTele() : {};
    // Al modificar, el primer tramo es la misma solicitud; si marcó días sueltos, los demás son nuevas.
    from(pedidos).pipe(
      concatMap((pedido, i) => {
        const datos = { idTipoDia, fechaDesde: pedido.desde, fechaHasta: pedido.hasta, comentario, archivo,
                        trabajaDesde: pedido.trabajaDesde ?? null, trabajaHasta: pedido.trabajaHasta ?? null, ...horas };
        return editando && i === 0
          ? this.servicio.modificarJustificacion(editando.id, datos)
          : this.servicio.crearJustificacion({ ...datos, idUsuario });
      }),
      toArray()
    ).subscribe({
      next: hechas => {
        this.enviando.set(false);
        this.toast.success(idUsuario != null ? `Registrada para ${nombre} y enviada a RR.HH.`
          : editando
            ? (editando.estado === 'PENDIENTE' ? 'Solicitud modificada' : 'Solicitud modificada. Vuelve a revisión')
            : hechas.length === 1
              ? 'Solicitud enviada. La revisará tu supervisora'
              : `${hechas.length} solicitudes enviadas. Las revisará tu supervisora`);
        this.listo.emit();
      },
      error: respuesta => {
        this.enviando.set(false);
        this.error.set(respuesta?.error?.error ?? (editando ? 'No se pudo guardar la solicitud' : 'No se pudo enviar la solicitud'));
        // Si alguna llegó a guardarse, que la pantalla la muestre.
        if (!editando) {
          this.listo.emit();
        }
      }
    });
  }

  /** Agrupa fechas en tramos de días seguidos: cada tramo es una solicitud. */
  private seguidos(fechas: string[]): { desde: string; hasta: string }[] {
    const tramos: { desde: string; hasta: string }[] = [];
    for (const f of [...fechas].sort()) {
      const ultimo = tramos[tramos.length - 1];
      if (ultimo && this.sumarDias(ultimo.hasta, 1) === f) {
        ultimo.hasta = f;
      } else {
        tramos.push({ desde: f, hasta: f });
      }
    }
    return tramos;
  }

  /** El siguiente día de lunes a viernes. */
  private diaHabilDespuesDe(fecha: string): string {
    let f = this.sumarDias(fecha, 1);
    while ([0, 6].includes(new Date(f + 'T00:00:00').getDay())) {
      f = this.sumarDias(f, 1);
    }
    return f;
  }

  /** El archivo elegido; al modificar, el que ya tiene; si no, qué adjuntar. */
  protected textoAdjunto(): string {
    const elegido = this.archivo()?.name;
    if (elegido) {
      return elegido;
    }
    if (this.conservaAdjunto()) {
      return this.editando()?.archivoNombre || 'Adjunto actual';
    }
    return this.modo() === 'cita' ? 'Adjuntar constancia' : 'Adjuntar certificado';
  }

  /** «Lunes 28/09». */
  diaLargo(fecha: string): string {
    return `${DIAS_LARGOS[new Date(fecha + 'T00:00:00').getDay()]} ${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`;
  }

  protected hhmm(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  /** Fechas locales: con toISOString, en Lima, desde las 19:00 ya es el día siguiente. */
  protected hoy(): string {
    return hoyLocal();
  }

  private sumarDias(fecha: string, dias: number): string {
    return sumarDiasLocal(fecha, dias);
  }
}
