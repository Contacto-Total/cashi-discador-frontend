import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { CampaignAdminService, Campaign, FilterableField, CampaignFilterRange, TipoContacto, TIPOS_CONTACTO, TIPOS_FILTRO_ESTADO, ImportPreview } from '../../../core/services/campaign-admin.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { environment } from '../../../../environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.css']
})
export class CampaignFormComponent implements OnInit {
  campaign: Campaign = {
    name: '',
    description: '',
    status: 'DRAFT',
    dialMode: 'PROGRESSIVE',
    maxAttempts: 3,
    retryInterval: 60,
    intensidad: 50,
    tenantId: undefined,
    portfolioId: undefined,
    subPortfolioId: undefined,
    tipoFiltroEstado: 'ULTIMO_ESTADO'
  };

  isEditMode: boolean = false;
  loading: boolean = false;
  error: string | null = null;
  campaignId: number | null = null;

  // Datos para selectores en cascada
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedTenantId: number = 0;
  selectedPortfolioId: number = 0;
  selectedSubPortfolioId: number = 0;

  // Strings para los campos de fecha (datetime-local requiere formato específico)
  startDateString: string = '';
  endDateString: string = '';

  // Filtros de rango
  filterableFields: FilterableField[] = [];
  campaignFilters: CampaignFilterRange[] = [];
  selectedFieldId: number = 0;
  newFilterMinValue: number | null = null;
  newFilterMaxValue: number | null = null;

  // Tipos de contacto y filtro de estado
  tiposContacto = TIPOS_CONTACTO;
  tiposFiltroEstado = TIPOS_FILTRO_ESTADO;
  selectedTipoContacto: TipoContacto | null = null;

  // Modal de preview/confirmación
  showPreviewModal: boolean = false;
  previewLoading: boolean = false;
  previewData: ImportPreview | null = null;
  previewError: string | null = null;

