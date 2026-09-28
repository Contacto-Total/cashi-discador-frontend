import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppDatePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { MotivoExclusion, PagoSustento, ReportePeriodo } from '../models/comision.model';
import { MOTIVO_INFO, mensajeError } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

type Filtro = 'TODOS' | 'SUMAN' | MotivoExclusion;

const POR_PAGINA = 50;

/**
 * Sustento de toda la subcartera: cada pago conciliado del mes, a quién se atribuyó
 * y, si no sumó, por qué. Es la foto guardada en el último cálculo.
 */
@Component({
  selector: 'cmx-sustento-tab',
  standalone: true,
  imports: [FormsModule, AppNumberPipe, AppDatePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-body">
      <div class="cmx-main is-full">
        @if (!calculado()) {
          <div class="cmx-empty">
            <span class="cmx-empty-mark"><cmx-icon name="receipt" [size]="20" /></span>
            <b>El sustento aparece cuando el período tiene cálculo</b>
            <p style="max-width:46ch">Cada cálculo guarda una foto de los pagos conciliados del mes con su atribución.</p>
          </div>
        } @else if (cargando()) {
          <div style="display:grid;gap:10px">
            <div class="cmx-skel" style="height:62px"></div>
            <div class="cmx-skel" style="height:320px"></div>
          </div>
        } @else if (error()) {
          <div class="cmx-empty">
            <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="20" /></span>
            <b>No se pudo cargar el sustento</b>
            <p>{{ error() }}</p>
            <button type="button" class="cmx-btn cmx-btn-sec" (click)="cargar()">Reintentar</button>
          </div>
        } @else {
          <div class="cmx-sumrow">
            @for (r of resumen(); track r.filtro; let i = $index) {
              <button type="button" class="cmx-sbox cmx-enter" [style.--i]="i" [attr.aria-pressed]="filtro() === r.filtro"
                      (click)="elegirFiltro(r.filtro)">
                <span class="cmx-sbox-l">{{ r.etiqueta }}</span>
                <span class="cmx-sbox-v">{{ r.cantidad | appNumber }}</span>
                <span class="cmx-sbox-m">S/ {{ r.monto | appNumber:'1.2-2' }}</span>
              </button>
            }
          </div>

          @if (motivoActivo(); as m) {
            <div class="cmx-hint cmx-enter" style="margin:0 0 14px">{{ m.descripcion }}</div>
          }

          <section class="cmx-block cmx-enter" style="--i:2" aria-labelledby="cmx-sust-titulo">
            <div class="cmx-block-head">
              <h3 id="cmx-sust-titulo" class="cmx-block-title">Pagos conciliados del mes</h3>
              <span class="cmx-block-desc">foto guardada en el último cálculo</span>
              <label class="cmx-search" style="margin:0 0 0 auto;min-width:260px">
                <span class="sr-only">Buscar por documento, cliente, asesor u operación</span>
                <span class="cmx-search-ic"><cmx-icon name="search" [size]="15" /></span>
                <input type="search" placeholder="Documento, cliente, asesor u operación"
                       [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event); pagina.set(0)" />
              </label>
            </div>
            <div class="cmx-tw">
              <table class="cmx-table">
                <thead>
                  <tr>
                    <th scope="col">Fecha banco</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Asesor de la gestión</th>
                    <th scope="col">Operación</th>
                    <th scope="col" class="n">Monto</th>
                    @if (conContencion()) { <th scope="col">Contención</th> }
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of paginaActual(); track p.conciliacionId) {
                    <tr [class.is-muted]="p.motivoExclusion">
                      <td class="cmx-num">{{ p.fechaBanco | appDate }}</td>
                      <td class="who">{{ p.nombreCliente || 'Sin nombre' }}<span class="cmx-role cmx-num">{{ p.documentoCliente }}</span></td>
                      <td>{{ p.nombreAgenteGestion || '—' }}<span class="cmx-role">Gestión {{ p.idGestion }}</span></td>
                      <td class="cmx-num">{{ p.numeroOperacion || '—' }}<span class="cmx-role">{{ p.banco }}</span></td>
                      <td class="n">{{ p.montoAplicado | appNumber:'1.2-2' }}</td>
                      @if (conContencion()) {
                        <td>
                          @if (p.contencion) {
                            <span class="cmx-tag" [class.cmx-tag-d]="esContenido(p)" [class.cmx-tag-s]="!esContenido(p)">{{ p.contencion }}</span>
                          } @else {
                            <span class="cmx-tag cmx-tag-off">No está en la tabla</span>
                          }
                        </td>
                      }
                      <td>
                        @if (p.motivoExclusion) {
                          <span class="cmx-tag cmx-tag-v" [attr.title]="motivos[p.motivoExclusion].descripcion">{{ motivos[p.motivoExclusion].etiqueta }}</span>
                        } @else {
                          <span class="cmx-tag cmx-tag-d">Suma</span>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td [attr.colspan]="conContencion() ? 7 : 6" class="empty">
                        {{ pagos().length ? 'Ningún pago coincide con el filtro.' : 'No hay pagos conciliados en el mes.' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="cmx-block-foot">
              <span class="cmx-num">{{ filtrados().length | appNumber }} pagos · S/ {{ montoFiltrado() | appNumber:'1.2-2' }}</span>
              @if (paginas() > 1) {
                <span style="display:flex;align-items:center;gap:4px">
                  <button type="button" class="cmx-icon-btn" [disabled]="pagina() === 0" (click)="pagina.set(pagina() - 1)" aria-label="Página anterior">
                    <cmx-icon name="chevron-left" [size]="16" />
                  </button>
                  <span class="cmx-num">{{ pagina() + 1 }} / {{ paginas() }}</span>
                  <button type="button" class="cmx-icon-btn" [disabled]="pagina() >= paginas() - 1" (click)="pagina.set(pagina() + 1)" aria-label="Página siguiente">
                    <cmx-icon name="chevron-right" [size]="16" />
                  </button>
                </span>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `
})
export class SustentoTabComponent {
  private readonly service = inject(ComisionesService);

  readonly reporte = input.required<ReportePeriodo>();

  readonly motivos = MOTIVO_INFO;

  readonly pagos = signal<PagoSustento[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly filtro = signal<Filtro>('TODOS');
  readonly busqueda = signal('');
  readonly pagina = signal(0);

  readonly calculado = computed(() => !!this.reporte().periodo.fechaCalculo);
  readonly conContencion = computed(() => this.reporte().periodo.tipoMetrica === 'CONTENCION');

  readonly resumen = computed(() => {
    const pagos = this.pagos();
    const grupo = (f: (p: PagoSustento) => boolean) => {
      const lista = pagos.filter(f);
      return { cantidad: lista.length, monto: lista.reduce((s, p) => s + p.montoAplicado, 0) };
    };
    // "No contenido" solo tiene sentido en T3
    const motivos = (Object.keys(MOTIVO_INFO) as MotivoExclusion[])
      .filter(m => m !== 'NO_CONTENIDO' || this.conContencion());
    return [
      { filtro: 'TODOS' as Filtro, etiqueta: 'Todos', ...grupo(() => true) },
      { filtro: 'SUMAN' as Filtro, etiqueta: 'Suman', ...grupo(p => !p.motivoExclusion) },
      ...motivos.map(m => ({ filtro: m as Filtro, etiqueta: MOTIVO_INFO[m].etiqueta, ...grupo(p => p.motivoExclusion === m) }))
    ];
  });

  readonly motivoActivo = computed(() => {
    const f = this.filtro();
    return f === 'TODOS' || f === 'SUMAN' ? null : MOTIVO_INFO[f];
  });

  readonly filtrados = computed(() => {
    const f = this.filtro();
    const texto = this.busqueda().trim().toLowerCase();
    return this.pagos().filter(p =>
      (f === 'TODOS' || (f === 'SUMAN' ? !p.motivoExclusion : p.motivoExclusion === f))
      && (!texto || [p.documentoCliente, p.nombreCliente, p.nombreAgenteGestion, p.numeroOperacion]
        .some(v => (v ?? '').toLowerCase().includes(texto)))
    );
  });

  readonly montoFiltrado = computed(() => this.filtrados().reduce((s, p) => s + p.montoAplicado, 0));
  readonly paginas = computed(() => Math.max(Math.ceil(this.filtrados().length / POR_PAGINA), 1));
  readonly paginaActual = computed(() => this.filtrados().slice(this.pagina() * POR_PAGINA, (this.pagina() + 1) * POR_PAGINA));

  constructor() {
    // Recarga cuando cambia el período o su cálculo
    effect(() => {
      const periodo = this.reporte().periodo;
      const clave = `${periodo.id}|${periodo.fechaCalculo}`;
      untracked(() => {
        if (clave !== this.ultimaClave) {
          this.ultimaClave = clave;
          this.cargar();
        }
      });
    });
  }

  private ultimaClave = '';

  cargar(): void {
    const periodo = this.reporte().periodo;
    if (!periodo.fechaCalculo) {
      this.pagos.set([]);
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.service.obtenerSustento(periodo.id).subscribe({
      next: s => {
        this.pagos.set(s.pagos);
        this.pagina.set(0);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'No se pudo cargar el sustento.'));
      }
    });
  }

  elegirFiltro(f: Filtro): void {
    this.filtro.set(f);
    this.pagina.set(0);
  }

  esContenido(p: PagoSustento): boolean {
    return (p.contencion ?? '').trim().toUpperCase() === 'CONTENIDO';
  }
}
