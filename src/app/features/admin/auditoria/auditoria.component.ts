import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppDateTimePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { AuditoriaService } from './services/auditoria.service';
import {
  ConfigAuditoria,
  ConfigAuditoriaLog,
  LlamadaResumen,
  LlamadaTiming,
  PasoTiming
} from './models/auditoria.model';

type Tab = 'control' | 'llamadas' | 'detalle';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DatePipe, AppDateTimePipe, AppNumberPipe],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {

  // Tab activa
  activeTab = signal<Tab>('control');

  // --- Control: switch + log ----------------------------------------------
  config = signal<ConfigAuditoria | null>(null);
  configLoading = signal(false);
  configLog = signal<ConfigAuditoriaLog[]>([]);
  toggleProcessing = signal(false);

  // --- Llamadas: lista paginada -------------------------------------------
  filtroFecha = signal<string>(this.hoyISO());
  filtroEstado = signal<string>('');
  estadosDisponibles = ['', 'FINALIZADA', 'NO_CONTESTADA', 'SIN_RESPUESTA', 'ABANDONADA', 'FALLIDA'];
  llamadas = signal<LlamadaResumen[]>([]);
  llamadasLoading = signal(false);
  page = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    // Mostrar hasta 5 paginas centradas en current
    const start = Math.max(0, current - 2);
    const end = Math.min(total, start + 5);
    return Array.from({ length: end - start }, (_, i) => start + i);
  });

  // --- Detalle: timeline de una llamada -----------------------------------
  detalle = signal<LlamadaTiming | null>(null);
  detalleLoading = signal(false);
  uuidConsulta = signal('');

  // Max duracion para escalar las barras del timeline
  maxDuracionMs = computed(() => {
    const d = this.detalle();
    if (!d) return 1;
    return Math.max(1, ...d.pasos.map(p => p.duracionMs ?? 0));
  });

  constructor(private service: AuditoriaService) {}

  ngOnInit(): void {
    this.cargarConfig();
    this.cargarConfigLog();
    this.cargarLlamadas();
  }

  // --- Tabs ----------------------------------------------------------------

  setTab(t: Tab): void {
    this.activeTab.set(t);
    if (t === 'llamadas' && this.llamadas().length === 0) {
      this.cargarLlamadas();
    }
  }

  // --- Control -------------------------------------------------------------

  cargarConfig(): void {
    this.configLoading.set(true);
    this.service.getConfig().subscribe({
      next: c => { this.config.set(c); this.configLoading.set(false); },
      error: _ => { this.configLoading.set(false); }
    });
  }

  cargarConfigLog(): void {
    this.service.getConfigLog(50).subscribe({
      next: log => this.configLog.set(log)
    });
  }

  toggle(): void {
    const c = this.config();
    if (!c) return;
    const nuevoEstado = !c.activo;
    if (!confirm(`¿Confirmas ${nuevoEstado ? 'ACTIVAR' : 'DESACTIVAR'} la auditoria global?`)) {
      return;
    }
    this.toggleProcessing.set(true);
    this.service.toggle(nuevoEstado).subscribe({
      next: c => {
        this.config.set(c);
        this.toggleProcessing.set(false);
        this.cargarConfigLog();
      },
      error: _ => { this.toggleProcessing.set(false); }
    });
  }

  // --- Llamadas ------------------------------------------------------------

  cargarLlamadas(): void {
    this.llamadasLoading.set(true);
    this.service.listarLlamadas(
      this.filtroFecha() || undefined,
      this.filtroEstado() || undefined,
      this.page(),
      this.pageSize()
    ).subscribe({
      next: r => {
        this.llamadas.set(r.content);
        this.totalElements.set(r.totalElements);
        this.totalPages.set(r.totalPages);
        this.llamadasLoading.set(false);
      },
      error: _ => { this.llamadasLoading.set(false); }
    });
  }

  cambiarPagina(p: number): void {
    if (p < 0 || p >= this.totalPages()) return;
    this.page.set(p);
    this.cargarLlamadas();
  }

  aplicarFiltros(): void {
    this.page.set(0);
    this.cargarLlamadas();
  }

  // --- Detalle -------------------------------------------------------------

  abrirDetalle(uuid: string): void {
    this.uuidConsulta.set(uuid);
    this.setTab('detalle');
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    const uuid = this.uuidConsulta().trim();
    if (!uuid) return;
    this.detalleLoading.set(true);
    this.detalle.set(null);
    this.service.detalleLlamada(uuid).subscribe({
      next: d => { this.detalle.set(d); this.detalleLoading.set(false); },
      error: _ => { this.detalleLoading.set(false); }
    });
  }

  // --- Helpers de UI -------------------------------------------------------

  /** Ancho relativo (0-100) de la barra de duracion. */
  anchoBarra(paso: PasoTiming): number {
    if (!paso.duracionMs) return 0;
    return Math.min(100, (paso.duracionMs / this.maxDuracionMs()) * 100);
  }

  /** Formatea una duracion en ms a string legible: "1,234.56ms" o "2.45s". */
  fmtDuracion(ms: number | null | undefined): string {
    if (ms == null) return '—';
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    return `${(ms / 1000).toFixed(3)} s`;
  }

  /** Color de fondo de la barra segun la velocidad del paso. */
  colorBarra(paso: PasoTiming): string {
    if (!paso.duracionMs) return '#94a3b8'; // slate-400
    if (paso.duracionMs < 200) return '#22c55e';   // green-500: muy rapido
    if (paso.duracionMs < 2000) return '#3b82f6';  // blue-500: normal
    if (paso.duracionMs < 10000) return '#f59e0b'; // amber-500: lento
    return '#ef4444';                              // red-500: muy lento
  }

  badgeEstado(estado: string | null): string {
    switch (estado) {
      case 'FINALIZADA': return 'bg-green-100 text-green-800';
      case 'NO_CONTESTADA': return 'bg-yellow-100 text-yellow-800';
      case 'SIN_RESPUESTA': return 'bg-orange-100 text-orange-800';
      case 'ABANDONADA': return 'bg-purple-100 text-purple-800';
      case 'FALLIDA': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  private hoyISO(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
