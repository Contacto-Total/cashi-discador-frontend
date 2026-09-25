import { ChangeDetectionStrategy, Component, OnInit, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import { Cartera, EstadisticasBaseAjuste, Inquilino, Subcartera } from '../models/comision.model';
import { descargar, mensajeError, nombreArchivo, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Base de ajuste: promesas pagadas del mes marcadas con fecha de envío, para controlar ajustes.
 * Misma función que la pestaña del módulo anterior (endpoints /base-ajuste sin cambios).
 */
@Component({
  selector: 'cmx-base-ajuste',
  standalone: true,
  imports: [FormsModule, AppNumberPipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] gap-6">
      <section class="cmx-shell cmx-enter" aria-labelledby="cmx-ba-titulo">
        <div class="cmx-core">
          <header class="cmx-card-head">
            <div class="flex-1">
              <h2 id="cmx-ba-titulo" class="font-bold text-[0.98rem]">Base de ajuste · {{ nombreMes(mes()) }} {{ anio() }}</h2>
              <p class="cmx-muted text-[0.78rem]">Promesas pagadas con fecha de envío, para el control de ajustes.</p>
            </div>
          </header>

          <div class="cmx-card-body flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label class="flex flex-col gap-1.5">
                <span class="cmx-label">Proveedor</span>
                <select class="cmx-select" [ngModel]="idInquilino()" (ngModelChange)="elegirInquilino($event)">
                  <option [ngValue]="null">Todos</option>
                  @for (i of inquilinos(); track i.id) { <option [ngValue]="i.id">{{ i.nombreInquilino }}</option> }
                </select>
              </label>
              <label class="flex flex-col gap-1.5">
                <span class="cmx-label">Cartera</span>
                <select class="cmx-select" [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)" [disabled]="idInquilino() == null">
                  <option [ngValue]="null">Todas</option>
                  @for (c of carteras(); track c.id) { <option [ngValue]="c.id">{{ c.nombreCartera }}</option> }
                </select>
              </label>
              <label class="flex flex-col gap-1.5">
                <span class="cmx-label">Subcartera</span>
                <select class="cmx-select" [ngModel]="idSubcartera()" (ngModelChange)="elegirSubcartera($event)" [disabled]="idCartera() == null">
                  <option [ngValue]="null">Todas</option>
                  @for (s of subcarteras(); track s.id) { <option [ngValue]="s.id">{{ s.nombreSubcartera }}</option> }
                </select>
              </label>
            </div>

            @if (cargando()) {
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                @for (i of [1, 2, 3, 4]; track i) { <div class="cmx-skeleton h-24"></div> }
              </div>
            } @else if (stats() && stats()!.total_registros > 0) {
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                @for (k of kpis(); track k.etiqueta; let i = $index) {
                  <div class="rounded-2xl p-4 cmx-enter" [style.--i]="i" style="box-shadow: inset 0 0 0 1px var(--cmx-line-strong)">
                    <span class="cmx-label">{{ k.etiqueta }}</span>
                    <div class="cmx-kpi-value mt-1">
                      @if (k.moneda) { <small>S/</small> }{{ k.valor | appNumber:(k.moneda ? '1.2-2' : '1.0-0') }}
                    </div>
                  </div>
                }
              </div>
              @if (stats()!.primer_envio) {
                <p class="cmx-muted text-[0.8rem]">
                  Primer envío <b class="cmx-soft-text cmx-num">{{ stats()!.primer_envio }}</b>
                  · último envío <b class="cmx-soft-text cmx-num">{{ stats()!.ultimo_envio }}</b>
                </p>
              }
            } @else {
              <div class="cmx-empty py-10">
                <span class="cmx-empty-mark"><cmx-icon name="send" [size]="22" /></span>
                <p class="font-semibold" style="color: var(--cmx-ink)">Sin envíos en este mes</p>
                <p class="text-[0.84rem] max-w-[44ch]">Pulsa «Agregar al envío» para incluir las promesas pagadas del mes con la fecha de hoy.</p>
              </div>
            }

            <div class="flex flex-wrap gap-2">
              <button type="button" class="cmx-btn cmx-btn-primary" [disabled]="ocupado()" (click)="agregarEnvio()">
                {{ ocupado() === 'envio' ? 'Agregando…' : 'Agregar al envío' }}
                <span class="cmx-orb"><cmx-icon name="send" [size]="15" /></span>
              </button>
              <button type="button" class="cmx-btn cmx-btn-ghost"
                      [disabled]="ocupado() || !stats() || stats()!.total_registros === 0" (click)="exportar()">
                <cmx-icon name="download" [size]="16" /> {{ ocupado() === 'excel' ? 'Generando…' : 'Exportar Excel' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside class="cmx-shell cmx-enter" style="--i:1" aria-label="Cómo funciona">
        <div class="cmx-core cmx-card-body h-full">
          <span class="cmx-label">Cómo funciona</span>
          <ul class="mt-3 flex flex-col gap-3 text-[0.84rem] cmx-soft-text">
            <li class="flex gap-2.5"><span class="cmx-dot mt-2 shrink-0" style="color: var(--cmx-brand-2)"></span>Los registros nuevos se marcan con la fecha de hoy como fecha de envío.</li>
            <li class="flex gap-2.5"><span class="cmx-dot mt-2 shrink-0" style="color: var(--cmx-brand-2)"></span>Los que ya estaban en un envío conservan su fecha original.</li>
            <li class="flex gap-2.5"><span class="cmx-dot mt-2 shrink-0" style="color: var(--cmx-brand-2)"></span>El Excel trae asesor, fecha de envío, DNI, fecha de pago, monto, concepto, capital, deuda total, período, tramo y canal de pago.</li>
          </ul>
        </div>
      </aside>
    </div>
  `
})
export class BaseAjusteComponent implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  readonly anio = input.required<number>();
  readonly mes = input.required<number>();

  readonly nombreMes = nombreMes;

  readonly inquilinos = signal<Inquilino[]>([]);
  readonly carteras = signal<Cartera[]>([]);
  readonly subcarteras = signal<Subcartera[]>([]);
  readonly idInquilino = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly stats = signal<EstadisticasBaseAjuste | null>(null);
  readonly cargando = signal(false);
  readonly ocupado = signal<'envio' | 'excel' | null>(null);

  constructor() {
    effect(() => {
      this.anio();
      this.mes();
      untracked(() => this.cargarEstadisticas());
    });
  }

  ngOnInit(): void {
    this.service.obtenerInquilinos().subscribe({
      next: data => this.inquilinos.set(data),
      error: e => this.toast.error(mensajeError(e, 'No se pudieron cargar los proveedores.'))
    });
  }

  kpis(): { etiqueta: string; valor: number; moneda: boolean }[] {
    const s = this.stats();
    if (!s) {
      return [];
    }
    return [
      { etiqueta: 'Registros', valor: s.total_registros, moneda: false },
      { etiqueta: 'Envíos', valor: s.total_envios, moneda: false },
      { etiqueta: 'Asesores', valor: s.total_asesores, moneda: false },
      { etiqueta: 'Monto total', valor: s.monto_total, moneda: true }
    ];
  }

  elegirInquilino(id: number | null): void {
    this.idInquilino.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    if (id != null) {
      this.service.obtenerCarteras(id).subscribe({ next: data => this.carteras.set(data) });
    }
    this.cargarEstadisticas();
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    if (id != null) {
      this.service.obtenerSubcarteras(id).subscribe({ next: data => this.subcarteras.set(data) });
    }
    this.cargarEstadisticas();
  }

  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando.set(true);
    this.service.obtenerEstadisticasBaseAjuste(this.anio(), this.mes(), this.idSubcartera()).subscribe({
      next: s => {
        this.stats.set(s);
        this.cargando.set(false);
      },
      error: e => {
        this.stats.set(null);
        this.cargando.set(false);
        this.toast.error(mensajeError(e, 'No se pudieron cargar las estadísticas de base de ajuste.'));
      }
    });
  }

  agregarEnvio(): void {
    if (this.ocupado()) {
      return;
    }
    this.ocupado.set('envio');
    this.service.agregarEnvioBaseAjuste(this.anio(), this.mes(), this.idSubcartera()).subscribe({
      next: r => {
        this.ocupado.set(null);
        this.toast.success(r.mensaje || `${r.registrosAgregados} registros agregados al envío.`);
        this.cargarEstadisticas();
      },
      error: e => {
        this.ocupado.set(null);
        this.toast.error(mensajeError(e, 'No se pudo agregar el envío.'));
      }
    });
  }

  exportar(): void {
    if (this.ocupado()) {
      return;
    }
    this.ocupado.set('excel');
    this.service.exportarBaseAjusteExcel(this.anio(), this.mes(), this.idSubcartera()).subscribe({
      next: blob => {
        this.ocupado.set(null);
        descargar(blob, nombreArchivo('Base_Ajuste', this.anio(), String(this.mes()).padStart(2, '0')));
      },
      error: e => {
        this.ocupado.set(null);
        this.toast.error(mensajeError(e, 'No se pudo generar el Excel de base de ajuste.'));
      }
    });
  }
}
