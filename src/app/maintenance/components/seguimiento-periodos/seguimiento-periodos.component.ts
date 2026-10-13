import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SeguimientoService } from '../../../core/services/seguimiento.service';
import {
  CAMPOS_SEGMENTO,
  CoberturaSeguimiento,
  ESTADOS_SEGMENTO,
  EstadoSegmento,
  MOTIVOS_EXCLUSION,
  SeguimientoPeriodo
} from '../../../core/models/seguimiento.model';
import { CampaignAdminService, GrupoAsesor } from '../../../core/services/campaign-admin.service';
import {
  ConfiguracionHorarioRecordatorio,
  RecordatoriosService
} from '../../../core/services/recordatorios.service';
import { TenantService } from '../../services/tenant.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Tenant } from '../../models/tenant.model';
import { Portfolio, SubPortfolio } from '../../models/portfolio.model';

/**
 * Seguimiento: la única pantalla de configuración del módulo.
 *
 * Dos pestañas, porque son dos ámbitos de guardado distintos:
 *
 *  - PERÍODOS: un mes por subcartera. El supervisor lo crea en BORRADOR, elige
 *    el segmento y qué promesas entran, y al ACTIVARLO se genera el padrón y
 *    empiezan a salir las listas diarias repartidas por round robin. La config
 *    solo se toca en BORRADOR: ya activo, cambiar el segmento dejaría un padrón
 *    que no se corresponde con su regla.
 *
 *  - HORARIOS: las ventanas en las que el asesor puede trabajar el seguimiento.
 *    Se guardan por SUBCARTERA, no por período, para no obligar al supervisor a
 *    volver a escribir Mañana/Tarde 1/Tarde 2 cada mes.
 *
 * Reemplaza a horarios-recordatorios, que además editaba las reglas de promesas
 * en configuracion_recordatorio_subcartera; esas reglas ahora viven en el
 * período y esa tabla quedó huérfana.
 */
@Component({
  selector: 'app-seguimiento-periodos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './seguimiento-periodos.component.html',
  styleUrls: ['./seguimiento-periodos.component.css']
})
export class SeguimientoPeriodosComponent implements OnInit {

  readonly camposSegmento = CAMPOS_SEGMENTO;
  readonly estadosSegmento = ESTADOS_SEGMENTO;
  readonly motivosExclusion = MOTIVOS_EXCLUSION;

  tab: 'periodos' | 'horarios' = 'periodos';

  tenants: Tenant[] = [];
  filteredPortfolios: Portfolio[] = [];
  filteredSubPortfolios: SubPortfolio[] = [];
  selectedTenant: number | null = null;
  selectedPortfolio: number | null = null;
  selectedSubcartera: number | null = null;

  periodos: SeguimientoPeriodo[] = [];
  grupos: GrupoAsesor[] = [];
  cobertura: CoberturaSeguimiento | null = null;
  periodoCobertura: number | null = null;

  loading = false;
  saving = false;
  error: string | null = null;
  aviso: string | null = null;

  showModal = false;
  editMode = false;
  form: SeguimientoPeriodo = this.vacio();
  /** Los valores del segmento se editan como checks y se guardan como CSV. */
  valoresSeleccionados: Record<string, boolean> = {};

  // ==================== HORARIOS ====================

  horarios: ConfiguracionHorarioRecordatorio[] = [];
  showModalHorario = false;
  editModeHorario = false;
  horarioForm: ConfiguracionHorarioRecordatorio = this.horarioVacio();

  constructor(
    private seguimientoService: SeguimientoService,
    private campaignAdminService: CampaignAdminService,
    private recordatoriosService: RecordatoriosService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.tenantService.getAllTenants().subscribe({
      next: tenants => this.tenants = tenants,
      error: () => this.error = 'No se pudieron cargar los inquilinos'
    });
  }

  // ==================== CASCADA ====================

