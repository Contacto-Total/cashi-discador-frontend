import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComisionesService } from '../services/comisiones.service';
import { Cartera, Inquilino, ReportePeriodo, Subcartera, TipoMetrica } from '../models/comision.model';
import { MESES, METRICA_INFO, mensajeError, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Panel lateral para crear un período de comisiones.
 * La meta no se escribe: sale de la meta INTERNA del reporte de producción.
 * Si la subcartera tuvo un período antes, se copian sus tramos y roles.
 */
@Component({
  selector: 'cmx-crear-periodo-panel',
  standalone: true,
  imports: [FormsModule, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-overlay" (click)="cerrar.emit()"></div>
    <section class="cmx-panel" role="dialog" aria-modal="true" aria-labelledby="cmx-crear-titulo"
             (keydown.escape)="cerrar.emit()">
      <header class="cmx-panel-head">
        <div class="flex-1">
          <span class="cmx-eyebrow">Nuevo período</span>
          <h2 id="cmx-crear-titulo" class="cmx-h2 mt-3">Abrir comisiones de una subcartera</h2>
          <p class="cmx-muted text-sm mt-1 max-w-[52ch]">
            La meta se toma de la meta interna del reporte de producción. Si la subcartera tuvo un período antes,
            se copian sus tramos y roles.
          </p>
        </div>
        <button type="button" class="cmx-icon-btn" (click)="cerrar.emit()" aria-label="Cerrar panel">
          <cmx-icon name="x" />
        </button>
      </header>

      <div class="cmx-panel-body">
        <form class="flex flex-col gap-6" (ngSubmit)="crear()" id="cmx-form-crear">
          <fieldset class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <legend class="cmx-label mb-2 col-span-full">Período</legend>
            <label class="flex flex-col gap-1.5">
              <span class="cmx-label">Mes</span>
              <select class="cmx-select" name="mes" [ngModel]="mes()" (ngModelChange)="mes.set($event)">
                @for (m of meses; track $index) {
                  <option [ngValue]="$index + 1">{{ m }}</option>
                }
              </select>
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="cmx-label">Año</span>
              <input class="cmx-input cmx-input-num" type="number" name="anio" min="2024" max="2100"
                     [ngModel]="anio()" (ngModelChange)="anio.set(+$event)" />
            </label>
          </fieldset>

          <fieldset class="flex flex-col gap-4">
            <legend class="cmx-label mb-2">Subcartera</legend>
            <label class="flex flex-col gap-1.5">
              <span class="cmx-label">Proveedor</span>
              <select class="cmx-select" name="inquilino" [ngModel]="idInquilino()" (ngModelChange)="elegirInquilino($event)">
                <option [ngValue]="null">Elige un proveedor</option>
                @for (i of inquilinos(); track i.id) {
                  <option [ngValue]="i.id">{{ i.nombreInquilino }}</option>
                }
              </select>
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="cmx-label">Cartera</span>
              <select class="cmx-select" name="cartera" [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)"
                      [disabled]="!carteras().length">
                <option [ngValue]="null">{{ idInquilino() ? 'Elige una cartera' : 'Primero elige el proveedor' }}</option>
                @for (c of carteras(); track c.id) {
                  <option [ngValue]="c.id">{{ c.nombreCartera }}</option>
                }
              </select>
            </label>
            <label class="flex flex-col gap-1.5">
              <span class="cmx-label">Subcartera</span>
              <select class="cmx-select" name="subcartera" [ngModel]="idSubcartera()" (ngModelChange)="idSubcartera.set($event)"
                      [disabled]="!subcarteras().length">
                <option [ngValue]="null">{{ idCartera() ? 'Elige una subcartera' : 'Primero elige la cartera' }}</option>
                @for (s of subcarteras(); track s.id) {
                  <option [ngValue]="s.id" [disabled]="yaExiste(s.id)">
                    {{ s.nombreSubcartera }}{{ yaExiste(s.id) ? ' · ya tiene período' : '' }}
                  </option>
                }
              </select>
            </label>
          </fieldset>

          <fieldset class="flex flex-col gap-3">
            <legend class="cmx-label mb-2">Qué se mide contra la meta</legend>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Métrica">
              @for (t of metricas; track t) {
                <button type="button" role="radio" [attr.aria-checked]="tipo() === t" (click)="tipo.set(t)"
                        class="text-left rounded-2xl p-4 transition-[box-shadow,background-color] duration-300 cursor-pointer"
                        [style.box-shadow]="tipo() === t ? 'inset 0 0 0 1.5px var(--cmx-brand-2), 0 0 0 4px var(--cmx-brand-soft)' : 'inset 0 0 0 1px var(--cmx-line-strong)'"
                        [style.background]="tipo() === t ? 'var(--cmx-surface)' : 'var(--cmx-soft)'">
                  <span class="flex items-center justify-between gap-2">
                    <span class="font-semibold text-[0.9rem]">{{ metricaInfo[t].etiqueta }}</span>
                    @if (tipo() === t) {
                      <span class="cmx-tag cmx-tag-brand"><cmx-icon name="check" [size]="12" /> Elegida</span>
                    }
                  </span>
                  <span class="block cmx-muted text-[0.8rem] mt-1.5 leading-snug">{{ metricaInfo[t].descripcion }}</span>
                </button>
              }
            </div>
            <p class="cmx-muted text-[0.78rem]">T3 se mide por contención; Castigo, Propia y T5 por recaudo.</p>
          </fieldset>

          @if (error()) {
            <div class="cmx-banner" role="alert">
              <cmx-icon name="alert" />
              <span>{{ error() }}</span>
            </div>
          }
        </form>
      </div>

      <footer class="cmx-panel-foot">
        <button type="button" class="cmx-btn cmx-btn-ghost" (click)="cerrar.emit()">Cancelar</button>
        <button type="submit" form="cmx-form-crear" class="cmx-btn cmx-btn-primary" [disabled]="!valido() || guardando()">
          {{ guardando() ? 'Creando…' : 'Crear período de ' + nombreMes(mes()) }}
          <span class="cmx-orb">
            @if (guardando()) {
              <cmx-icon name="refresh" [size]="15" class="cmx-spin" />
            } @else {
              <cmx-icon name="arrow-up-right" [size]="15" />
            }
          </span>
        </button>
      </footer>
    </section>
  `
})
export class CrearPeriodoPanelComponent implements OnInit {
  private readonly service = inject(ComisionesService);

  /** Mes y año con que se abre el panel (el que se está viendo) */
  readonly anioInicial = input.required<number>();
  readonly mesInicial = input.required<number>();
  /** Subcarteras que ya tienen período en el mes visto */
  readonly subcarterasConPeriodo = input<number[]>([]);

  readonly cerrar = output<void>();
  readonly creado = output<ReportePeriodo>();

  readonly meses = MESES;
  readonly metricas: TipoMetrica[] = ['RECAUDO', 'CONTENCION'];
  readonly metricaInfo = METRICA_INFO;
  readonly nombreMes = nombreMes;

  readonly anio = signal(new Date().getFullYear());
  readonly mes = signal(new Date().getMonth() + 1);
  readonly inquilinos = signal<Inquilino[]>([]);
  readonly carteras = signal<Cartera[]>([]);
  readonly subcarteras = signal<Subcartera[]>([]);
  readonly idInquilino = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly tipo = signal<TipoMetrica>('RECAUDO');
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  readonly valido = computed(() =>
    this.idSubcartera() != null && this.mes() >= 1 && this.mes() <= 12 && this.anio() >= 2024
  );

  ngOnInit(): void {
    this.anio.set(this.anioInicial());
    this.mes.set(this.mesInicial());
    this.service.obtenerInquilinos().subscribe({
      next: data => this.inquilinos.set(data),
      error: e => this.error.set(mensajeError(e, 'No se pudieron cargar los proveedores.'))
    });
  }

  yaExiste(idSubcartera: number): boolean {
    return this.anio() === this.anioInicial() && this.mes() === this.mesInicial()
      && this.subcarterasConPeriodo().includes(idSubcartera);
  }

  elegirInquilino(id: number | null): void {
    this.idInquilino.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    if (id != null) {
      this.service.obtenerCarteras(id).subscribe({
        next: data => this.carteras.set(data),
        error: e => this.error.set(mensajeError(e, 'No se pudieron cargar las carteras.'))
      });
    }
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    if (id != null) {
      this.service.obtenerSubcarteras(id).subscribe({
        next: data => this.subcarteras.set(data),
        error: e => this.error.set(mensajeError(e, 'No se pudieron cargar las subcarteras.'))
      });
    }
  }

  crear(): void {
    const idSubcartera = this.idSubcartera();
    if (!this.valido() || idSubcartera == null || this.guardando()) {
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    this.service.crearPeriodo({
      idSubcartera,
      anio: this.anio(),
      mes: this.mes(),
      tipoMetrica: this.tipo()
    }).subscribe({
      next: reporte => {
        this.guardando.set(false);
        this.creado.emit(reporte);
      },
      error: e => {
        this.guardando.set(false);
        this.error.set(mensajeError(e, 'No se pudo crear el período.'));
      }
    });
  }
}