  constructor(
    private campaignService: CampaignAdminService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTenants();

    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.campaignId = +params['id'];
        this.loadCampaign(this.campaignId);
      }
    });
  }

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
      },
      error: (err) => console.error('Error loading tenants:', err)
    });
  }

  onTenantChange(): void {
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios = [];
    this.subPortfolios = [];

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (portfolios) => {
          this.portfolios = portfolios;
        },
        error: (err) => console.error('Error loading portfolios:', err)
      });
    }
  }

  onPortfolioChange(): void {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios = [];
    this.filterableFields = [];

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios;
        },
        error: (err) => console.error('Error loading sub-portfolios:', err)
      });
    }
  }

  onSubPortfolioChange(): void {
    this.filterableFields = [];
    if (this.selectedSubPortfolioId > 0) {
      this.loadFilterableFields(this.selectedSubPortfolioId);
    }
  }

  loadFilterableFields(subcarteraId: number): void {
    this.campaignService.getFilterableFieldsBySubcartera(subcarteraId).subscribe({
      next: (fields) => {
        this.filterableFields = fields;
        console.log('Campos filtrables cargados:', fields);
      },
      error: (err) => console.error('Error loading filterable fields:', err)
    });
  }

  loadCampaignFilters(campaignId: number): void {
    this.campaignService.getCampaignFilters(campaignId).subscribe({
      next: (filters) => {
        this.campaignFilters = filters;
        console.log('Filtros de campaña cargados:', filters);
      },
      error: (err) => console.error('Error loading campaign filters:', err)
    });
  }

  addFilter(): void {
    // Validar: debe tener tipo de contacto O un campo con rango
    const tieneRango = this.newFilterMinValue !== null || this.newFilterMaxValue !== null;
    const tieneCampo = this.selectedFieldId !== 0;
    const tieneTipoContacto = this.selectedTipoContacto !== null;

    if (!tieneTipoContacto && !tieneCampo) {
      this.error = 'Seleccione un tipo de contacto o un campo para filtrar';
      return;
    }

    if (tieneCampo && !tieneRango) {
      this.error = 'Ingrese al menos un valor (mínimo o máximo) para el campo seleccionado';
      return;
    }

    // Si solo tiene tipo de contacto (sin campo), crear filtro solo con tipoContacto
    if (tieneTipoContacto && !tieneCampo) {
      const newFilter: CampaignFilterRange = {
        fieldDefinitionId: 0,
        fieldCode: '',
        fieldName: 'Solo por Estado',
        minValue: undefined,
        maxValue: undefined,
        tipoContacto: this.selectedTipoContacto ?? undefined
      };

      this.campaignFilters.push(newFilter);
    } else {
      // Filtro con campo y opcionalmente tipoContacto
      const selectedField = this.filterableFields.find(f => f.id === this.selectedFieldId);
      if (!selectedField) return;

      const newFilter: CampaignFilterRange = {
        fieldDefinitionId: selectedField.id,
        fieldCode: selectedField.fieldCode,
        fieldName: selectedField.fieldName,
        minValue: this.newFilterMinValue ?? undefined,
        maxValue: this.newFilterMaxValue ?? undefined,
        tipoContacto: this.selectedTipoContacto ?? undefined
      };

      this.campaignFilters.push(newFilter);
    }

    // Limpiar inputs
    this.selectedFieldId = 0;
    this.newFilterMinValue = null;
    this.newFilterMaxValue = null;
    this.selectedTipoContacto = null;
    this.error = null;
  }

  getTipoFiltroEstadoDescripcion(): string {
    const tipo = this.tiposFiltroEstado.find(t => t.codigo === this.campaign.tipoFiltroEstado);
    return tipo?.descripcion || '';
  }

  getTipoContactoNombre(codigo: TipoContacto | undefined): string {
    if (!codigo) return 'Todos';
    const tipo = this.tiposContacto.find(t => t.codigo === codigo);
    return tipo?.nombre || codigo;
  }

  getTipoContactoColor(codigo: TipoContacto | undefined): string {
    if (!codigo) return '#6B7280';
    const tipo = this.tiposContacto.find(t => t.codigo === codigo);
    return tipo?.color || '#6B7280';
  }

  getFiltersByTipoContacto(tipoContacto: TipoContacto | null): CampaignFilterRange[] {
    if (tipoContacto === null) {
      return this.campaignFilters.filter(f => !f.tipoContacto);
    }
    return this.campaignFilters.filter(f => f.tipoContacto === tipoContacto);
  }

  hasFiltersForTipo(tipoContacto: TipoContacto | null): boolean {
    return this.getFiltersByTipoContacto(tipoContacto).length > 0;
  }

  removeFilter(index: number): void {
    this.campaignFilters.splice(index, 1);
  }

  getFieldNameByCode(fieldCode: string): string {
    const field = this.filterableFields.find(f => f.fieldCode === fieldCode);
    return field?.fieldName || fieldCode;
  }

  loadCampaign(id: number): void {
    this.loading = true;
    this.campaignService.getCampaignById(id).subscribe({
      next: (campaign) => {
        console.log('✅ Campaign loaded:', campaign);
        this.campaign = campaign;

        // Convertir fechas para datetime-local
        if (campaign.startDate) {
          this.startDateString = this.toDateTimeLocal(campaign.startDate);
        }
        if (campaign.endDate) {
          this.endDateString = this.toDateTimeLocal(campaign.endDate);
        }

        // Cargar los selectores en cascada con los valores existentes
        if (campaign.tenantId && campaign.portfolioId && campaign.subPortfolioId) {
          console.log('📋 Loading cascading data for edit mode...', {
            tenantId: campaign.tenantId,
            portfolioId: campaign.portfolioId,
            subPortfolioId: campaign.subPortfolioId
          });

          // Cargar portfolios y subportfolios PRIMERO, luego asignar los valores seleccionados
          forkJoin({
            portfolios: this.portfolioService.getPortfoliosByTenant(campaign.tenantId),
            subPortfolios: this.portfolioService.getSubPortfoliosByPortfolio(campaign.portfolioId)
          }).subscribe({
            next: (result) => {
              this.portfolios = result.portfolios;
              this.subPortfolios = result.subPortfolios;

              console.log('✅ Data loaded, now setting selected values:', {
                portfolios: this.portfolios.length,
                subPortfolios: this.subPortfolios.length,
                selectedTenant: campaign.tenantId,
                selectedPortfolio: campaign.portfolioId,
                selectedSubPortfolio: campaign.subPortfolioId
              });

              // AHORA SÍ asignar los valores después de cargar las opciones
              this.selectedTenantId = campaign.tenantId || 0;
              this.selectedPortfolioId = campaign.portfolioId || 0;
              this.selectedSubPortfolioId = campaign.subPortfolioId || 0;

              console.log('✅ Selected values assigned:', {
                selectedTenantId: this.selectedTenantId,
                selectedPortfolioId: this.selectedPortfolioId,
                selectedSubPortfolioId: this.selectedSubPortfolioId
              });

              // Cargar campos filtrables y filtros existentes
              if (campaign.subPortfolioId) {
                this.loadFilterableFields(campaign.subPortfolioId);
              }
              if (campaign.id) {
                this.loadCampaignFilters(campaign.id);
              }

              this.loading = false;
            },
            error: (err) => {
              console.error('❌ Error loading portfolios/subportfolios:', err);
              this.error = 'Error al cargar portfolios/subportfolios';
              this.loading = false;
            }
          });
        } else {
          console.warn('⚠️ Missing tenant/portfolio/subportfolio IDs');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('❌ Error loading campaign:', err);
        this.error = 'Error al cargar la campaña';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.campaign.name) {
      this.error = 'El nombre de la campaña es requerido';
      return;
    }

    if (!this.selectedSubPortfolioId || this.selectedSubPortfolioId === 0) {
      this.error = 'Debe seleccionar una subcartera';
      return;
    }

    // Asignar los IDs seleccionados
    this.campaign.tenantId = this.selectedTenantId;
    this.campaign.portfolioId = this.selectedPortfolioId;
    this.campaign.subPortfolioId = this.selectedSubPortfolioId;

    // Convertir fechas de string a formato ISO
    if (this.startDateString) {
      this.campaign.startDate = this.startDateString;
    }
    if (this.endDateString) {
      this.campaign.endDate = this.endDateString;
    }

    this.error = null;

    if (this.isEditMode && this.campaignId) {
      // En modo edición, actualizar directamente
      this.loading = true;
      this.campaignService.updateCampaign(this.campaignId, this.campaign).subscribe({
        next: () => {
          this.saveFiltersAndNavigate(this.campaignId!);
        },
        error: (err) => {
          console.error('Error updating campaign:', err);
          this.error = 'Error al actualizar la campaña';
          this.loading = false;
        }
      });
    } else {
      // Para nueva campaña, mostrar preview primero
      this.showPreview();
    }
  }

  /**
   * Muestra el modal de preview con el resumen de la campaña
   */
  showPreview(): void {
    this.previewLoading = true;
    this.previewError = null;
    this.showPreviewModal = true;

    this.campaignService.previewImportacion(
      this.selectedTenantId,
      this.selectedPortfolioId,
      this.selectedSubPortfolioId,
      this.campaign.tipoFiltroEstado || 'ULTIMO_ESTADO',
      this.campaignFilters
    ).subscribe({
      next: (preview) => {
        this.previewData = preview;
        this.previewLoading = false;
      },
      error: (err) => {
        console.error('Error en preview:', err);
        this.previewError = 'Error al obtener el preview de la campaña';
        this.previewLoading = false;
      }
    });
  }

  /**
   * Cierra el modal de preview
   */
  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewData = null;
    this.previewError = null;
  }

  /**
   * Confirma la creación de la campaña desde el modal de preview
   */
  confirmCreateCampaign(): void {
    this.showPreviewModal = false;
    this.loading = true;

    this.campaignService.createCampaign(this.campaign).subscribe({
      next: (response: any) => {
        const newCampaignId = response.id || response;
        if (newCampaignId) {
          this.saveFiltersAndNavigate(newCampaignId);
        } else {
          console.error('No se pudo obtener el ID de la campaña creada');
          this.router.navigate(['/admin/campaigns']);
        }
      },
      error: (err) => {
        console.error('Error creating campaign:', err);
        this.error = 'Error al crear la campaña';
        this.loading = false;
      }
    });
  }

  /**
   * Calcula el total de contactos del preview
   */
  getPreviewTotal(): number {
    if (!this.previewData?.porTipoContactoFiltrado) return 0;
    return Object.values(this.previewData.porTipoContactoFiltrado).reduce((sum, val) => sum + val, 0);
  }

  /**
   * Calcula el porcentaje de un tipo de contacto
   */
  getPreviewPercentage(count: number): string {
    const total = this.getPreviewTotal();
    if (total === 0) return '0.0';
    return ((count / total) * 100).toFixed(1);
  }

  private saveFiltersAndNavigate(campaignId: number): void {
    // SIEMPRE llamar a saveCampaignFilters (incluso con array vacío)
    // Esto dispara el auto-import de contactos en el backend
    console.log('📤 Enviando filtros para campaña', campaignId, ':', this.campaignFilters);
    console.log('📋 Cantidad de filtros a enviar:', this.campaignFilters.length);
    this.campaignFilters.forEach((f, i) => {
      console.log(`  Filtro[${i}]:`, f.fieldCode, f.fieldName, 'min:', f.minValue, 'max:', f.maxValue);
    });

    this.campaignService.saveCampaignFilters(campaignId, this.campaignFilters).subscribe({
      next: (response) => {
        console.log('✅ Filtros guardados correctamente, respuesta:', response);
        // Exportar Excel con resumen y lista de clientes
        this.exportCampaignToExcel(campaignId);
      },
      error: (err) => {
        console.error('Error guardando filtros:', err);
        // Navegar de todos modos aunque fallen los filtros
        this.router.navigate(['/admin/campaigns']);
      }
    });
  }

  /**
   * Exporta la campaña a Excel con dos hojas:
   * 1. Resumen: datos del preview
   * 2. Clientes: documento y celular
   */
  private exportCampaignToExcel(campaignId: number): void {
    // Obtener los contactos de la campaña
    this.http.get<Array<{documento: string, celular: string}>>(
      `${environment.apiUrl}/contacts/campaign/${campaignId}/export`
    ).subscribe({
      next: (contacts) => {
        console.log('📊 Exportando', contacts.length, 'contactos a Excel');

        // Crear workbook
        const wb = XLSX.utils.book_new();

        // === HOJA 1: RESUMEN ===
        const resumenData: any[][] = [
          ['RESUMEN DE CAMPAÑA'],
          [],
          ['Campaña', this.campaign.name],
          ['Descripción', this.campaign.description || ''],
          [],
          ['DATOS DE SUBCARTERA'],
          ['Total en Subcartera', this.previewData?.totalClientesSubcartera || 0],
          ['Excluidos por Blacklist', this.previewData?.excluidosPorBlacklist || 0],
          ['Disponibles', this.previewData?.totalDespuesBlacklist || 0],
          [],
          ['DISTRIBUCIÓN POR TIPO DE CONTACTO'],
          ['Tipo', 'Nombre', 'Cantidad', 'Porcentaje']
        ];

        // Agregar filas por tipo de contacto
        const total = this.getPreviewTotal();
        this.tiposContacto.forEach(tipo => {
          const cantidad = this.previewData?.porTipoContactoFiltrado[tipo.codigo] || 0;
          const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) + '%' : '0%';
          resumenData.push([tipo.codigo, tipo.nombre, cantidad, porcentaje]);
        });
        resumenData.push(['TOTAL', '', total, '100%']);

        // Agregar filtros aplicados
        if (this.campaignFilters.length > 0) {
          resumenData.push([]);
          resumenData.push(['FILTROS APLICADOS']);
          this.campaignFilters.forEach(f => {
            const filtroDesc = f.fieldCode
              ? `${f.fieldName}: ${f.minValue || 'N/A'} - ${f.maxValue || 'N/A'}`
              : 'Solo por Estado';
            resumenData.push([this.getTipoContactoNombre(f.tipoContacto), filtroDesc]);
          });
        }

        const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
        XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

        // === HOJA 2: CLIENTES ===
        const clientesData: any[][] = [
          ['DOCUMENTO', 'CELULAR']
        ];
        contacts.forEach(c => {
          clientesData.push([c.documento, c.celular]);
        });

        const wsClientes = XLSX.utils.aoa_to_sheet(clientesData);
        XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');

        // Generar archivo y descargar
        const fechaHoy = new Date().toISOString().split('T')[0];
        const fileName = `Campaña_${this.campaign.name.replace(/[^a-zA-Z0-9]/g, '_')}_${fechaHoy}.xlsx`;
        XLSX.writeFile(wb, fileName);

        console.log('✅ Excel exportado:', fileName);
        this.router.navigate(['/admin/campaigns']);
      },
      error: (err) => {
        console.error('Error obteniendo contactos para exportar:', err);
        // Navegar de todos modos aunque falle la exportación
        this.router.navigate(['/admin/campaigns']);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/campaigns']);
  }

  /**
   * Convierte una fecha ISO string a formato datetime-local (YYYY-MM-DDTHH:mm)
   */
  private toDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
