import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import { AmbitoAsistencia, CambioAsistencia, TipoCambio } from './asistencia.models';
import { hoy, sumarDias } from './asistencia.estilos';
import {
  BARRA, BARRA_ESTADO, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, CAMPO, ENTRADA, ETIQUETA, LISTA, PRINCIPAL, REJILLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TR, VACIO, ZONA
} from './ui/clases';
import { BOTON_SEC } from './ui/control-comun';
import { MedidorTabla } from './ui/medidor-tabla';
import { PiePaginaComponent } from './ui/pie-pagina.component';

/** Cómo se dice cada tipo de cambio: los mismos nombres que en el resto de la pantalla. */
const TIPOS: Record<TipoCambio, string> = {
  MARCACION: 'Marcas', RECUPERACION: 'Recuperación', SOLICITUD: 'Solicitud', REGLA: 'Reglas', FERIADO: 'Calendario', CIERRE: 'Cierre',
  INGRESO_CESE: 'Personal', VACACIONES: 'Vacaciones', PERSONAL: 'Personal', INHABILITACION: 'Inhabilitación'
};
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;

/**
 * Auditoría: el único historial del módulo. Toda marca corregida, recuperación, solicitud, regla, feriado
 * y cierre, con su valor anterior, el nuevo, el motivo y quién lo hizo. Sin fechas, los últimos tres meses.
 */
