import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, Subscription, debounceTime, forkJoin, of, switchMap, catchError } from 'rxjs';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { ControlIntensidadService } from '../../control-intensidad/control-intensidad.service';
import {
  CampaignContingenciaService, ColumnaBase, FiltroContingencia, FilasContingencia,
  PrioridadContingencia, TipoFiltro, UsuarioAcceso, ValorColumna, VACIO
} from './campaign-contingencia.service';
import { AuthService } from '../../../core/services/auth.service';

const TAMANO_PAGINA = 50;
const MAX_PRIORIDAD = 5;

/**
 * Campaña de contingencia (REQ-038): la base de la subcartera como en Excel. Se excluyen filas con
 * filtros por columna, se ordena la prioridad de discado y se crea la campaña con lo que queda.
 * No guarda los filtros: cada campaña se arma de nuevo.
 */
@Component({
  selector: 'app-campaign-contingencia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, DragDropModule],
  templateUrl: './campaign-contingencia.component.html'
})
export class CampaignContingenciaComponent implements OnInit, OnDestroy {
  private api = inject(CampaignContingenciaService);
  private tenantService = inject(TenantService);
  private portfolioService = inject(PortfolioService);
  private controlIntensidad = inject(ControlIntensidadService);
  private router = inject(Router);

  // ── Accesos: solo un ADMIN ve el botón y decide a quién se le da la contingencia ──
  readonly esAdmin = inject(AuthService).hasAnyRole('ADMIN');
  modalAccesos = false;
  usuariosAcceso: UsuarioAcceso[] = [];
  cargandoAccesos = false;
  errorAccesos = '';
  buscarUsuario = '';
  guardandoAcceso = new Set<number>();

  readonly VACIO = VACIO;
  readonly MAX_PRIORIDAD = MAX_PRIORIDAD;

  // Base
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  idTenant = 0;
  idPortfolio = 0;
  idSubcartera = 0;
  columnas: ColumnaBase[] = [];
  cargandoColumnas = false;

  // Filtros, prioridad y tabla
  filtros: FiltroContingencia[] = [];
  excluyePorFiltro: Record<string, number> = {};
  prioridad: PrioridadContingencia[] = [];
  columnaNuevaPrioridad = '';
  resultado: FilasContingencia | null = null;
  pagina = 0;
  cargando = false;
  error = '';

  // Filtro abierto
  abierta: ColumnaBase | null = null;
  popTop = 0;
  popLeft = 0;
  valores: ValorColumna[] = [];
  cargandoValores = false;
  buscar = '';
  excluidos = new Set<string>();
  modoFecha: 'LISTA' | 'RANGO' = 'LISTA';
  numOp: TipoFiltro = 'MENOR';
  numDesde = '';
  numHasta = '';
  fechaDesde = '';
  fechaHasta = '';
  previewExcluye: number | null = null;

  // Generar
  modalGenerar = false;
  generando = false;
  generada: { campaignId: number; contactosImportados: number } | null = null;
  errorGenerar = '';
  nombre = '';
  fechaInicio = '';
  fechaFin = '';
  modoDiscado: 'MANUAL' | 'PROGRESSIVE' | 'PREDICTIVE' = 'PREDICTIVE';
  intensidad = 50;
  subcarterasAutomaticas: number[] = [];

