import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { NombrePropioPipe } from '../../../shared/ui/nombre-propio.pipe';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { CABECERA, CABECERA_TEXTO, CAMPO, ETIQUETA, FILTROS, LISTA, PANTALLA, SUBTITULO, TITULO } from '../../asistencia/ui/clases';
import { SegmentadoComponent } from '../../asistencia/ui/segmentado.component';
import { GrabacionesComponent } from './grabaciones/grabaciones.component';
import { MonitoreoEstado } from './monitoreo/monitoreo-estado';
import { MonitoreoListaComponent } from './monitoreo/monitoreo-lista.component';

/**
 * Grabaciones del Discador: buscar y descargar grabaciones, y el monitoreo de lo que evaluó el speech. Arriba,
 * el ámbito (Cliente › Cartera › Subcartera) y las pestañas; cada pestaña pinta esta cabecera dentro de su
 * tarjeta. Sin subcartera elegida no se lista nada.
 */
@Component({
  selector: 'app-grabaciones-discador',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [NombrePropioPipe, SegmentadoComponent, MonitoreoListaComponent, GrabacionesComponent],
  template: `
    <ng-template #cabecera>
      <div [class]="CABECERA">
        <div [class]="CABECERA_TEXTO">
          <p role="heading" aria-level="1" [class]="TITULO">Grabaciones del Discador</p>
          <p [class]="SUBTITULO">Grabaciones de llamadas por cliente, cartera y subcartera</p>
        </div>
        <div [class]="FILTROS">
          <div [class]="CAMPO">
            <label for="gd-cli" [class]="ETIQUETA">Cliente</label>
            <select id="gd-cli" [class]="LISTA" (change)="elegirCliente(+$any($event.target).value || null)">
              <option value="" [selected]="!e.idCliente()">Seleccionar</option>
              @for (c of clientes(); track c.id) { <option [value]="c.id" [selected]="c.id === e.idCliente()">{{ c.tenantName || c.businessName }}</option> }
            </select>
          </div>
          <div [class]="CAMPO">
            <label for="gd-car" [class]="ETIQUETA">Cartera</label>
            <select id="gd-car" [class]="LISTA" [disabled]="!carteras().length" (change)="elegirCartera(+$any($event.target).value || null)">
              <option value="" [selected]="!e.idCartera()">Seleccionar</option>
              @for (c of carteras(); track c.id) { <option [value]="c.id" [selected]="c.id === e.idCartera()">{{ c.portfolioName | nombrePropio }}</option> }
            </select>
          </div>
          <div [class]="CAMPO">
            <label for="gd-sub" [class]="ETIQUETA">Subcartera</label>
            <select id="gd-sub" [class]="LISTA" [disabled]="!subcarteras().length" (change)="elegirSubcartera(+$any($event.target).value || null)">
              <option value="" [selected]="!e.idSubcartera()">Seleccionar</option>
              @for (s of subcarteras(); track s.id) { <option [value]="s.id" [selected]="s.id === e.idSubcartera()">{{ s.subPortfolioName | nombrePropio }}</option> }
            </select>
          </div>
        </div>
      </div>
      <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
        <app-segmentado [opciones]="PESTANAS" [valor]="e.pestana()" (cambiar)="e.pestana.set($any($event))" />
      </div>
    </ng-template>

    @if (e.pestana() === 'monitoreo') {
      <app-monitoreo-lista [cabecera]="cabecera" />
    } @else {
      <app-grabaciones [cabecera]="cabecera" />
    }
  `
})
export class GrabacionesDiscadorComponent implements OnInit {
  private readonly toast = inject(ToastService);
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);
  protected readonly e = inject(MonitoreoEstado);
  private readonly ruta = inject(ActivatedRoute);

  protected readonly CABECERA = CABECERA; protected readonly CABECERA_TEXTO = CABECERA_TEXTO; protected readonly TITULO = TITULO;
  protected readonly SUBTITULO = SUBTITULO; protected readonly FILTROS = FILTROS; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA;
  protected readonly LISTA = LISTA;
  protected readonly PESTANAS = [{ clave: 'grabaciones', texto: 'Grabaciones' }, { clave: 'monitoreo', texto: 'Monitoreo' }];

  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);

  ngOnInit(): void {
    // ?tab=monitoreo abre esa pestaña (enlaces directos y vuelta desde la revisión).
    if (this.ruta.snapshot.queryParamMap.get('tab') === 'monitoreo') this.e.pestana.set('monitoreo');
    this.clientesServicio.getAllTenants().subscribe({
      next: c => this.clientes.set([...c].sort((a, b) => (a.tenantName || a.businessName).localeCompare(b.tenantName || b.businessName))),
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
    // Al volver de una revisión, el ámbito elegido sigue: se recargan sus listas.
    const cli = this.e.idCliente(), car = this.e.idCartera();
    if (cli) this.cargarCarteras(cli, false);
    if (car) this.cargarSubcarteras(car, false);
  }

  elegirCliente(id: number | null): void {
    this.e.idCliente.set(id);
    this.e.idCartera.set(null);
    this.e.idSubcartera.set(null);
    this.e.cambiarAmbito();
    this.carteras.set([]);
    this.subcarteras.set([]);
    if (id) this.cargarCarteras(id, true);
  }

  elegirCartera(id: number | null): void {
    this.e.idCartera.set(id);
    this.e.idSubcartera.set(null);
    this.e.cambiarAmbito();
    this.subcarteras.set([]);
    if (id) this.cargarSubcarteras(id, true);
  }

  elegirSubcartera(id: number | null): void {
    this.e.idSubcartera.set(id);
    this.e.cambiarAmbito();
  }

  private cargarCarteras(id: number, elegirUnica: boolean): void {
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => {
        const ordenadas = [...c].sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.carteras.set(ordenadas);
        if (elegirUnica && ordenadas.length === 1) this.elegirCartera(ordenadas[0].id);
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  private cargarSubcarteras(id: number, elegirUnica: boolean): void {
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(ordenadas);
        if (elegirUnica && ordenadas.length === 1) this.elegirSubcartera(ordenadas[0].id);
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }
}
