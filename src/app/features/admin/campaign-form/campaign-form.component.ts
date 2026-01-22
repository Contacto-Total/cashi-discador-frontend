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
import { Workbook, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';

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
        // El backend devuelve {success, mensaje, campaignId, campaign}
        const newCampaignId = response.campaignId || response.campaign?.id || response.id;
        console.log('Campaña creada, respuesta:', response, 'ID extraído:', newCampaignId);
        if (newCampaignId && typeof newCampaignId === 'number') {
          this.saveFiltersAndNavigate(newCampaignId);
        } else {
          console.error('No se pudo obtener el ID de la campaña creada. Respuesta:', response);
          this.error = 'Error: No se pudo obtener el ID de la campaña';
          this.loading = false;
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
   * Exporta la campaña a Excel con dos hojas y estilos profesionales:
   * 1. Resumen: datos del preview con colores y formato
   * 2. Clientes: documento y celular con tabla formateada
   */
  private exportCampaignToExcel(campaignId: number): void {
    // Obtener los contactos de la campaña
    this.http.get<Array<{documento: string, celular: string}>>(
      `${environment.apiUrl}/contacts/campaign/${campaignId}/export`
    ).subscribe({
      next: async (contacts) => {
        console.log('Exportando', contacts.length, 'contactos a Excel');

        // Crear workbook con ExcelJS
        const workbook = new Workbook();
        workbook.creator = 'Sistema de Cobranza';
        workbook.created = new Date();

        // === HOJA 1: RESUMEN ===
        const wsResumen = workbook.addWorksheet('Resumen', {
          properties: { tabColor: { argb: '3B82F6' } }
        });

        // Configurar anchos de columna
        wsResumen.columns = [
          { width: 25 },
          { width: 35 },
          { width: 15 },
          { width: 15 }
        ];

        // Título principal
        wsResumen.mergeCells('A1:D1');
        const titleCell = wsResumen.getCell('A1');
        titleCell.value = 'RESUMEN DE CAMPAÑA';
        titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3B82F6' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        wsResumen.getRow(1).height = 30;

        // Datos de la campaña
        let rowNum = 3;
        this.addLabelValueRow(wsResumen, rowNum++, 'Campaña:', this.campaign.name, '10B981');
        this.addLabelValueRow(wsResumen, rowNum++, 'Descripción:', this.campaign.description || '-', '10B981');
        rowNum++;

        // Sección: Datos de Subcartera
        wsResumen.mergeCells(`A${rowNum}:D${rowNum}`);
        const subcarteraTitle = wsResumen.getCell(`A${rowNum}`);
        subcarteraTitle.value = 'DATOS DE SUBCARTERA';
        subcarteraTitle.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
        subcarteraTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6366F1' } };
        subcarteraTitle.alignment = { horizontal: 'center' };
        rowNum++;

        this.addLabelValueRow(wsResumen, rowNum++, 'Total en Subcartera:', this.previewData?.totalClientesSubcartera || 0);
        this.addLabelValueRow(wsResumen, rowNum++, 'Excluidos por Blacklist:', this.previewData?.excluidosPorBlacklist || 0, 'EF4444');
        this.addLabelValueRow(wsResumen, rowNum++, 'Disponibles:', this.previewData?.totalDespuesBlacklist || 0, '10B981');
        rowNum++;

        // Sección: Distribución por tipo de contacto
        wsResumen.mergeCells(`A${rowNum}:D${rowNum}`);
        const distTitle = wsResumen.getCell(`A${rowNum}`);
        distTitle.value = 'DISTRIBUCIÓN POR TIPO DE CONTACTO';
        distTitle.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
        distTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '8B5CF6' } };
        distTitle.alignment = { horizontal: 'center' };
        rowNum++;

        // Encabezados de tabla
        const headerRow = wsResumen.getRow(rowNum);
        ['Código', 'Nombre', 'Cantidad', 'Porcentaje'].forEach((header, idx) => {
          const cell = headerRow.getCell(idx + 1);
          cell.value = header;
          cell.font = { bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } };
          cell.alignment = { horizontal: 'center' };
          cell.border = this.getTableBorder();
        });
        rowNum++;

        // Datos por tipo de contacto
        const total = this.getPreviewTotal();
        const tipoColors: { [key: string]: string } = {
          'CD': '10B981', 'CI': '3B82F6', 'PR': 'EF4444', 'NC': '6B7280'
        };

        this.tiposContacto.forEach(tipo => {
          const cantidad = this.previewData?.porTipoContactoFiltrado[tipo.codigo] || 0;
          const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) + '%' : '0%';
          const row = wsResumen.getRow(rowNum);

          row.getCell(1).value = tipo.codigo;
          row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: tipoColors[tipo.codigo] || '6B7280' } };
          row.getCell(1).font = { bold: true, color: { argb: 'FFFFFF' } };
          row.getCell(1).alignment = { horizontal: 'center' };

          row.getCell(2).value = tipo.nombre;
          row.getCell(3).value = cantidad;
          row.getCell(3).alignment = { horizontal: 'center' };
          row.getCell(4).value = porcentaje;
          row.getCell(4).alignment = { horizontal: 'center' };

          [1, 2, 3, 4].forEach(col => {
            row.getCell(col).border = this.getTableBorder();
          });
          rowNum++;
        });

        // Fila TOTAL
        const totalRow = wsResumen.getRow(rowNum);
        totalRow.getCell(1).value = 'TOTAL';
        totalRow.getCell(1).font = { bold: true };
        totalRow.getCell(2).value = '';
        totalRow.getCell(3).value = total;
        totalRow.getCell(3).font = { bold: true };
        totalRow.getCell(3).alignment = { horizontal: 'center' };
        totalRow.getCell(4).value = '100%';
        totalRow.getCell(4).font = { bold: true };
        totalRow.getCell(4).alignment = { horizontal: 'center' };
        [1, 2, 3, 4].forEach(col => {
          totalRow.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E7EB' } };
          totalRow.getCell(col).border = this.getTableBorder();
        });
        rowNum += 2;

        // Sección: Filtros aplicados
        if (this.campaignFilters.length > 0) {
          wsResumen.mergeCells(`A${rowNum}:D${rowNum}`);
          const filtrosTitle = wsResumen.getCell(`A${rowNum}`);
          filtrosTitle.value = 'FILTROS APLICADOS';
          filtrosTitle.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
          filtrosTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F59E0B' } };
          filtrosTitle.alignment = { horizontal: 'center' };
          rowNum++;

          this.campaignFilters.forEach(f => {
            const filtroDesc = f.fieldCode
              ? `${f.fieldName}: ${f.minValue ?? 'N/A'} - ${f.maxValue ?? 'N/A'}`
              : 'Solo por Estado';
            const row = wsResumen.getRow(rowNum);
            row.getCell(1).value = this.getTipoContactoNombre(f.tipoContacto);
            row.getCell(2).value = filtroDesc;
            wsResumen.mergeCells(`B${rowNum}:D${rowNum}`);
            rowNum++;
          });
        }

        // === HOJA 2: CLIENTES ===
        const wsClientes = workbook.addWorksheet('Clientes', {
          properties: { tabColor: { argb: '10B981' } }
        });

        // Configurar anchos
        wsClientes.columns = [
          { width: 5 },
          { width: 20 },
          { width: 20 }
        ];

        // Título
        wsClientes.mergeCells('A1:C1');
        const clientesTitle = wsClientes.getCell('A1');
        clientesTitle.value = `LISTA DE CONTACTOS - ${this.campaign.name}`;
        clientesTitle.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
        clientesTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10B981' } };
        clientesTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        wsClientes.getRow(1).height = 28;

        // Info de cantidad
        wsClientes.mergeCells('A2:C2');
        const countCell = wsClientes.getCell('A2');
        countCell.value = `Total: ${contacts.length} contactos`;
        countCell.font = { italic: true, color: { argb: '6B7280' } };
        countCell.alignment = { horizontal: 'center' };

        // Encabezados
        const clienteHeader = wsClientes.getRow(4);
        ['#', 'DOCUMENTO', 'CELULAR'].forEach((h, idx) => {
          const cell = clienteHeader.getCell(idx + 1);
          cell.value = h;
          cell.font = { bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } };
          cell.alignment = { horizontal: 'center' };
          cell.border = this.getTableBorder();
        });

        // Datos de clientes
        contacts.forEach((c, idx) => {
          const row = wsClientes.getRow(5 + idx);
          row.getCell(1).value = idx + 1;
          row.getCell(1).alignment = { horizontal: 'center' };
          row.getCell(2).value = c.documento || '';
          row.getCell(3).value = c.celular || '';

          // Alternar colores de fila
          const bgColor = idx % 2 === 0 ? 'FFFFFF' : 'F3F4F6';
          [1, 2, 3].forEach(col => {
            row.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
            row.getCell(col).border = this.getTableBorder();
          });
        });

        // Generar y descargar
        const fechaHoy = new Date().toISOString().split('T')[0];
        const fileName = `Campana_${this.campaign.name.replace(/[^a-zA-Z0-9]/g, '_')}_${fechaHoy}.xlsx`;

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), fileName);

        console.log('Excel exportado:', fileName);
        this.router.navigate(['/admin/campaigns']);
      },
      error: (err) => {
        console.error('Error obteniendo contactos para exportar:', err);
        this.router.navigate(['/admin/campaigns']);
      }
    });
  }

  /**
   * Agrega una fila con etiqueta y valor
   */
  private addLabelValueRow(ws: Worksheet, rowNum: number, label: string, value: any, colorHex?: string): void {
    const row = ws.getRow(rowNum);
    row.getCell(1).value = label;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = value;
    if (colorHex) {
      row.getCell(2).font = { bold: true, color: { argb: colorHex } };
    }
  }

  /**
   * Retorna el estilo de borde para tablas
   */
  private getTableBorder(): any {
    return {
      top: { style: 'thin', color: { argb: 'D1D5DB' } },
      left: { style: 'thin', color: { argb: 'D1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
      right: { style: 'thin', color: { argb: 'D1D5DB' } }
    };
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