  onTenantChange(): void {
    this.selectedPortfolio = null;
    this.selectedSubcartera = null;
    this.filteredPortfolios = [];
    this.filteredSubPortfolios = [];
    this.periodos = [];
    this.horarios = [];
    this.cobertura = null;

    if (!this.selectedTenant) return;
    this.portfolioService.getPortfoliosByTenant(this.selectedTenant).subscribe({
      next: portfolios => this.filteredPortfolios = portfolios,
      error: () => this.error = 'No se pudieron cargar las carteras'
    });
  }

  onPortfolioChange(): void {
    this.selectedSubcartera = null;
    this.filteredSubPortfolios = [];
    this.periodos = [];
    this.horarios = [];
    this.cobertura = null;

    if (!this.selectedPortfolio) return;
    this.portfolioService.getActiveSubPortfoliosByPortfolio(this.selectedPortfolio).subscribe({
      next: subs => this.filteredSubPortfolios = subs,
      error: () => this.error = 'No se pudieron cargar las subcarteras'
    });
  }

  onSubcarteraChange(): void {
    this.cobertura = null;
    this.periodoCobertura = null;
    if (!this.selectedSubcartera) {
      this.periodos = [];
      this.horarios = [];
      return;
    }
    this.cargarPeriodos();
    this.cargarHorarios();
    this.campaignAdminService.getGruposBySubcartera(this.selectedSubcartera).subscribe({
      next: g => this.grupos = g,
      error: () => this.grupos = []
    });
  }

  private cargarPeriodos(): void {
    if (!this.selectedSubcartera) return;
    this.loading = true;
    this.seguimientoService.listarPeriodos(this.selectedSubcartera).subscribe({
      next: p => {
        this.periodos = p;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los períodos';
        this.loading = false;
      }
    });
  }

  // ==================== CREAR / EDITAR ====================

  nuevo(): void {
    if (!this.selectedSubcartera) return;
    const hoy = new Date();
    this.form = this.vacio();
    this.form.idSubcartera = this.selectedSubcartera;
    this.form.anio = hoy.getFullYear();
    this.form.mes = hoy.getMonth() + 1;
    this.valoresSeleccionados = { PR: true };
    this.editMode = false;
    this.showModal = true;
  }

  editar(p: SeguimientoPeriodo): void {
    if (p.estado !== 'BORRADOR') {
      this.error = 'Solo se puede editar un período en BORRADOR. Ciérralo y crea uno nuevo.';
      return;
    }
    this.form = { ...p };
    this.valoresSeleccionados = {};
    (p.segmentoValores || '').split(',')
      .map(v => v.trim().toUpperCase())
      .filter(v => v)
      .forEach(v => this.valoresSeleccionados[v] = true);
    this.editMode = true;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.form = this.vacio();
  }

