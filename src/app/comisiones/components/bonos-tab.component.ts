import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import { BonoPeriodo, NivelBono, ReportePeriodo } from '../models/comision.model';
import {
  METRICA_INFO, ORIGENES_LTD, PRESETS_BONO, PresetBono, TIPOS_BONO, bonoDePreset, codigoPeriodo, mensajeError, nombreBono
} from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Bonos del período: solo configuración. Lo que cobra cada uno sale en Resultados (columna Bonos)
 * y en su Sustento. Cada bono de asesor tiene su lista de quién lo recibe (los nuevos entran por
 * defecto); el de supervisor va al supervisor del período.
 */
@Component({
  selector: 'cmx-bonos-tab',
  standalone: true,
  imports: [CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-note is-info cmx-enter">
      <span>Aquí solo se configuran los bonos. Lo que cobra cada uno sale en <b>Resultados</b> (columna Bonos) y, al hacer clic en la
        persona, en su <b>Sustento</b>.</span>
    </div>

    <section class="cmx-card cmx-enter" style="--i:1">
      <div class="cmx-card-h">
        Bonos de {{ codigo() }}<em>Solo para este periodo; «Copiar configuración» del mes anterior también los trae</em>
      </div>
      <div class="cmx-card-b">
        @for (b of borrador(); track $index; let i = $index) {
          <div class="cmx-bcard" [class.is-off]="!b.activo">
            <div class="cmx-bcard-h">
              <label [for]="'cmx-b-on-' + i">
                <input type="checkbox" [id]="'cmx-b-on-' + i" [checked]="b.activo" [disabled]="soloLectura()" (change)="cambiar(i, { activo: !b.activo })" />
                <b>{{ tipos[b.tipo] }}</b>
              </label>
              <span class="cmx-tag" [class.cmx-tag-s]="b.aplica === 'ASESOR'" [class.cmx-tag-b]="b.aplica === 'SUPERVISOR'">
                {{ b.aplica === 'ASESOR' ? 'Asesor' : 'Supervisor' }}
              </span>
              @if (!soloLectura()) {
                <button type="button" class="cmx-bdel" (click)="quitar(i)" [attr.aria-label]="'Quitar ' + nombre(b)"><cmx-icon name="x" [size]="14" /></button>
              }
            </div>
            <div class="cmx-bcard-b">
              <!-- Quién lo recibe -->
              @if (b.aplica === 'ASESOR') {
                <div>
                  <div class="cmx-bsub">Quién lo recibe · {{ recibenDe(b) }} de {{ asesores().length }} asesores</div>
                  <div class="cmx-borig">
                    @for (a of asesores(); track a.idUsuario) {
                      <label>
                        <input type="checkbox" [checked]="!b.excluidos.includes(a.idUsuario)" [disabled]="soloLectura()" (change)="alternarExcluido(i, a.idUsuario)" />
                        {{ a.nombre }}
                      </label>
                    } @empty {
                      <span class="cmx-muted-txt">Todavía no hay asesores en el periodo.</span>
                    }
                  </div>
                  <p class="cmx-pn">
                    Quien se agregue después al periodo entra a este bono; desmárcalo si no le corresponde.
                    @if (b.porPuesto) { El 1° y el 2° puesto se deciden solo entre quienes lo reciben. }
                  </p>
                </div>
              } @else {
                <div>
                  <div class="cmx-bsub">Quién lo recibe</div>
                  <p class="cmx-pn" style="margin:0">
                    El supervisor del periodo: {{ supervisor() || 'sin supervisor elegido' }}. Para que no lo reciba, desactiva el bono.
                  </p>
                </div>
              }

              @if (b.tipo === 'LTD') {
                <div>
                  <div class="cmx-bsub">Cuenta las gestiones del mes con <code>campo_monto_origen</code></div>
                  <div class="cmx-borig is-mono">
                    @for (o of origenesLtd; track o) {
                      <label>
                        <input type="checkbox" [checked]="b.origenes.includes(o)" [disabled]="soloLectura()" (change)="alternarOrigen(i, o)" />{{ o }}
                      </label>
                    }
                  </div>
                  @if (b.aplica === 'SUPERVISOR') { <p class="cmx-pn">El supervisor suma las LTD de todos sus asesores.</p> }
                </div>
              }
              @if (b.tipo === 'PKM') {
                <p class="cmx-hint">
                  <span>Sale de la columna <b>PKM</b> de la cartera actualizada (tabla dinámica de la subcartera, como la contención): cuenta los
                  clientes distintos de sus pagos que suman que tienen PKM.</span>
                </p>
              }
              @if (b.tipo !== 'SOBRE') {
                <p class="cmx-hint"><span><b>Los niveles se suman:</b> cada nivel alcanzado paga su monto una vez.{{ ejemploSuma(b) }}</span></p>
              } @else {
                <p class="cmx-hint"><span>Se compara el {{ metrica() }} en <b>soles</b>, no en porcentaje. Paga el nivel más alto que pase.</span></p>
                @if (b.aplica === 'ASESOR') {
                  <div>
                    <div class="cmx-bsub">Se compara con</div>
                    <div class="cmx-grid2">
                      <label class="cmx-opt" [for]="'cmx-bb-p-' + i">
                        <input type="radio" [name]="'cmx-bbase-' + i" [id]="'cmx-bb-p-' + i" [checked]="!b.baseTotal" [disabled]="soloLectura()"
                               (change)="cambiar(i, { baseTotal: false })" />
                        <span><b>Su propio {{ metrica() }}</b><span>Lo que logró cada asesor.</span></span>
                      </label>
                      <label class="cmx-opt" [for]="'cmx-bb-t-' + i">
                        <input type="radio" [name]="'cmx-bbase-' + i" [id]="'cmx-bb-t-' + i" [checked]="b.baseTotal" [disabled]="soloLectura()"
                               (change)="cambiar(i, { baseTotal: true })" />
                        <span><b>El total de la subcartera</b><span>Todos cobran si la subcartera pasa el monto.</span></span>
                      </label>
                    </div>
                    <label class="cmx-bsw" [for]="'cmx-bpu-' + i">
                      <input type="checkbox" [id]="'cmx-bpu-' + i" [checked]="b.porPuesto" [disabled]="soloLectura()" (change)="cambiar(i, { porPuesto: !b.porPuesto })" />
                      Paga por puesto: solo el 1° y el 2° (por mayor {{ metrica() }})
                    </label>
                  </div>
                }
              }

              <!-- Niveles -->
              @let puestos = b.porPuesto && b.aplica === 'ASESOR' && b.tipo === 'SOBRE';
              <div>
                <div class="cmx-bsub">{{ b.tipo === 'SOBRE' ? 'Desde (en soles) → bono' : 'Desde (cantidad) → bono' }}{{ puestos ? ' del 1° y del 2° puesto' : '' }}</div>
                @for (n of b.niveles; track $index; let j = $index) {
                  <div class="cmx-brow">
                    desde
                    <span class="cmx-money">
                      @if (b.tipo === 'SOBRE') { <span>S/</span> }
                      <input type="number" min="0" [step]="b.tipo === 'SOBRE' ? 1000 : 1" [value]="n.desde" [disabled]="soloLectura()"
                             [attr.aria-label]="'Nivel ' + (j + 1) + ': desde'" (input)="cambiarNivel(i, j, 'desde', $any($event.target).value)" />
                      @if (b.tipo !== 'SOBRE') { <span class="is-suffix">{{ b.tipo }}</span> }
                    </span>
                    → {{ puestos ? '1°' : '' }}
                    <span class="cmx-money">
                      <span>S/</span>
                      <input type="number" min="0" step="5" [value]="n.monto" [disabled]="soloLectura()"
                             [attr.aria-label]="'Nivel ' + (j + 1) + ': bono'" (input)="cambiarNivel(i, j, 'monto', $any($event.target).value)" />
                    </span>
                    @if (puestos) {
                      2°
                      <span class="cmx-money">
                        <span>S/</span>
                        <input type="number" min="0" step="5" [value]="n.montoSegundo" [disabled]="soloLectura()"
                               [attr.aria-label]="'Nivel ' + (j + 1) + ': bono del 2° puesto'" (input)="cambiarNivel(i, j, 'montoSegundo', $any($event.target).value)" />
                      </span>
                    }
                    @if (!soloLectura()) {
                      <button type="button" class="cmx-bdel" (click)="quitarNivel(i, j)" aria-label="Quitar nivel"><cmx-icon name="x" [size]="14" /></button>
                    }
                  </div>
                } @empty {
                  <div class="cmx-brow cmx-muted-txt">Sin niveles todavía.</div>
                }
                @if (!soloLectura()) {
                  <button type="button" class="cmx-btn cmx-btn-link" style="margin-top:6px" (click)="agregarNivel(i)">
                    <cmx-icon name="plus" [size]="14" /> Agregar nivel
                  </button>
                }
              </div>
            </div>
          </div>
        } @empty {
          <p class="cmx-muted-txt">Este periodo no tiene bonos.</p>
        }

        @if (!soloLectura()) {
          @if (disponibles().length) {
            <div class="cmx-baddrow">
              <select aria-label="Bono a agregar" (change)="nuevo.set($any($event.target).value)">
                @for (p of disponibles(); track p.clave) {
                  <option [value]="p.clave" [selected]="p.clave === nuevoElegido()">{{ p.etiqueta }}</option>
                }
              </select>
              <button type="button" class="cmx-btn cmx-btn-sec" (click)="agregar()"><cmx-icon name="plus" [size]="15" /> Agregar bono</button>
            </div>
          }
          @for (f of faltantes(); track f) { <div class="cmx-warnbox">{{ f }}</div> }
          <div class="cmx-bactions">
            @if (sucio()) { <span class="cmx-pn" style="margin:0 auto 0 0">Hay cambios sin guardar.</span> }
            <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="!sucio() || guardando()" (click)="descartar()">Descartar</button>
            <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!sucio() || guardando() || faltantes().length > 0" (click)="guardar()">
              <cmx-icon name="check" [size]="15" /> {{ guardando() ? 'Guardando…' : 'Guardar bonos' }}
            </button>
          </div>
        }
      </div>
    </section>
  `
})
export class BonosTabComponent {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  readonly reporte = input.required<ReportePeriodo>();
  readonly soloLectura = input(false);

  readonly guardado = output<ReportePeriodo>();

  readonly tipos = TIPOS_BONO;
  readonly origenesLtd = ORIGENES_LTD;
  readonly nombre = nombreBono;

  readonly borrador = signal<BonoPeriodo[]>([]);
  readonly nuevo = signal<PresetBono | null>(null);
  readonly guardando = signal(false);
  /** Período y bonos guardados con los que se armó el borrador */
  private base = '';

  readonly codigo = computed(() => codigoPeriodo(this.reporte().periodo.anio, this.reporte().periodo.mes));
  readonly metrica = computed(() => METRICA_INFO[this.reporte().periodo.tipoMetrica].etiqueta.toLowerCase());
  readonly asesores = computed(() => this.reporte().participantes
    .filter(p => p.rol === 'ASESOR')
    .sort((a, b) => a.nombre.localeCompare(b.nombre)));
  readonly supervisor = computed(() => this.reporte().participantes.find(p => p.rol === 'SUPERVISOR')?.nombre ?? null);

  readonly guardados = computed(() => this.limpiar(this.reporte().periodo.bonos ?? []));
  readonly sucio = computed(() => JSON.stringify(this.limpiar(this.borrador())) !== JSON.stringify(this.guardados()));

  /** Presets que todavía no están en el borrador */
  readonly disponibles = computed(() => PRESETS_BONO.filter(p => {
    const b = bonoDePreset(p.clave);
    return !this.borrador().some(x => x.tipo === b.tipo && x.aplica === b.aplica);
  }));
  readonly nuevoElegido = computed(() => {
    const d = this.disponibles();
    return d.some(p => p.clave === this.nuevo()) ? this.nuevo()! : d[0]?.clave ?? null;
  });

  readonly faltantes = computed(() => {
    const f: string[] = [];
    for (const b of this.borrador()) {
      const n = nombreBono(b);
      if (!b.niveles.length) {
        f.push(`${n}: agrega al menos un nivel.`);
      } else if (b.niveles.some(x => x.desde == null || x.monto == null || x.desde < 0 || x.monto < 0)) {
        f.push(`${n}: completa el «desde» y el monto de cada nivel.`);
      } else if (new Set(b.niveles.map(x => x.desde)).size !== b.niveles.length) {
        f.push(`${n}: hay dos niveles con el mismo «desde».`);
      }
      if (b.tipo === 'LTD' && !b.origenes.length) {
        f.push(`${n}: marca al menos un valor de campo_monto_origen.`);
      }
    }
    return f;
  });

  constructor() {
    // Otro período, o bonos guardados distintos (y sin cambios pendientes): se rearma el borrador
    effect(() => {
      const p = this.reporte().periodo;
      const clave = p.id + '|' + JSON.stringify(this.guardados());
      untracked(() => {
        const otroPeriodo = !this.base.startsWith(p.id + '|');
        if (otroPeriodo || (clave !== this.base && !this.sucio())) {
          this.descartar();
        }
        this.base = clave;
      });
    });
  }

  recibenDe(b: BonoPeriodo): number {
    return this.asesores().filter(a => !b.excluidos.includes(a.idUsuario)).length;
  }

  ejemploSuma(b: BonoPeriodo): string {
    const n = b.niveles.filter(x => x.desde != null && x.monto != null).sort((x, y) => x.desde - y.desde);
    if (n.length < 2) {
      return '';
    }
    const total = n.reduce((s, x) => s + x.monto, 0);
    return ` Con ${n[n.length - 1].desde} ${b.tipo} cobra ${n.map(x => x.monto).join(' + ')} = S/ ${total}.`;
  }

  cambiar(i: number, cambio: Partial<BonoPeriodo>): void {
    this.borrador.update(l => l.map((b, j) => j === i ? { ...b, ...cambio } : b));
  }

  alternarExcluido(i: number, idUsuario: number): void {
    const b = this.borrador()[i];
    this.cambiar(i, {
      excluidos: b.excluidos.includes(idUsuario) ? b.excluidos.filter(x => x !== idUsuario) : [...b.excluidos, idUsuario]
    });
  }

  alternarOrigen(i: number, origen: string): void {
    const b = this.borrador()[i];
    this.cambiar(i, {
      origenes: b.origenes.includes(origen) ? b.origenes.filter(x => x !== origen) : ORIGENES_LTD.filter(o => o === origen || b.origenes.includes(o))
    });
  }

  cambiarNivel(i: number, j: number, campo: keyof NivelBono, valor: string): void {
    const n = valor === '' ? null : Number(valor);
    const b = this.borrador()[i];
    this.cambiar(i, {
      niveles: b.niveles.map((x, k) => k === j ? { ...x, [campo]: n != null && Number.isFinite(n) ? n : null } : x)
    });
  }

  agregarNivel(i: number): void {
    const b = this.borrador()[i];
    const tope = b.niveles.reduce((m, x) => Math.max(m, x.desde ?? 0), 0);
    const monto = b.niveles.reduce((m, x) => Math.max(m, x.monto ?? 0), 0);
    const paso = b.tipo === 'SOBRE' ? 10000 : 10;
    this.cambiar(i, { niveles: [...b.niveles, { desde: tope + paso, monto: monto || 50, montoSegundo: null }] });
  }

  quitarNivel(i: number, j: number): void {
    const b = this.borrador()[i];
    this.cambiar(i, { niveles: b.niveles.filter((_, k) => k !== j) });
  }

  quitar(i: number): void {
    this.borrador.update(l => l.filter((_, j) => j !== i));
  }

  agregar(): void {
    const clave = this.nuevoElegido();
    if (!clave) {
      return;
    }
    this.borrador.update(l => [...l, bonoDePreset(clave)]);
    this.toast.info('Bono agregado · revisa sus niveles y guarda');
  }

  descartar(): void {
    this.borrador.set(structuredClone(this.reporte().periodo.bonos ?? []));
  }

  guardar(): void {
    if (!this.sucio() || this.faltantes().length) {
      return;
    }
    this.guardando.set(true);
    this.service.guardarBonos(this.reporte().periodo.id, this.limpiar(this.borrador())).subscribe({
      next: reporte => {
        this.guardando.set(false);
        const aviso = reporte.advertencias?.find(a => a.startsWith('No se pudo calcular'));
        if (aviso) {
          this.toast.warning(aviso);
        } else {
          this.toast.success(`Bonos de ${this.codigo()} guardados · recalculado`);
        }
        this.guardado.emit(reporte);
      },
      error: e => {
        this.guardando.set(false);
        this.toast.error(mensajeError(e, 'No se pudieron guardar los bonos.'));
      }
    });
  }

  /** Forma comparable y lista para enviar: niveles ordenados, sin campos que no aplican */
  private limpiar(bonos: BonoPeriodo[]): BonoPeriodo[] {
    return bonos.map(b => {
      const sobreAsesor = b.tipo === 'SOBRE' && b.aplica === 'ASESOR';
      const porPuesto = sobreAsesor && !!b.porPuesto;
      return {
        id: b.id ?? null,
        tipo: b.tipo,
        aplica: b.aplica,
        activo: !!b.activo,
        origenes: b.tipo === 'LTD' ? [...(b.origenes ?? [])].sort() : [],
        baseTotal: sobreAsesor && !!b.baseTotal,
        porPuesto,
        excluidos: b.aplica === 'ASESOR' ? [...(b.excluidos ?? [])].sort((x, y) => x - y) : [],
        niveles: [...b.niveles]
          .sort((x, y) => (x.desde ?? 0) - (y.desde ?? 0))
          .map(n => ({ desde: n.desde, monto: n.monto, montoSegundo: porPuesto ? n.montoSegundo ?? null : null }))
      };
    });
  }
}