@Component({
  selector: 'app-control-auditoria',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, PiePaginaComponent],
  template: `
    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)]'">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />
        <div class="mb-4 flex flex-none flex-wrap items-end gap-x-3 gap-y-2">
          <div [class]="CAMPO + ' flex-[1_1_8.5rem]'">
            <label for="aud-tipo" [class]="ETIQUETA">Tipo</label>
            <select id="aud-tipo" [class]="LISTA" (change)="tipo.set($any($event.target).value); pagina.set(1)">
              <option value="" [selected]="!tipo()">Todos</option>
              @for (t of tipos(); track t) { <option [value]="t" [selected]="t === tipo()">{{ t }}</option> }
            </select>
          </div>
          <div [class]="CAMPO + ' flex-[1_1_8.5rem]'">
            <label for="aud-d" [class]="ETIQUETA">Desde</label>
            <input id="aud-d" type="date" [class]="ENTRADA" [value]="desde()" (change)="desde.set($any($event.target).value)">
          </div>
          <div [class]="CAMPO + ' flex-[1_1_8.5rem]'">
            <label for="aud-h" [class]="ETIQUETA">Hasta</label>
            <input id="aud-h" type="date" [class]="ENTRADA" [value]="hasta()" (change)="hasta.set($any($event.target).value)">
          </div>
          <div [class]="CAMPO + ' flex-[1.5_1_12rem]'">
            <label for="aud-q" [class]="ETIQUETA">Buscar</label>
            <div [class]="BUSCAR">
              <span [class]="BUSCAR_ICONO"><lucide-angular name="search" [size]="16" class="flex"></lucide-angular></span>
              <input id="aud-q" [class]="BUSCAR_CAMPO" placeholder="Persona, detalle o usuario" [value]="busqueda()" (input)="busqueda.set($any($event.target).value); pagina.set(1)">
            </div>
          </div>
        </div>

        <div #zona [class]="ZONA">
          @if (cargando() && !cambios().length) {
            <div [class]="VACIO">Cargando…</div>
          } @else if (!lista().length) {
            <div [class]="VACIO">Sin registros con esos filtros</div>
          } @else {
            <div class="flex flex-[1_0_auto] flex-col">
              <div #caja [class]="TABLA_CAJA">
                <table [class]="TABLA">
                  <thead [class]="THEAD"><tr [class]="TR">
                    <th [class]="TH">Fecha</th><th [class]="TH">Tipo</th><th [class]="TH">Persona o ámbito</th><th [class]="TH">Detalle</th>
                    <th [class]="TH">Valor anterior</th><th [class]="TH">Valor nuevo</th><th [class]="TH">Motivo</th><th [class]="TH">Registró</th>
                  </tr></thead>
                  <tbody>
                    @for (c of paginaLista(); track c.id) {
                      <tr [class]="TR">
                        <td [class]="TD_1">{{ corta(c.fecha) }}<span [class]="SEC">{{ c.fecha.slice(11, 16) }}</span></td>
                        <td [class]="TD">{{ TIPOS[c.tipo] }}</td>
                        <td [class]="TD">{{ c.asesor || c.ambito || '—' }}</td>
                        <td [class]="RES">{{ c.detalle }}</td>
                        <td [class]="TD">{{ c.valorAnterior || '—' }}</td>
                        <td [class]="TD">{{ c.valorNuevo || '—' }}</td>
                        <td [class]="RES">{{ c.motivo || '—' }}</td>
                        <td [class]="TD">{{ c.usuario }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <app-pie-pagina [total]="lista().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="pagina.set($event)" />
            </div>
          }
        </div>
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="BARRA_ESTADO">{{ lista().length === 1 ? '1 registro' : lista().length + ' registros' }}</span>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="descargar()">
        <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel
      </button>
    </div>
  `
})
export class ControlAuditoriaComponent implements OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  readonly cabecera = input.required<TemplateRef<unknown>>();
  readonly ambito = input.required<AmbitoAsistencia>();
  readonly subcartera = input<string | null>(null);
  readonly lunes = input.required<string>();

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH;
  /** En esta tabla todas las celdas pueden partir línea, como en el artifact. */
  protected readonly TD = TD.replace('whitespace-nowrap', 'whitespace-normal'); protected readonly TD_1 = TD_1.replace('whitespace-nowrap', 'whitespace-normal'); protected readonly SEC = SEC; protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO;
  protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly LISTA = LISTA; protected readonly ENTRADA = ENTRADA;
  protected readonly BUSCAR = BUSCAR; protected readonly BUSCAR_CAMPO = BUSCAR_CAMPO; protected readonly BUSCAR_ICONO = BUSCAR_ICONO; protected readonly BOTON_SEC = BOTON_SEC;
  protected readonly TIPOS = TIPOS; protected readonly corta = corta;
  /** Detalle y motivo: el texto largo se acomoda en varias líneas. */
  protected readonly RES = TD.replace('whitespace-nowrap', 'whitespace-normal min-w-[8.5rem] max-w-[18rem]');

  readonly cambios = signal<CambioAsistencia[]>([]);
  readonly cargando = signal(false);
  readonly tipo = signal('');
  readonly desde = signal('');
  readonly hasta = signal('');
  readonly busqueda = signal('');
  readonly pagina = signal(1);
  private pedido = 0;

  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.caja?.nativeElement, total: this.lista().length, amplia: false,
    clave: `${this.tipo()}|${this.busqueda()}|${this.lista().length}`
  }));
  readonly porPagina = this.medidor.porPagina;

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;

  constructor() {
    // Sin fechas puestas, los últimos tres meses.
    effect(() => {
      const desde = this.desde() || sumarDias(hoy(), -90), hasta = this.hasta() || hoy(), sub = this.ambito().idSubcartera ?? null;
      untracked(() => this.cargar(desde, hasta, sub));
    });
  }

  ngOnDestroy(): void {
    this.medidor.cerrar();
  }

  private cargar(desde: string, hasta: string, sub: number | null): void {
    const pedido = ++this.pedido;
    this.pagina.set(1);
    if (desde > hasta) {
      this.cambios.set([]);
      return;
    }
    this.cargando.set(true);
    this.servicio.auditoria(desde, hasta, sub).subscribe({
      next: c => { if (pedido === this.pedido) { this.cambios.set(c); this.cargando.set(false); } },
      error: () => { if (pedido === this.pedido) { this.cargando.set(false); this.toast.error('No se pudo cargar la auditoría'); } }
    });
  }

  /** Los tipos que de verdad aparecen, no el catálogo entero. */
  readonly tipos = computed(() => [...new Set(this.cambios().map(c => TIPOS[c.tipo]))].sort());

  readonly lista = computed(() => {
    const t = this.tipo(), q = this.busqueda().trim().toLowerCase();
    return this.cambios().filter(c => (!t || TIPOS[c.tipo] === t)
      && (!q || `${c.asesor ?? ''} ${c.ambito ?? ''} ${c.detalle} ${c.usuario}`.toLowerCase().includes(q)));
  });
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.lista().length / this.porPagina()))));
  readonly paginaLista = computed(() => {
    const ini = (this.paginaActual() - 1) * this.porPagina();
    return this.lista().slice(ini, ini + this.porPagina());
  });

  /** Lo filtrado, todas las páginas: se arma en el navegador porque es exactamente lo que hay en pantalla. */
  descargar(): void {
    const cabecera = ['Fecha', 'Tipo', 'Persona o ámbito', 'Detalle', 'Valor anterior', 'Valor nuevo', 'Motivo', 'Registró'];
    const filas = this.lista().map(c => [c.fecha.replace('T', ' ').slice(0, 16), TIPOS[c.tipo], c.asesor ?? c.ambito ?? '', c.detalle,
      c.valorAnterior ?? '', c.valorNuevo ?? '', c.motivo ?? '', c.usuario]);
    const csv = [cabecera, ...filas].map(f => f.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `Auditoria_${this.desde() || sumarDias(hoy(), -90)}_al_${this.hasta() || hoy()}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
  }
}