  guardar(): void {
    this.error = null;
    const valores = this.estadosSegmento
      .map(e => e.valor)
      .filter(v => this.valoresSeleccionados[v]);

    if (valores.length === 0) {
      this.error = 'Elige al menos un estado del segmento';
      return;
    }
    if (!this.form.incluyeVencidas && !this.form.incluyeVigentes) {
      this.error = 'El período tiene que incluir promesas vencidas, vigentes o las dos: así no entraría nadie a la lista';
      return;
    }

    const payload: SeguimientoPeriodo = { ...this.form, segmentoValores: valores.join(',') };
    this.saving = true;

    const req = this.editMode && this.form.id
      ? this.seguimientoService.actualizarPeriodo(this.form.id, payload)
      : this.seguimientoService.crearPeriodo(payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.aviso = this.editMode ? 'Período actualizado' : 'Período creado en BORRADOR. Actívalo para generar el padrón.';
        this.cargarPeriodos();
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.mensaje || 'No se pudo guardar el período';
      }
    });
  }

  // ==================== ACTIVAR / CERRAR ====================

  activar(p: SeguimientoPeriodo): void {
    if (!p.id) return;
    this.error = null;
    this.saving = true;
    this.seguimientoService.activarPeriodo(p.id).subscribe({
      next: () => {
        this.saving = false;
        this.aviso = 'Período activado: padrón generado y lista de hoy repartida.';
        this.cargarPeriodos();
        this.verCobertura(p);
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.mensaje || 'No se pudo activar el período';
      }
    });
  }

  cerrar(p: SeguimientoPeriodo): void {
    if (!p.id) return;
    this.error = null;
    this.saving = true;
    this.seguimientoService.cerrarPeriodo(p.id).subscribe({
      next: () => {
        this.saving = false;
        this.aviso = 'Período cerrado.';
        this.cargarPeriodos();
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.mensaje || 'No se pudo cerrar el período';
      }
    });
  }

  regenerarLista(p: SeguimientoPeriodo): void {
    if (!p.id) return;
    this.error = null;
    this.saving = true;
    this.seguimientoService.regenerarListaDeHoy(p.id).subscribe({
      next: () => {
        this.saving = false;
        this.aviso = 'Lista de hoy regenerada.';
        this.verCobertura(p);
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.mensaje || 'No se pudo regenerar la lista';
      }
    });
  }

  // ==================== COBERTURA ====================

  verCobertura(p: SeguimientoPeriodo): void {
    if (!p.id) return;
    this.periodoCobertura = p.id;
    this.seguimientoService.cobertura(p.id).subscribe({
      next: c => this.cobertura = c,
      error: () => this.error = 'No se pudo cargar la cobertura'
    });
  }

  // ==================== HORARIOS ====================

  /**
   * Trae también los inactivos: el supervisor tiene que poder ver y reactivar
   * un tramo apagado, no solo los que están en uso.
   */
  private cargarHorarios(): void {
    if (!this.selectedSubcartera) return;
    this.recordatoriosService.obtenerHorarios(this.selectedSubcartera, true).subscribe({
      next: h => this.horarios = h,
      error: () => this.error = 'No se pudieron cargar los horarios'
    });
  }

  nuevoHorario(): void {
    if (!this.selectedSubcartera) return;
    this.horarioForm = { ...this.horarioVacio(), idSubcartera: this.selectedSubcartera };
    this.editModeHorario = false;
    this.showModalHorario = true;
  }

  editarHorario(h: ConfiguracionHorarioRecordatorio): void {
    this.horarioForm = {
      ...h,
      horaInicio: this.horaParaInput(h.horaInicio),
      horaFin: this.horaParaInput(h.horaFin)
    };
    this.editModeHorario = true;
    this.showModalHorario = true;
  }

  cerrarModalHorario(): void {
    this.showModalHorario = false;
    this.horarioForm = this.horarioVacio();
  }

  guardarHorario(): void {
    this.error = null;
    if (this.horarioForm.horaFin <= this.horarioForm.horaInicio) {
      this.error = 'La hora de fin tiene que ser posterior a la de inicio';
      return;
    }
    this.saving = true;
    this.recordatoriosService.guardarHorario({
      ...this.horarioForm,
      horaInicio: this.horaParaBackend(this.horarioForm.horaInicio),
      horaFin: this.horaParaBackend(this.horarioForm.horaFin)
    }).subscribe({
      next: () => {
        this.saving = false;
        this.cerrarModalHorario();
        this.aviso = 'Horario guardado.';
        this.cargarHorarios();
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.mensaje || 'No se pudo guardar el horario';
      }
    });
  }

  eliminarHorario(h: ConfiguracionHorarioRecordatorio): void {
    if (!h.id) return;
    if (!confirm(`¿Eliminar el horario ${this.horaParaInput(h.horaInicio)} - ${this.horaParaInput(h.horaFin)}?`)) {
      return;
    }
    this.recordatoriosService.eliminarHorario(h.id).subscribe({
      next: () => {
        this.aviso = 'Horario eliminado.';
        this.cargarHorarios();
      },
      error: () => this.error = 'No se pudo eliminar el horario'
    });
  }

  alternarHorario(h: ConfiguracionHorarioRecordatorio): void {
    if (!h.id) return;
    this.recordatoriosService.cambiarEstadoHorario(h.id, !h.activo).subscribe({
      next: () => this.cargarHorarios(),
      error: () => this.error = 'No se pudo cambiar el estado del horario'
    });
  }

  crearHorariosDefecto(): void {
    if (!this.selectedSubcartera) return;
    if (!confirm('Esto crea los horarios por defecto (8-9am, 2-3pm, 5-6pm) y borra los que ya existan. ¿Continuar?')) {
      return;
    }
    this.saving = true;
    this.recordatoriosService.crearHorariosDefecto(this.selectedSubcartera).subscribe({
      next: () => {
        this.saving = false;
        this.aviso = 'Horarios por defecto creados.';
        this.cargarHorarios();
      },
      error: () => {
        this.saving = false;
        this.error = 'No se pudieron crear los horarios por defecto';
      }
    });
  }

  /** '08:00:00' -> '08:00' (lo que espera un <input type="time">). */
  horaParaInput(hora?: string): string {
    if (!hora) return '08:00';
    const p = hora.split(':');
    return `${p[0]}:${p[1]}`;
  }

  /** '08:00' -> '08:00:00' (lo que espera el LocalTime del backend). */
  private horaParaBackend(hora: string): string {
    if (!hora) return '08:00:00';
    return hora.split(':').length === 2 ? `${hora}:00` : hora;
  }

  private horarioVacio(): ConfiguracionHorarioRecordatorio {
    return {
      idSubcartera: 0,
      horaInicio: '08:00',
      horaFin: '09:00',
      descripcion: '',
      activo: true
    };
  }

  // ==================== HELPERS DE VISTA ====================

  nombreMes(mes?: number): string {
    const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return mes && mes >= 1 && mes <= 12 ? meses[mes] : '-';
  }

  claseEstado(estado?: string): string {
    switch (estado) {
      case 'ACTIVO': return 'chip chip-activo';
      case 'BORRADOR': return 'chip chip-borrador';
      case 'CERRADO': return 'chip chip-cerrado';
      default: return 'chip';
    }
  }

  etiquetaMotivo(motivo: string): string {
    return this.motivosExclusion[motivo] || motivo;
  }

  descripcionSegmento(p: SeguimientoPeriodo): string {
    const campo = this.camposSegmento.find(c => c.valor === p.segmentoCampo);
    return `${campo ? campo.etiqueta : p.segmentoCampo} = ${p.segmentoValores || '(todos)'}`;
  }

  descripcionPromesas(p: SeguimientoPeriodo): string {
    const partes: string[] = [];
    if (p.incluyeVencidas) {
      partes.push('vencidas del mes (sin ayer)');
    }
    if (p.incluyeVigentes) {
      const d = p.diasVigentesAdelante || 0;
      partes.push(d === 0 ? 'vigentes que vencen hoy' : `vigentes (hoy + ${d} días)`);
    }
    return partes.length ? partes.join(' + ') : 'ninguna';
  }

  nombreGrupo(idGrupo?: number | null): string {
    if (!idGrupo) return 'Todos los asesores de la subcartera';
    const g = this.grupos.find(x => x.id === idGrupo);
    return g ? g.nombre : `Grupo ${idGrupo}`;
  }

  /** El trabajado del día: completadas sobre asignadas. */
  avance(a: { asignados: number; completadas: number }): number {
    if (!a.asignados) return 0;
    return Math.round((a.completadas / a.asignados) * 100);
  }

  descartarAviso(): void {
    this.aviso = null;
    this.error = null;
  }

  private vacio(): SeguimientoPeriodo {
    return {
      idSubcartera: 0,
      segmentoFuente: 'ESTADO_CLIENTE_CALCULADO',
      segmentoCampo: 'mejor_estado_historico',
      segmentoValores: 'PR',
      incluyeVencidas: true,
      incluyeVigentes: true,
      diasVigentesAdelante: 0,
      idGrupoAsesores: null,
      bajaPorPagoCumplido: true,
      bajaPorCuotasMes: true
    };
  }
}
