import { Component, EventEmitter, HostListener, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { ContextoAjuste, ETIQUETAS_TIPO_CAMBIO, FichaPagoBanco } from '../models/ajuste-conciliacion.model';
import { fechaCorta } from '../models/categoria-pago';
import { AjusteConciliacionService } from '../services/ajuste-conciliacion.service';

/** Ficha de un pago del banco en la columna derecha: carga, conciliaciones, pagos enlazados e histórico. */
@Component({
  selector: 'app-ficha-pago-lado',
  standalone: true,
  imports: [LucideAngularModule, BotonDirective, TarjetaDirective],
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  template: `
    <section appTarjeta aria-label="Ficha del pago" class="font-cashi flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pt-[clamp(.75rem,1.8vh,1rem)] pb-4 text-[.8125rem] leading-[1.45] text-foreground">
      <div class="flex flex-none items-center gap-2">
        <h2 class="m-0 mr-auto text-[.9375rem] font-bold">Ficha del pago</h2>
        <button type="button" appBoton="secundario" appBotonAlto="icono" aria-label="Cerrar ficha" title="Cerrar ficha" (click)="cerrado.emit()"><lucide-angular name="x" [size]="16"></lucide-angular></button>
      </div>
      @if (cargando()) {
        <p class="m-0 text-muted-foreground">Cargando…</p>
      } @else if (error(); as e) {
        <p role="alert" class="m-0 font-medium text-(--ro)">{{ e }}</p>
      } @else if (ficha(); as f) {
        <dl class="m-0 grid grid-cols-2 gap-x-3 gap-y-2">
          @for (d of datos(); track d.rotulo) {
            <div class="min-w-0" [class.col-span-2]="d.ancho">
              <dt class="text-[.75rem] text-muted-foreground">{{ d.rotulo }}</dt>
              <dd class="m-0 font-semibold wrap-anywhere">{{ d.valor }}</dd>
            </div>
          }
        </dl>
        <div>
          <h3 class="m-0 mb-1 text-[.8125rem] font-semibold">Conciliaciones</h3>
          @for (c of f.conciliaciones; track c.id) {
            <p class="m-0 mb-1.5">{{ c.estado === 'REVERTIDA' ? 'Revertida' : 'Aprobada' }} {{ fechaHora(c.fechaReversion || c.fechaAprobacion) }}{{ quien(c.revertidoPor || c.aprobadoPor) }}
              <span class="block text-[.75rem] text-muted-foreground">{{ c.estado === 'REVERTIDA' ? c.motivoReversion : monto(c.montoAplicado) + ' aplicado' }}</span>
            </p>
          } @empty {
            <p class="m-0 text-muted-foreground">Sin conciliaciones.</p>
          }
        </div>
        <div>
          <h3 class="m-0 mb-1 text-[.8125rem] font-semibold">Pagos del asesor enlazados</h3>
          @for (p of f.pagosAsesor; track p.pagoCuotaId) {
            <p class="m-0 mb-1.5">{{ fecha(p.fechaPago) }} · {{ monto(p.montoPago) }}
              <span class="block text-[.75rem] text-muted-foreground">{{ p.agente || 'Sin agente' }}{{ p.numeroCuota ? ', cuota ' + p.numeroCuota : '' }}, {{ p.verificadoBanco ? 'verificado por el banco' : 'sin verificar' }}</span>
            </p>
          } @empty {
            <p class="m-0 text-muted-foreground">Ninguno.</p>
          }
        </div>
        <div>
          <h3 class="m-0 mb-1 text-[.8125rem] font-semibold">Histórico</h3>
          @for (h of f.historico; track h.id) {
            <p class="m-0 mb-1.5">{{ tipo(h.tipoCambio) }}
              <span class="block text-[.75rem] text-muted-foreground">{{ fechaHora(h.fecha) }}{{ h.observacion ? ', ' + h.observacion : '' }}</span>
            </p>
          } @empty {
            <p class="m-0 text-muted-foreground">Sin cambios manuales.</p>
          }
        </div>
      }
    </section>
  `
})
export class FichaPagoLadoWidget implements OnChanges {
  @Input({ required: true }) pagoId!: number;
  @Input({ required: true }) contexto!: ContextoAjuste;
  @Input() simbolo = 'S/';
  @Output() cerrado = new EventEmitter<void>();

  private readonly ajuste = inject(AjusteConciliacionService);

  cargando = signal(false);
  error = signal<string | null>(null);
  ficha = signal<FichaPagoBanco | null>(null);

  datos = computed(() => {
    const f = this.ficha();
    if (!f) return [];
    return [
      { rotulo: 'Fecha banco', valor: this.fecha(f.fechaBanco), ancho: false },
      { rotulo: 'Monto', valor: this.monto(f.montoBanco), ancho: false },
      { rotulo: 'Pago bancario', valor: `Pb ${f.id}`, ancho: false },
      { rotulo: 'Cuenta en', valor: this.periodo(f.periodoBanco), ancho: false },
      { rotulo: 'Banco / operación', valor: `${f.banco || '—'} · ${f.numeroOperacion || '—'}`, ancho: false },
      { rotulo: 'Procesado', valor: f.procesado ? 'Sí' : 'No', ancho: false },
      { rotulo: 'Carga', valor: `${f.nombreArchivo || '—'}${f.usuarioCarga ? ', ' + f.usuarioCarga : ''}`, ancho: true }
    ];
  });

  ngOnChanges(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.ajuste.obtenerFicha(this.pagoId, this.contexto).subscribe({
      next: ficha => {
        this.ficha.set(ficha);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(err?.error?.mensaje || err?.error?.message || 'No se pudo cargar la ficha.');
        this.cargando.set(false);
      }
    });
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.cerrado.emit();
  }

  tipo(valor: string | null): string {
    return (valor && ETIQUETAS_TIPO_CAMBIO[valor]) || valor || '—';
  }

  fecha(valor: string | null | undefined): string {
    return valor ? fechaCorta(valor) : '—';
  }

  fechaHora(valor: string | null | undefined): string {
    return valor ? `${fechaCorta(valor)} ${String(valor).slice(11, 16)}`.trim() : '—';
  }

  quien(nombre: string | null): string {
    return nombre ? ` por ${nombre}` : '';
  }

  monto(valor: number | null | undefined): string {
    return `${this.simbolo} ${Number(valor ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  periodo(valor: string | null | undefined): string {
    return valor && valor.length === 6 ? `${valor.slice(4, 6)}/${valor.slice(0, 4)}` : '—';
  }
}