  private cargaSub?: Subscription;
  private buscar$ = new Subject<string>();
  private preview$ = new Subject<void>();
  private subs: Subscription[] = [];
  private numero = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 });

  ngOnInit(): void {
    this.tenantService.getAllTenants().subscribe({ next: t => this.tenants = t, error: () => this.tenants = [] });
    this.controlIntensidad.subcarterasAutomaticas().subscribe({
      next: ids => this.subcarterasAutomaticas = ids,
      error: () => this.subcarterasAutomaticas = []
    });
    this.subs.push(this.buscar$.pipe(debounceTime(300)).subscribe(() => this.cargarValores()));
    this.subs.push(this.preview$.pipe(
      debounceTime(400),
      switchMap(() => {
        const candidato = this.filtroDelPopover();
        if (!candidato || !this.abierta) return of(null);
        const sinEste = this.filtros.filter(f => f.columna !== this.abierta!.columna);
        return forkJoin([
          this.api.filas(this.idSubcartera, sinEste, [], 0, 0),
          this.api.filas(this.idSubcartera, [...sinEste, candidato], [], 0, 0)
        ]).pipe(catchError(() => of(null)));
      })
    ).subscribe(r => this.previewExcluye = r ? r[0].quedan - r[1].quedan : null));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.cargaSub?.unsubscribe();
  }

  // ------------------------------------------------------------ base

  onTenant(): void {
    this.idPortfolio = 0;
    this.portfolios = [];
    this.onPortfolio();
    if (this.idTenant > 0) {
      this.portfolioService.getPortfoliosByTenant(this.idTenant).subscribe({ next: p => this.portfolios = p });
    }
  }

  onPortfolio(): void {
    this.idSubcartera = 0;
    this.subPortfolios = [];
    this.onSubcartera();
    if (this.idPortfolio > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.idPortfolio).subscribe({ next: s => this.subPortfolios = s });
    }
  }

  onSubcartera(): void {
    this.columnas = [];
    this.filtros = [];
    this.excluyePorFiltro = {};
    this.prioridad = [];
    this.resultado = null;
    this.error = '';
    this.cerrarFiltro();
    if (this.idSubcartera <= 0) return;
    this.cargandoColumnas = true;
    this.api.columnas(this.idSubcartera).subscribe({
      next: cols => {
        this.columnas = cols;
        this.cargandoColumnas = false;
        this.recargar();
      },
      error: err => {
        this.cargandoColumnas = false;
        this.error = this.mensaje(err, 'No se pudo cargar la base de la subcartera');
      }
    });
  }

  /** Vuelve a la página 1 y recalcula la tabla y lo que excluye cada filtro. */
  recargar(): void {
    this.pagina = 0;
    this.cargar(true);
  }

  cargar(conConteos = false): void {
    if (this.idSubcartera <= 0) return;
    this.cargando = true;
    this.error = '';
    this.cargaSub?.unsubscribe();
    const tabla$ = this.api.filas(this.idSubcartera, this.filtros, this.prioridad, this.pagina, TAMANO_PAGINA);
    // Lo que excluye cada filtro = filas que quedarían sin él - filas que quedan con todos.
    const sin$ = conConteos && this.filtros.length
      ? forkJoin(this.filtros.map(f =>
          this.api.filas(this.idSubcartera, this.filtros.filter(o => o !== f), [], 0, 0)))
      : of(null);
    this.cargaSub = forkJoin([tabla$, sin$]).subscribe({
      next: ([r, sin]) => {
        this.resultado = r;
        if (sin) {
          this.excluyePorFiltro = {};
          this.filtros.forEach((f, i) => this.excluyePorFiltro[f.columna] = sin[i].quedan - r.quedan);
        } else if (conConteos) {
          this.excluyePorFiltro = {};
        }
        this.cargando = false;
      },
      error: err => {
        this.cargando = false;
        this.error = this.mensaje(err, 'No se pudo cargar la base');
      }
    });
  }

  get totalPaginas(): number {
    return this.resultado ? Math.max(1, Math.ceil(this.resultado.quedan / TAMANO_PAGINA)) : 1;
  }

  irPagina(p: number): void {
    if (p < 0 || p >= this.totalPaginas || p === this.pagina) return;
    this.pagina = p;
    this.cargar();
  }

  get desdeFila(): number {
    return this.resultado && this.resultado.quedan > 0 ? this.pagina * TAMANO_PAGINA + 1 : 0;
  }

  get hastaFila(): number {
    return this.resultado ? Math.min((this.pagina + 1) * TAMANO_PAGINA, this.resultado.quedan) : 0;
  }

  // ------------------------------------------------------------ filtro de una columna

  tieneFiltro(c: ColumnaBase): boolean {
    return this.filtros.some(f => f.columna === c.columna);
  }

  abrirFiltro(c: ColumnaBase, ev: MouseEvent): void {
    ev.stopPropagation();
    if (this.abierta?.columna === c.columna) {
      this.cerrarFiltro();
      return;
    }
    const r = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const ancho = 300;
    this.popTop = Math.min(r.bottom + 4, window.innerHeight - 440);
    this.popLeft = Math.max(8, Math.min(r.right - ancho, window.innerWidth - ancho - 8));
    this.abierta = c;
    this.buscar = '';
    this.valores = [];
    this.previewExcluye = null;

    const actual = this.filtros.find(f => f.columna === c.columna);
    this.excluidos = new Set(actual?.tipo === 'LISTA' ? actual.valores ?? [] : []);
    this.modoFecha = actual?.tipo === 'RANGO_FECHA' ? 'RANGO' : 'LISTA';
    this.fechaDesde = actual?.tipo === 'RANGO_FECHA' ? actual.desde ?? '' : '';
    this.fechaHasta = actual?.tipo === 'RANGO_FECHA' ? actual.hasta ?? '' : '';
    this.numOp = c.tipo === 'NUMERO' && actual ? actual.tipo : 'MENOR';
    this.numDesde = c.tipo === 'NUMERO' ? actual?.desde ?? '' : '';
    this.numHasta = c.tipo === 'NUMERO' ? actual?.hasta ?? '' : '';

    if (c.tipo !== 'NUMERO') this.cargarValores();
    else this.onCambioNumero();
  }

  cerrarFiltro(): void {
    this.abierta = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.abierta) this.cerrarFiltro();
    else if (this.modalGenerar && !this.generando) this.cerrarGenerar();
  }

  onBuscar(): void {
    this.buscar$.next(this.buscar);
  }

  cargarValores(): void {
    const c = this.abierta;
    if (!c) return;
    this.cargandoValores = true;
    this.api.valores(this.idSubcartera, this.filtros, c.columna, this.buscar).subscribe({
      next: v => {
        if (this.abierta?.columna !== c.columna) return;
        this.valores = v;
        this.cargandoValores = false;
      },
      error: () => {
        this.valores = [];
        this.cargandoValores = false;
      }
    });
  }

  marcado(v: string): boolean {
    return !this.excluidos.has(v);
  }

  alternar(v: string): void {
    if (this.excluidos.has(v)) this.excluidos.delete(v);
    else this.excluidos.add(v);
  }

  get todosMarcados(): boolean {
    return this.valores.length > 0 && this.valores.every(v => !this.excluidos.has(v.valor));
  }

  alternarTodos(): void {
    const marcar = !this.todosMarcados;
    this.valores.forEach(v => marcar ? this.excluidos.delete(v.valor) : this.excluidos.add(v.valor));
  }

  get totalValores(): number {
    return this.valores.reduce((s, v) => s + v.filas, 0);
  }

  onCambioNumero(): void {
    this.previewExcluye = null;
    this.preview$.next();
  }

  /** El filtro tal como quedaría con lo que hay en el popover; null si no excluye nada o está incompleto. */
  private filtroDelPopover(): FiltroContingencia | null {
    const c = this.abierta;
    if (!c) return null;
    if (c.tipo === 'NUMERO') {
      if (this.numOp === 'VACIO') return { columna: c.columna, tipo: 'VACIO' };
      if (!this.esNumero(this.numDesde)) return null;
      if (this.numOp === 'ENTRE') {
        if (!this.esNumero(this.numHasta)) return null;
        return { columna: c.columna, tipo: 'ENTRE', desde: `${this.numDesde}`, hasta: `${this.numHasta}` };
      }
      return { columna: c.columna, tipo: this.numOp, desde: `${this.numDesde}` };
    }
    if (c.tipo === 'FECHA' && this.modoFecha === 'RANGO') {
      if (!this.fechaDesde || !this.fechaHasta) return null;
      return { columna: c.columna, tipo: 'RANGO_FECHA', desde: this.fechaDesde, hasta: this.fechaHasta };
    }
    if (this.excluidos.size === 0) return null;
    return { columna: c.columna, tipo: 'LISTA', valores: [...this.excluidos] };
  }

  get puedeAplicar(): boolean {
    const c = this.abierta;
    if (!c) return false;
    if (c.tipo === 'NUMERO' && this.numOp !== 'VACIO') {
      return this.esNumero(this.numDesde) && (this.numOp !== 'ENTRE' || this.esNumero(this.numHasta));
    }
    if (c.tipo === 'FECHA' && this.modoFecha === 'RANGO') return !!this.fechaDesde && !!this.fechaHasta;
    return true;
  }

  aplicarFiltro(): void {
    const c = this.abierta;
    if (!c || !this.puedeAplicar) return;
    const nuevo = this.filtroDelPopover();
    this.filtros = this.filtros.filter(f => f.columna !== c.columna);
    if (nuevo) this.filtros = [...this.filtros, nuevo];
    this.cerrarFiltro();
    this.recargar();
  }

  quitarFiltro(f: FiltroContingencia): void {
    this.filtros = this.filtros.filter(o => o !== f);
    this.recargar();
  }

  private esNumero(s: string | number | null | undefined): boolean {
    return s !== null && s !== undefined && `${s}`.trim() !== '' && !isNaN(Number(s));
  }

  // ------------------------------------------------------------ prioridad

  get columnasParaPrioridad(): ColumnaBase[] {
    return this.columnas.filter(c => !this.prioridad.some(p => p.columna === c.columna));
  }

  agregarPrioridad(): void {
    if (!this.columnaNuevaPrioridad || this.prioridad.length >= MAX_PRIORIDAD) return;
    this.prioridad = [...this.prioridad, { columna: this.columnaNuevaPrioridad, direccion: 'DESC' }];
    this.columnaNuevaPrioridad = '';
    this.recargarSoloOrden();
  }

  quitarPrioridad(i: number): void {
    this.prioridad = this.prioridad.filter((_, j) => j !== i);
    this.recargarSoloOrden();
  }

  moverPrioridad(ev: CdkDragDrop<PrioridadContingencia[]>): void {
    if (ev.previousIndex === ev.currentIndex) return;
    moveItemInArray(this.prioridad, ev.previousIndex, ev.currentIndex);
    this.prioridad = [...this.prioridad];
    this.recargarSoloOrden();
  }

  recargarSoloOrden(): void {
    this.pagina = 0;
    this.cargar(false);
  }

  // ------------------------------------------------------------ generar

  get intensidadAutomatica(): boolean {
    return this.idSubcartera > 0 && this.subcarterasAutomaticas.includes(this.idSubcartera);
  }

  abrirGenerar(): void {
    if (!this.resultado || this.resultado.quedan === 0) return;
    const ahora = new Date();
    const fin = new Date(ahora);
    fin.setHours(20, 0, 0, 0);
    if (fin <= ahora) fin.setTime(ahora.getTime() + 60 * 60 * 1000);
    this.fechaInicio = this.aLocal(ahora);
    this.fechaFin = this.aLocal(fin);
    const sp = this.subPortfolios.find(s => s.id === this.idSubcartera);
    const dia = `${String(ahora.getDate()).padStart(2, '0')}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
    this.nombre = `Contingencia ${sp?.subPortfolioName ?? ''} ${dia}`.replace(/\s+/g, ' ').slice(0, 100);
    this.modoDiscado = 'PREDICTIVE';
    this.intensidad = 50;
    this.errorGenerar = '';
    this.generada = null;
    this.modalGenerar = true;
  }

  cerrarGenerar(): void {
    this.modalGenerar = false;
  }

  get puedeGenerar(): boolean {
    return !!this.nombre.trim() && !!this.fechaInicio && !!this.fechaFin && this.fechaFin > this.fechaInicio
      && (this.intensidadAutomatica || (this.intensidad >= 1 && this.intensidad <= 100));
  }

  generar(): void {
    if (!this.puedeGenerar || this.generando) return;
    this.generando = true;
    this.errorGenerar = '';
    this.api.generar({
      idSubcartera: this.idSubcartera,
      filtros: this.filtros,
      prioridad: this.prioridad,
      nombre: this.nombre.trim(),
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      modoDiscado: this.modoDiscado,
      intensidad: this.intensidadAutomatica ? null : this.intensidad
    }).subscribe({
      next: r => {
        this.generando = false;
        this.generada = r;
      },
      error: err => {
        this.generando = false;
        this.errorGenerar = this.mensaje(err, 'No se pudo generar la campaña');
      }
    });
  }

  irAGestion(): void {
    this.router.navigate(['/admin/campaigns']);
  }

  // ------------------------------------------------------------ textos

  nombreColumna(columna: string): string {
    return this.columnas.find(c => c.columna === columna)?.nombre ?? columna;
  }

  private tipoDe(columna: string): ColumnaBase['tipo'] {
    return this.columnas.find(c => c.columna === columna)?.tipo ?? 'TEXTO';
  }

  /** Texto de un valor de la lista de un filtro. */
  textoValor(v: string, tipo: ColumnaBase['tipo']): string {
    if (v === VACIO) return '(Vacías)';
    if (tipo === 'SINO') return v === '1' ? 'Sí' : v === '0' ? 'No' : v;
    if (tipo === 'FECHA') return this.fecha(v);
    if (tipo === 'NUMERO' && this.esNumero(v)) return this.numero.format(Number(v));
    return v;
  }

  celda(fila: Record<string, unknown>, c: ColumnaBase): string {
    const v = fila[c.columna];
    if (v === null || v === undefined || v === '') return '';
    if (c.tipo === 'SINO') return v === '1' ? 'Sí' : v === '0' ? 'No' : `${v}`;
    if (c.tipo === 'FECHA') return this.fecha(`${v}`);
    if (c.tipo === 'NUMERO' && this.esNumero(v as string)) return this.numero.format(Number(v));
    return `${v}`;
  }

  descripcionFiltro(f: FiltroContingencia): string {
    const tipo = this.tipoDe(f.columna);
    switch (f.tipo) {
      case 'LISTA': {
        const vals = (f.valores ?? []).map(v => this.textoValor(v, tipo));
        return '= ' + (vals.length > 3 ? `${vals.slice(0, 3).join(', ')} y ${vals.length - 3} más` : vals.join(', '));
      }
      case 'MENOR': return `menor a ${this.textoValor(f.desde ?? '', 'NUMERO')}`;
      case 'MAYOR': return `mayor a ${this.textoValor(f.desde ?? '', 'NUMERO')}`;
      case 'IGUAL': return `igual a ${this.textoValor(f.desde ?? '', 'NUMERO')}`;
      case 'ENTRE': return `entre ${this.textoValor(f.desde ?? '', 'NUMERO')} y ${this.textoValor(f.hasta ?? '', 'NUMERO')}`;
      case 'VACIO': return 'vacías';
      case 'RANGO_FECHA': return `entre ${this.fecha(f.desde ?? '')} y ${this.fecha(f.hasta ?? '')}`;
    }
  }

  get descripcionSubcartera(): string {
    const t = this.tenants.find(x => x.id === this.idTenant);
    const p = this.portfolios.find(x => x.id === this.idPortfolio);
    const s = this.subPortfolios.find(x => x.id === this.idSubcartera);
    return [t && `${t.tenantCode} - ${t.tenantName}`, p && `${p.portfolioCode} - ${p.portfolioName}`,
      s && `${s.subPortfolioCode} - ${s.subPortfolioName}`].filter(Boolean).join(' · ');
  }

  formatoNumero(n: number | null | undefined): string {
    return n === null || n === undefined ? '-' : this.numero.format(n);
  }

  private fecha(iso: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
  }

  private aLocal(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  private mensaje(err: any, porDefecto: string): string {
    return err?.error?.message || err?.error?.error || porDefecto;
  }

  // ── Accesos ──
  abrirAccesos(): void {
    this.modalAccesos = true;
    this.buscarUsuario = '';
    this.errorAccesos = '';
    this.cargandoAccesos = true;
    this.api.usuariosAcceso().subscribe({
      next: u => { this.usuariosAcceso = u; this.cargandoAccesos = false; },
      error: () => { this.usuariosAcceso = []; this.cargandoAccesos = false; this.errorAccesos = 'No se pudo cargar la lista de usuarios.'; }
    });
  }

  get usuariosAccesoFiltrados(): UsuarioAcceso[] {
    const q = this.buscarUsuario.trim().toLowerCase();
    if (!q) return this.usuariosAcceso;
    return this.usuariosAcceso.filter(u =>
      `${u.nombre ?? ''} ${u.usuario ?? ''} ${u.roles ?? ''}`.toLowerCase().includes(q));
  }

  get totalConAcceso(): number {
    return this.usuariosAcceso.filter(u => u.habilitado).length;
  }

  cambiarAcceso(u: UsuarioAcceso, habilitar: boolean): void {
    this.errorAccesos = '';
    u.habilitado = habilitar;
    this.guardandoAcceso.add(u.idUsuario);
    this.api.cambiarAcceso(u.idUsuario, habilitar).subscribe({
      next: r => { u.habilitado = r.habilitado; this.guardandoAcceso.delete(u.idUsuario); },
      error: err => {
        u.habilitado = !habilitar;
        this.guardandoAcceso.delete(u.idUsuario);
        this.errorAccesos = err?.error?.message || 'No se pudo guardar el cambio.';
      }
    });
  }
}
