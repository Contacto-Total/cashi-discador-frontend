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
 * y, si no sumó, por qué.
 */
@Component({
  selector: 'cmx-sustento-tab',
  standalone: true,
  imports: [FormsModule, AppNumberPipe, AppDatePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!calculado()) {
      <div class="cmx-shell cmx-enter">
        <div class="cmx-core">
          <div class="cmx-empty">
            <span class="cmx-empty-mark"><cmx-icon name="receipt" [size]="22" /></span>
            <p class="font-semibold" style="color: var(--cmx-ink)">El sustento aparece al calcular</p>
            <p class="max-w-[46ch] text-[0.86rem]">Cada cálculo guarda una foto de los pagos conciliados del mes con su atribución.</p>
          </div>
        </div>
      </div>
    } @else if (cargando()) {
      <div class="flex flex-col gap-3">
        <div class="cmx-skeleton h-24"></div>
        <div class="cmx-skeleton h-96"></div>
      </div>
    } @else if (error()) {
      <div class="cmx-banner" role="alert">
        <cmx-icon name="alert" />
        <span class="flex-1">{{ error() }}</span>
        <button type="button" class="cmx-btn cmx-btn-ghost cmx-btn-sm" (click)="cargar()">Reintentar</button>
      </div>
    } @else {
      <!-- Resumen por motivo -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        @for (r of resumen(); track r.filtro; let i = $index) {
          <button type="button" class="cmx-shell cmx-enter text-left cursor-pointer" [style.--i]="i"
                  [attr.aria-pressed]="filtro() === r.filtro" (click)="elegirFiltro(r.filtro)"
                  [style.box-shadow]="filtro() === r.filtro ? 'inset 0 0 0 1.5px var(--cmx-ink)' : null">
            <span class="cmx-core cmx-kpi block h-full">
              <span class="cmx-label block">{{ r.etiqueta }}</span>
              <span class="block cmx-num font-bold text-[1.2rem] mt-1 tracking-tight">{{ r.cantidad | appNumber }}</span>
              <span class="block cmx-muted cmx-num text-[0.76rem]">S/ {{ r.monto | appNumber:'1.2-2' }}</span>
            </span>
          </button>
        }
      </div>

      @if (motivoActivo(); as m) {
        <div class="cmx-banner cmx-banner-neutral mt-4">
          <cmx-icon name="info" />
          <span>{{ m.descripcion }}</span>
        </div>
      }

      <section class="cmx-shell mt-5 cmx-enter" style="--i:3">
        <div class="cmx-core">
          <header class="cmx-card-head">
            <label class="relative flex-1 min-w-[14rem] max-w-md">
              <span class="sr-only">Buscar por documento, cliente, asesor u operación</span>
              <span class="absolute left-3 top-1/2 -translate-y-1/2 cmx-muted"><cmx-icon name="search" [size]="16" /></span>
              <input class="cmx-input pl-9" type="search" placeholder="Documento, cliente, asesor u operación"
                     [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event); pagina.set(0)" />
            </label>
            <span class="ml-auto cmx-muted text-[0.8rem] cmx-num">
              {{ filtrados().length | appNumber }} pagos · S/ {{ montoFiltrado() | appNumber:'1.2-2' }}
            </span>
          </header>

          <div class="cmx-table-wrap">
            <table class="cmx-table">
              <thead>
                <tr>
                  <th scope="col">Fecha banco</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Asesor de la gestión</th>
                  <th scope="col">Operación</th>
                  <th scope="col" class="n">Monto</th>
                  @if (conContencion()) {
                    <th scope="col">Contención</th>
                    <th scope="col" class="n">Capital asignado</th>
                  }
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (p of paginaActual(); track p.conciliacionId) {
                  <tr [class.is-muted]="p.motivoExclusion">
                    <td class="cmx-num whitespace-nowrap">{{ p.fechaBanco | appDate }}</td>
                    <td>
                      <span class="font-semibold block">{{ p.nombreCliente || 'Sin nombre' }}</span>
                      <span class="cmx-muted cmx-num text-[0.76rem]">{{ p.documentoCliente }}</span>
                    </td>
                    <td>
                      {{ p.nombreAgenteGestion || '—' }}
                      <span class="cmx-muted text-[0.74rem] block">Gestión {{ p.idGestion }}</span>
                    </td>
                    <td class="whitespace-nowrap">
                      <span class="cmx-num">{{ p.numeroOperacion || '—' }}</span>
                      <span class="cmx-muted text-[0.74rem] block">{{ p.banco }}</span>
                    </td>
                    <td class="n font-semibold">{{ p.montoAplicado | appNumber:'1.2-2' }}</td>
                    @if (conContencion()) {
                      <td>
                        @if (p.contencion) {
                          <span class="cmx-tag" [class.cmx-tag-brand]="esContenido(p)">{{ p.contencion }}</span>
                        } @else {
                          <span class="cmx-muted text-[0.78rem]">No está en la tabla</span>
                        }
                      </td>
                      <td class="n">{{ p.capitalAsignado != null ? (p.capitalAsignado | appNumber:'1.2-2') : '—' }}</td>
                    }
                    <td>
                      @if (p.motivoExclusion) {
                        <span class="cmx-tag cmx-tag-amber" [attr.title]="motivos[p.motivoExclusion].descripcion">
                          {{ motivos[p.motivoExclusion].etiqueta }}
                        </span>
                      } @else {
                        <span class="cmx-tag cmx-tag-brand"><span class="cmx-dot"></span>Suma</span>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td [attr.colspan]="conContencion() ? 8 : 6" class="text-center cmx-muted py-10 text-[0.86rem]">
                      {{ pagos().length ? 'Ningún pago coincide con el filtro.' : 'No hay pagos conciliados en el mes.' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (paginas() > 1) {
            <footer class="flex items-center justify-between gap-3 px-5 py-3 border-t" style="border-color: var(--cmx-line)">
              <span class="cmx-muted text-[0.78rem] cmx-num">
                {{ pagina() * porPagina + 1 }}–{{ min((pagina() + 1) * porPagina, filtrados().length) }} de {{ filtrados().length | appNumber }}
              </span>
              <div class="flex items-center gap-1">
                <button type="button" class="cmx-icon-btn" [disabled]="pagina() === 0" (click)="pagina.set(pagina() - 1)"
                        aria-label="Página anterior"><cmx-icon name="chevron-left" /></button>
                <span class="cmx-num text-[0.8rem] px-2">{{ pagina() + 1 }} / {{ paginas() }}</span>
                <button type="button" class="cmx-icon-btn" [disabled]="pagina() >= paginas() - 1" (click)="pagina.set(pagina() + 1)"
                        aria-label="Página siguiente"><cmx-icon name="chevron-right" /></button>
              </div>
            </footer>
          }
        </div>
      </section>
    }
  `
})
export class SustentoTabComponent {
  private readonly service = inject(ComisionesService);

  readonly reporte = input.required<ReportePeriodo>();

  readonly motivos = MOTIVO_INFO;
  readonly porPagina = POR_PAGINA;
  readonly min = Math.min;

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
    const motivos = Object.keys(MOTIVO_INFO) as MotivoExclusion[];
    return [
      { filtro: 'TODOS' as Filtro, etiqueta: 'Todos los pagos', ...grupo(() => true) },
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
