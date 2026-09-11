import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  HistorialMetaReporteProduccion,
  ProduccionReportService,
  TipoMetaReporteProduccion
} from './produccion-report.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Cartera, Inquilino, Subcartera } from '../../../comisiones/models/comision.model';

@Component({
  selector: 'app-produccion-metas-historico',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-100 p-4 dark:bg-gray-900 md:p-6">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white"><lucide-angular name="history" [size]="24" class="text-indigo-500"></lucide-angular>Histórico de metas</h1>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Movimientos de Meta Interna y Meta SIP por contexto.</p>
        </div>
        <button type="button" (click)="volverAlReporte()" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">Volver al reporte</button>
      </div>

      <div class="mb-4 rounded-xl bg-white p-3 shadow-md dark:bg-gray-800">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div><label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Proveedor</label><select [(ngModel)]="filtros.idTenant" (ngModelChange)="onProveedorChange($event)" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"><option [ngValue]="null">Selecciona proveedor</option>@for (item of proveedores(); track item.id) { <option [ngValue]="item.id">{{ item.nombreInquilino }}</option> }</select></div>
          <div><label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Cartera</label><select [(ngModel)]="filtros.idCartera" (ngModelChange)="onCarteraChange($event)" [disabled]="!filtros.idTenant" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"><option [ngValue]="null">Selecciona cartera</option>@for (item of carteras(); track item.id) { <option [ngValue]="item.id">{{ item.nombreCartera }}</option> }</select></div>
          <div><label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Subcartera</label><select [(ngModel)]="filtros.idSubcartera" [disabled]="!filtros.idCartera" class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"><option [ngValue]="null">Selecciona subcartera</option>@for (item of subcarteras(); track item.id) { <option [ngValue]="item.id">{{ item.nombreSubcartera }}</option> }</select></div>
          <div><label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Tipo</label><div class="flex gap-1"><button type="button" (click)="filtros.tipoMeta = 'INTERNA'" [class]="filtros.tipoMeta === 'INTERNA' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'" class="flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold">Interna</button><button type="button" (click)="filtros.tipoMeta = 'SIP'" [class]="filtros.tipoMeta === 'SIP' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'" class="flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold">SIP</button></div></div>
          <div class="flex items-end"><button type="button" (click)="cargarHistorial(0)" [disabled]="!contextoSeleccionado() || cargando()" class="w-full rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">Consultar</button></div>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
        <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-700"><h2 class="text-sm font-bold text-gray-800 dark:text-white">Movimientos registrados</h2></div>
        <div class="overflow-x-auto"><table class="w-full min-w-[720px] text-sm"><thead class="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-300"><tr><th class="px-4 py-3">Valor</th><th class="px-4 py-3">Vigencia</th><th class="px-4 py-3">Estado</th><th class="px-4 py-3">Usuario</th><th class="px-4 py-3">Fecha de registro</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-700">@if (cargando()) { <tr><td colspan="5" class="px-4 py-10 text-center text-gray-500">Cargando histórico...</td></tr> } @else { @for (item of historial(); track item.id) { <tr><td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">S/ {{ item.valorMeta | number:'1.2-2' }}</td><td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ item.fechaVigencia }}</td><td class="px-4 py-3"><span [class]="item.activo ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'" class="rounded-full px-2 py-1 text-xs font-semibold">{{ item.activo ? 'Activa' : 'Inactiva' }}</span></td><td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ item.actualizadoPor }}</td><td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ item.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</td></tr> } @empty { <tr><td colspan="5" class="px-4 py-10 text-center text-gray-500">Selecciona un contexto para consultar el histórico.</td></tr> } }</tbody></table></div>
        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 px-4 py-3 dark:border-gray-700"><span class="text-sm text-gray-500">Página {{ pagina() + 1 }} de {{ totalPaginas() || 1 }}</span><button type="button" (click)="cargarHistorial(pagina() - 1)" [disabled]="pagina() === 0" class="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50">Anterior</button><button type="button" (click)="cargarHistorial(pagina() + 1)" [disabled]="pagina() + 1 >= totalPaginas()" class="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50">Siguiente</button></div>
      </div>
    </div>
  `
})
export class ProduccionMetasHistoricoComponent implements OnInit {
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);
  historial = signal<HistorialMetaReporteProduccion[]>([]);
  cargando = signal(false);
  pagina = signal(0);
  totalPaginas = signal(0);
  filtros = { idTenant: null as number | null, idCartera: null as number | null, idSubcartera: null as number | null, tipoMeta: 'INTERNA' as TipoMetaReporteProduccion };

  constructor(private reporteService: ProduccionReportService, private comisionesService: ComisionesService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.comisionesService.obtenerInquilinos().subscribe({ next: data => this.proveedores.set(data) });
    this.route.queryParams.subscribe(params => this.aplicarContexto(params));
  }

  onProveedorChange(idTenant: number | null): void {
    this.filtros.idCartera = null;
    this.filtros.idSubcartera = null;
    this.carteras.set([]);
    this.subcarteras.set([]);
    if (idTenant) this.comisionesService.obtenerCarteras(idTenant).subscribe({ next: data => this.carteras.set(data) });
  }

  onCarteraChange(idCartera: number | null): void {
    this.filtros.idSubcartera = null;
    this.subcarteras.set([]);
    if (idCartera) this.comisionesService.obtenerSubcarteras(idCartera).subscribe({ next: data => this.subcarteras.set(data) });
  }

  cargarHistorial(pagina: number): void {
    if (!this.contextoSeleccionado() || pagina < 0 || (this.totalPaginas() && pagina >= this.totalPaginas())) return;
    this.cargando.set(true);
    this.reporteService.getHistorial(this.filtros.idTenant!, this.filtros.idCartera!, this.filtros.idSubcartera!, this.filtros.tipoMeta, pagina).subscribe({
      next: response => { this.historial.set(response.content); this.pagina.set(response.number); this.totalPaginas.set(response.totalPages); this.cargando.set(false); },
      error: error => { console.error('Error cargando histórico:', error); this.cargando.set(false); }
    });
  }

  volverAlReporte(): void { this.router.navigate(['/reports/produccion']); }

  contextoSeleccionado(): boolean { return this.filtros.idTenant !== null && this.filtros.idCartera !== null && this.filtros.idSubcartera !== null; }

  private aplicarContexto(params: Record<string, string>): void {
    const idTenant = Number(params['idTenant']);
    const idCartera = Number(params['idCartera']);
    const idSubcartera = Number(params['idSubcartera']);
    if (!idTenant || !idCartera || !idSubcartera) return;
    this.filtros.idTenant = idTenant;
    this.filtros.idCartera = idCartera;
    this.filtros.idSubcartera = idSubcartera;
    this.filtros.tipoMeta = params['tipoMeta'] === 'SIP' ? 'SIP' : 'INTERNA';
    this.comisionesService.obtenerCarteras(idTenant).subscribe({ next: carteras => {
      this.carteras.set(carteras);
      this.comisionesService.obtenerSubcarteras(idCartera).subscribe({ next: subcarteras => { this.subcarteras.set(subcarteras); this.cargarHistorial(0); } });
    } });
  }
}
