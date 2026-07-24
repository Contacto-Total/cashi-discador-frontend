import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CampaignAdminService, GrupoAsesor, AsesorMiembro } from '../../../core/services/campaign-admin.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';

@Component({
  selector: 'app-grupos-campana',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DragDropModule],
  templateUrl: './grupos-campana.component.html',
  styleUrls: ['./grupos-campana.component.css']
})
export class GruposCampanaComponent implements OnInit {
  // Selectores en cascada
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  // Grupos + asesores de la subcartera
  grupos: GrupoAsesor[] = [];
  loadingGrupos = false;
  asesoresSubcartera: AsesorMiembro[] = [];
  loadingAsesores = false;

  // Formulario crear/editar
  grupoFormId: number | null = null;   // null = creando, != null = editando
  grupoFormNombre = '';
  grupoFormAsesores: number[] = [];    // fuente de verdad que se persiste
  savingGrupo = false;
  grupoError: string | null = null;
  dndDisponibles: AsesorMiembro[] = [];
  dndSeleccionados: AsesorMiembro[] = [];

  constructor(
    private campaignService: CampaignAdminService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  volver(): void {
    this.router.navigate(['/admin/campaigns']);
  }

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (t) => { this.tenants = t; },
      error: (e) => console.error('Error cargando proveedores:', e)
    });
  }

  onTenantChange(): void {
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios = [];
    this.subPortfolios = [];
    this.resetVista();
    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (p) => { this.portfolios = p; },
        error: (e) => console.error('Error cargando carteras:', e)
      });
    }
  }

  onPortfolioChange(): void {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios = [];
    this.resetVista();
    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (sp) => { this.subPortfolios = sp; },
        error: (e) => console.error('Error cargando subcarteras:', e)
      });
    }
  }

  onSubcarteraChange(): void {
    this.resetVista();
    if (this.selectedSubPortfolioId > 0) {
      this.cargarGrupos();
      this.cargarAsesores();
    }
  }

  private resetVista(): void {
    this.grupos = [];
    this.asesoresSubcartera = [];
    this.resetForm();
  }

  cargarGrupos(): void {
    this.loadingGrupos = true;
    this.campaignService.getGruposBySubcartera(this.selectedSubPortfolioId).subscribe({
      next: (g) => { this.grupos = g; this.loadingGrupos = false; },
      error: () => { this.grupos = []; this.loadingGrupos = false; }
    });
  }

  cargarAsesores(): void {
    this.loadingAsesores = true;
    this.campaignService.getAsesoresSubcartera(this.selectedSubPortfolioId).subscribe({
      next: (a) => { this.asesoresSubcartera = a; this.prepararDnd(); this.loadingAsesores = false; },
      error: () => { this.asesoresSubcartera = []; this.prepararDnd(); this.loadingAsesores = false; }
    });
  }

  get gruposEspeciales(): GrupoAsesor[] {
    return this.grupos.filter(g => !g.esDefault);
  }

  // ===== Drag & drop =====

  prepararDnd(): void {
    const sel = new Set(this.grupoFormAsesores);
    this.dndSeleccionados = this.asesoresSubcartera.filter(a => sel.has(a.idUsuario));
    this.dndDisponibles = this.asesoresSubcartera.filter(a => !sel.has(a.idUsuario));
  }

  onDropAsesor(event: CdkDragDrop<AsesorMiembro[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.grupoFormAsesores = this.dndSeleccionados.map(a => a.idUsuario);
  }

  // ===== Crear / editar / eliminar =====

  resetForm(): void {
    this.grupoFormId = null;
    this.grupoFormNombre = '';
    this.grupoFormAsesores = [];
    this.grupoError = null;
    this.prepararDnd();
  }

  editarGrupo(g: GrupoAsesor): void {
    this.grupoFormId = g.id;
    this.grupoFormNombre = g.nombre;
    this.grupoFormAsesores = (g.miembros || []).map(m => m.idUsuario);
    this.grupoError = null;
    this.prepararDnd();
  }

  guardarGrupo(): void {
    const nombre = (this.grupoFormNombre || '').trim();
    if (!nombre) { this.grupoError = 'El nombre del grupo es obligatorio'; return; }
    if (this.grupoFormAsesores.length === 0) { this.grupoError = 'Seleccione al menos un asesor'; return; }

    this.savingGrupo = true;
    this.grupoError = null;
    const onOk = () => { this.savingGrupo = false; this.resetForm(); this.cargarGrupos(); };
    const onErr = (err: any) => {
      this.savingGrupo = false;
      this.grupoError = err?.error?.message || 'No se pudo guardar el grupo';
    };

    if (this.grupoFormId) {
      this.campaignService.actualizarGrupo(this.grupoFormId, { nombre, idsUsuarios: this.grupoFormAsesores })
        .subscribe({ next: onOk, error: onErr });
    } else {
      this.campaignService.crearGrupo({ nombre, idSubcartera: this.selectedSubPortfolioId, idsUsuarios: this.grupoFormAsesores })
        .subscribe({ next: onOk, error: onErr });
    }
  }

  eliminarGrupoUI(g: GrupoAsesor): void {
    if (!window.confirm(`¿Eliminar el grupo "${g.nombre}"?`)) { return; }
    this.campaignService.eliminarGrupo(g.id).subscribe({
      next: () => { if (this.grupoFormId === g.id) { this.resetForm(); } this.cargarGrupos(); },
      error: (err) => { this.grupoError = err?.error?.message || 'No se pudo eliminar el grupo'; }
    });
  }
}
