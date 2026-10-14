import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';
import { EUI } from './entregables-ui';

/** La subcartera elegida, con los nombres de su jerarquía. idSubcartera null = todavía no hay. */
export interface SeleccionSubcartera {
  idProveedor: number | null;
  idCartera: number | null;
  idSubcartera: number | null;
  proveedor: string;
  cartera: string;
  subcartera: string;
}

const CLAVE = 'entregables.filtro';

/**
 * Proveedor › Cartera › Subcartera para las dos pantallas de entregables.
 *
 * Usa los mismos catálogos que el resto de reportes, así que cada usuario ve solo lo
 * que tiene asignado. Recuerda la última subcartera elegida y, cuando un nivel tiene
 * una sola opción, la toma sola: quien trabaja siempre la misma no vuelve a elegirla.
 */
@Component({
  selector: 'app-filtro-subcartera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-wrap items-end gap-2.5">
      <div class="flex flex-col gap-1.5">
        <label for="fs-prov" [class]="ui.label">Proveedor</label>
        <select id="fs-prov" [(ngModel)]="filtro.idProveedor" (ngModelChange)="onProveedor($event)"
                [disabled]="proveedores().length === 0" [class]="ui.input">
          <option [ngValue]="null">Elegir proveedor</option>
          @for (p of proveedores(); track p.id) {
            <option [ngValue]="p.id">{{ p.nombreInquilino }}</option>
          }
        </select>
      </div>

      <span class="pb-2.5 text-[#c5ccd6]" aria-hidden="true">&rsaquo;</span>

      <div class="flex flex-col gap-1.5">
        <label for="fs-car" [class]="ui.label">Cartera</label>
        <select id="fs-car" [(ngModel)]="filtro.idCartera" (ngModelChange)="onCartera($event)"
                [disabled]="carteras().length === 0" [class]="ui.input">
          <option [ngValue]="null">Elegir cartera</option>
          @for (c of carteras(); track c.id) {
            <option [ngValue]="c.id">{{ c.nombreCartera }}</option>
          }
        </select>
      </div>

      <span class="pb-2.5 text-[#c5ccd6]" aria-hidden="true">&rsaquo;</span>

      <div class="flex flex-col gap-1.5">
        <label for="fs-sub" [class]="ui.label">Subcartera</label>
        <select id="fs-sub" [(ngModel)]="filtro.idSubcartera" (ngModelChange)="onSubcartera($event)"
                [disabled]="subcarteras().length === 0" [class]="ui.input">
          <option [ngValue]="null">Elegir subcartera</option>
          @for (s of subcarteras(); track s.id) {
            <option [ngValue]="s.id">{{ s.nombreSubcartera }}</option>
          }
        </select>
      </div>
    </div>
  `
})
export class FiltroSubcarteraComponent implements OnInit {
  @Output() seleccion = new EventEmitter<SeleccionSubcartera>();

  readonly ui = EUI;

  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  filtro = {
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null
  };

  /** Lo que se intenta reponer al cargar: la última subcartera que se eligió. */
  private recordado = this.leerRecordado();

  constructor(private comisionesService: ComisionesService) {}

  ngOnInit(): void {
    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => {
        const activos = data.filter(p => p.estaActivo !== false);
        this.proveedores.set(activos);
        const id = this.elegir(activos, this.recordado?.idProveedor);
        if (id != null) {
          this.filtro.idProveedor = id;
          this.cargarCarteras(id);
        }
      },
      error: (err) => console.error('Error cargando proveedores:', err)
    });
  }

  onProveedor(idProveedor: number | null): void {
    this.recordado = null;
    this.filtro.idProveedor = idProveedor;
    this.filtro.idCartera = null;
    this.filtro.idSubcartera = null;
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.emitir();
    if (idProveedor) this.cargarCarteras(idProveedor);
  }

  onCartera(idCartera: number | null): void {
    this.recordado = null;
    this.filtro.idCartera = idCartera;
    this.filtro.idSubcartera = null;
    this.subcarteras.set([]);
    this.emitir();
    if (idCartera) this.cargarSubcarteras(idCartera);
  }

  onSubcartera(idSubcartera: number | null): void {
    this.recordado = null;
    this.filtro.idSubcartera = idSubcartera;
    this.emitir();
  }

  private cargarCarteras(idProveedor: number): void {
    this.comisionesService.obtenerCarteras(idProveedor).subscribe({
      next: (data) => {
        const activas = data.filter(c => c.estaActivo !== false);
        this.carteras.set(activas);
        const id = this.elegir(activas, this.recordado?.idCartera);
        if (id != null) {
          this.filtro.idCartera = id;
          this.cargarSubcarteras(id);
        }
      },
      error: (err) => console.error('Error cargando carteras:', err)
    });
  }

  private cargarSubcarteras(idCartera: number): void {
    this.comisionesService.obtenerSubcarteras(idCartera).subscribe({
      next: (data) => {
        const activas = data.filter(s => s.estaActivo !== false);
        this.subcarteras.set(activas);
        const id = this.elegir(activas, this.recordado?.idSubcartera);
        if (id != null) {
          this.filtro.idSubcartera = id;
          this.emitir();
        }
      },
      error: (err) => console.error('Error cargando subcarteras:', err)
    });
  }

  /** La opción recordada si sigue en la lista; si no, la única que haya. */
  private elegir(lista: { id: number }[], recordada: number | null | undefined): number | null {
    if (recordada != null && lista.some(x => x.id === recordada)) return recordada;
    return lista.length === 1 ? lista[0].id : null;
  }

  private emitir(): void {
    const f = this.filtro;
    if (f.idSubcartera != null) this.recordar();
    this.seleccion.emit({
      idProveedor: f.idProveedor,
      idCartera: f.idCartera,
      idSubcartera: f.idSubcartera,
      proveedor: this.proveedores().find(p => p.id === f.idProveedor)?.nombreInquilino ?? '',
      cartera: this.carteras().find(c => c.id === f.idCartera)?.nombreCartera ?? '',
      subcartera: this.subcarteras().find(s => s.id === f.idSubcartera)?.nombreSubcartera ?? ''
    });
  }

  private recordar(): void {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(this.filtro));
    } catch {
      // Sin almacenamiento disponible: solo deja de recordarse.
    }
  }

  private leerRecordado(): { idProveedor: number | null; idCartera: number | null; idSubcartera: number | null } | null {
    try {
      const guardado = localStorage.getItem(CLAVE);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  }
}
