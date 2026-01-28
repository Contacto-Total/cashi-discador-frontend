import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RecordatoriosService, ConfiguracionHorarioRecordatorio } from '../../../core/services/recordatorios.service';
import { TenantService } from '../../services/tenant.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Tenant } from '../../models/tenant.model';
import { Portfolio, SubPortfolio } from '../../models/portfolio.model';

interface HorarioConNombres extends ConfiguracionHorarioRecordatorio {
  nombreSubcartera?: string;
  nombreCartera?: string;
  nombreTenant?: string;
}

@Component({
  selector: 'app-horarios-recordatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './horarios-recordatorios.component.html',
  styleUrls: ['./horarios-recordatorios.component.css']
})
export class HorariosRecordatoriosComponent implements OnInit {
  horarios: HorarioConNombres[] = [];
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];

  loading = false;
  saving = false;
  showModal = false;
  editMode = false;

  selectedSubcartera: number | null = null;
  filteredPortfolios: Portfolio[] = [];
  filteredSubPortfolios: SubPortfolio[] = [];
  selectedTenant: number | null = null;
  selectedPortfolio: number | null = null;

  currentHorario: ConfiguracionHorarioRecordatorio = this.getEmptyHorario();

  constructor(
    private recordatoriosService: RecordatoriosService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;

    // Cargar tenants
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
        this.loadAllPortfolios();
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
        this.loading = false;
      }
    });
  }

  private loadAllPortfolios(): void {
    this.portfolios = [];
    this.subPortfolios = [];
    let pendingRequests = this.tenants.length;

    if (pendingRequests === 0) {
      this.loading = false;
      return;
    }

    this.tenants.forEach(tenant => {
      this.portfolioService.getPortfoliosByTenant(tenant.id).subscribe({
        next: (portfolios: Portfolio[]) => {
          portfolios.forEach(p => {
            if (!this.portfolios.find(existing => existing.id === p.id)) {
              this.portfolios.push(p);
              // Cargar subcarteras de este portfolio
              this.portfolioService.getActiveSubPortfoliosByPortfolio(p.id).subscribe({
                next: (subs) => {
                  subs.forEach(sub => {
                    if (!this.subPortfolios.find(s => s.id === sub.id)) {
                      this.subPortfolios.push(sub);
                    }
                  });
                }
              });
            }
          });
          pendingRequests--;
          if (pendingRequests === 0) {
            this.loading = false;
          }
        },
        error: () => {
          pendingRequests--;
          if (pendingRequests === 0) {
            this.loading = false;
          }
        }
      });
    });
  }

  onTenantChange(): void {
    this.selectedPortfolio = null;
    this.selectedSubcartera = null;
    this.filteredPortfolios = [];
    this.filteredSubPortfolios = [];
    this.horarios = [];

    if (this.selectedTenant) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenant).subscribe({
        next: (portfolios) => {
          this.filteredPortfolios = portfolios;
        }
      });
    }
  }

  onPortfolioChange(): void {
    this.selectedSubcartera = null;
    this.filteredSubPortfolios = [];
    this.horarios = [];

    if (this.selectedPortfolio) {
      this.portfolioService.getActiveSubPortfoliosByPortfolio(this.selectedPortfolio).subscribe({
        next: (subs) => {
          this.filteredSubPortfolios = subs;
        }
      });
    }
  }

  onSubcarteraChange(): void {
    if (this.selectedSubcartera) {
      this.loadHorarios();
    } else {
      this.horarios = [];
    }
  }

  loadHorarios(): void {
    if (!this.selectedSubcartera) return;

    this.loading = true;
    this.recordatoriosService.obtenerHorarios(this.selectedSubcartera, true).subscribe({
      next: (horarios) => {
        this.horarios = horarios.map(h => ({
          ...h,
          nombreSubcartera: this.getSubcarteraNombre(h.idSubcartera)
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading horarios:', err);
        this.loading = false;
      }
    });
  }

  getEmptyHorario(): ConfiguracionHorarioRecordatorio {
    return {
      idSubcartera: 0,
      horaInicio: '08:00',
      horaFin: '09:00',
      descripcion: '',
      activo: true
    };
  }

  openNewModal(): void {
    if (!this.selectedSubcartera) {
      alert('Seleccione una subcartera primero');
      return;
    }
    this.currentHorario = {
      ...this.getEmptyHorario(),
      idSubcartera: this.selectedSubcartera
    };
    this.editMode = false;
    this.showModal = true;
  }

  openEditModal(horario: HorarioConNombres): void {
    this.currentHorario = {
      ...horario,
      horaInicio: this.formatTimeForInput(horario.horaInicio),
      horaFin: this.formatTimeForInput(horario.horaFin)
    };
    this.editMode = true;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentHorario = this.getEmptyHorario();
  }

  saveHorario(): void {
    this.saving = true;

    // Formatear horas para el backend
    const horarioToSave = {
      ...this.currentHorario,
      horaInicio: this.formatTimeForBackend(this.currentHorario.horaInicio),
      horaFin: this.formatTimeForBackend(this.currentHorario.horaFin)
    };

    this.recordatoriosService.guardarHorario(horarioToSave).subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadHorarios();
      },
      error: (err) => {
        console.error('Error saving horario:', err);
        this.saving = false;
        alert('Error al guardar el horario');
      }
    });
  }

  deleteHorario(horario: HorarioConNombres): void {
    if (!confirm('¿Está seguro de eliminar este horario?')) {
      return;
    }

    if (!horario.id) return;

    this.recordatoriosService.eliminarHorario(horario.id).subscribe({
      next: () => {
        this.loadHorarios();
      },
      error: (err) => {
        console.error('Error deleting horario:', err);
        alert('Error al eliminar el horario');
      }
    });
  }

  toggleActivo(horario: HorarioConNombres): void {
    if (!horario.id) return;

    this.recordatoriosService.cambiarEstadoHorario(horario.id, !horario.activo).subscribe({
      next: () => {
        this.loadHorarios();
      },
      error: (err) => {
        console.error('Error toggling horario:', err);
        alert('Error al cambiar estado del horario');
      }
    });
  }

  crearHorariosDefecto(): void {
    if (!this.selectedSubcartera) {
      alert('Seleccione una subcartera primero');
      return;
    }

    if (!confirm('Esto creará los horarios por defecto (8-9am, 2-3pm, 5-6pm) y eliminará los existentes. ¿Continuar?')) {
      return;
    }

    this.saving = true;
    this.recordatoriosService.crearHorariosDefecto(this.selectedSubcartera).subscribe({
      next: () => {
        this.saving = false;
        this.loadHorarios();
      },
      error: (err) => {
        console.error('Error creating default horarios:', err);
        this.saving = false;
        alert('Error al crear horarios por defecto');
      }
    });
  }

  getSubcarteraNombre(id: number): string {
    const sub = this.subPortfolios.find(s => s.id === id);
    return sub?.subPortfolioName || `Subcartera ${id}`;
  }

  formatTimeForDisplay(time: string): string {
    if (!time) return '';
    // Convertir "08:00:00" a "08:00"
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  formatTimeForInput(time: string): string {
    if (!time) return '08:00';
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  formatTimeForBackend(time: string): string {
    if (!time) return '08:00:00';
    const parts = time.split(':');
    if (parts.length === 2) {
      return `${parts[0]}:${parts[1]}:00`;
    }
    return time;
  }
}
