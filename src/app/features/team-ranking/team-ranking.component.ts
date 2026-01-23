import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TeamRankingService, TeamRankingDTO, AgentRankingInfo, PromesasMesDTO, PromesaDetalle } from './team-ranking.service';
import { AuthService } from '../../core/services/auth.service';
import { interval, Subscription } from 'rxjs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-team-ranking',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DecimalPipe, DatePipe],
  templateUrl: './team-ranking.component.html',
  styleUrls: ['./team-ranking.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeamRankingComponent implements OnInit, OnDestroy {
  // Pestañas
  activeTab: 'ranking' | 'promesas' = 'ranking';

  // Ranking
  ranking: TeamRankingDTO | null = null;
  loading = true;
  error: string | null = null;
  agenteId: number | null = null;

  // Promesas del mes
  promesasMes: PromesasMesDTO | null = null;
  loadingPromesas = false;
  errorPromesas: string | null = null;
  exportingExcel = false;

  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL = 60000; // 1 minuto

  constructor(
    private teamRankingService: TeamRankingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.agenteId = this.authService.getCurrentUserId();
    if (this.agenteId) {
      this.loadRanking();
      this.startAutoRefresh();
    } else {
      this.error = 'No se pudo obtener el ID del usuario';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadRanking(): void {
    if (!this.agenteId) return;

    this.loading = true;
    this.teamRankingService.getRankingEquipo(this.agenteId).subscribe({
      next: (data) => {
        this.ranking = data;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error cargando ranking:', err);
        this.error = 'Error al cargar el ranking del equipo';
        this.loading = false;
      }
    });
  }

  private startAutoRefresh(): void {
    this.refreshSubscription = interval(this.REFRESH_INTERVAL).subscribe(() => {
      this.loadRanking();
    });
  }

  private stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Helpers para el template
  getMedalIcon(posicion: number): string {
    switch (posicion) {
      case 1: return 'trophy';
      case 2: return 'medal';
      case 3: return 'award';
      default: return 'user';
    }
  }

  getMedalColor(posicion: number): string {
    switch (posicion) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#64748b';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'minus';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  }

  getEfectividadColor(efectividad: number): string {
    if (efectividad >= 80) return '#10B981';
    if (efectividad >= 50) return '#F59E0B';
    return '#EF4444';
  }

  getMetaColor(porcentaje: number | null): string {
    if (!porcentaje) return '#EF4444';
    if (porcentaje >= 100) return '#10B981'; // Verde - Meta cumplida
    if (porcentaje >= 70) return '#3B82F6';  // Azul - Buen progreso
    if (porcentaje >= 40) return '#F59E0B';  // Amarillo - Progreso medio
    return '#EF4444';                         // Rojo - Bajo progreso
  }

  formatMonto(monto: number): string {
    if (monto >= 1000000) {
      return (monto / 1000000).toFixed(1) + 'M';
    }
    if (monto >= 1000) {
      return (monto / 1000).toFixed(1) + 'K';
    }
    return monto.toFixed(0);
  }

  refresh(): void {
    if (this.activeTab === 'ranking') {
      this.loadRanking();
    } else {
      this.loadPromesas();
    }
  }

  // === PESTAÑAS ===
  setActiveTab(tab: 'ranking' | 'promesas'): void {
    this.activeTab = tab;
    if (tab === 'promesas' && !this.promesasMes) {
      this.loadPromesas();
    }
  }

  // === PROMESAS DEL MES ===
  loadPromesas(): void {
    if (!this.agenteId) return;

    this.loadingPromesas = true;
    this.errorPromesas = null;

    this.teamRankingService.getPromesasMes(this.agenteId).subscribe({
      next: (data) => {
        this.promesasMes = data;
        this.loadingPromesas = false;
      },
      error: (err) => {
        console.error('Error cargando promesas:', err);
        this.errorPromesas = 'Error al cargar las promesas del mes';
        this.loadingPromesas = false;
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PAGADA': return '#10B981';
      case 'PENDIENTE': return '#F59E0B';
      case 'VENCIDA': return '#EF4444';
      case 'PARCIAL': return '#3B82F6';
      default: return '#6B7280';
    }
  }

  getEstadoBgColor(estado: string): string {
    switch (estado) {
      case 'PAGADA': return '#10B98120';
      case 'PENDIENTE': return '#F59E0B20';
      case 'VENCIDA': return '#EF444420';
      case 'PARCIAL': return '#3B82F620';
      default: return '#6B728020';
    }
  }

  // === EXPORTAR A EXCEL ===
  async exportarExcel(): Promise<void> {
    if (!this.promesasMes || this.exportingExcel) return;

    this.exportingExcel = true;

    try {
      const workbook = new Workbook();
      workbook.creator = 'Sistema de Cobranza';
      workbook.created = new Date();

      const ws = workbook.addWorksheet('Promesas del Mes', {
        properties: { tabColor: { argb: '10B981' } }
      });

      // Configurar anchos
      ws.columns = [
        { width: 12 },  // Fecha
        { width: 14 },  // Documento
        { width: 25 },  // Cliente
        { width: 14 },  // Teléfono
        { width: 20 },  // Agente
        { width: 14 },  // Monto
        { width: 8 },   // Cuotas
        { width: 12 },  // Estado
        { width: 14 },  // Fecha Pago
        { width: 30 },  // Tipificación
      ];

      // Título
      ws.mergeCells('A1:J1');
      const titleCell = ws.getCell('A1');
      titleCell.value = `PROMESAS DEL MES - ${this.promesasMes.mesAnio?.toUpperCase() || ''}`;
      titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10B981' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getRow(1).height = 30;

      // Resumen
      let row = 3;
      ws.getCell(`A${row}`).value = 'RESUMEN';
      ws.getCell(`A${row}`).font = { bold: true, size: 12 };
      row++;

      const resumen = this.promesasMes.resumen;
      ws.getCell(`A${row}`).value = 'Total Promesas:';
      ws.getCell(`B${row}`).value = resumen.totalPromesas;
      ws.getCell(`C${row}`).value = 'Monto Total:';
      ws.getCell(`D${row}`).value = resumen.montoTotal;
      ws.getCell(`D${row}`).numFmt = '"S/." #,##0.00';
      row++;

      ws.getCell(`A${row}`).value = 'Pagadas:';
      ws.getCell(`A${row}`).font = { color: { argb: '10B981' } };
      ws.getCell(`B${row}`).value = resumen.promesasPagadas;
      ws.getCell(`C${row}`).value = 'Monto Pagado:';
      ws.getCell(`D${row}`).value = resumen.montoPagado;
      ws.getCell(`D${row}`).numFmt = '"S/." #,##0.00';
      row++;

      ws.getCell(`A${row}`).value = 'Pendientes:';
      ws.getCell(`A${row}`).font = { color: { argb: 'F59E0B' } };
      ws.getCell(`B${row}`).value = resumen.promesasPendientes;
      ws.getCell(`C${row}`).value = 'Monto Pendiente:';
      ws.getCell(`D${row}`).value = resumen.montoPendiente;
      ws.getCell(`D${row}`).numFmt = '"S/." #,##0.00';
      row++;

      ws.getCell(`A${row}`).value = 'Vencidas:';
      ws.getCell(`A${row}`).font = { color: { argb: 'EF4444' } };
      ws.getCell(`B${row}`).value = resumen.promesasVencidas;
      ws.getCell(`C${row}`).value = 'Monto Vencido:';
      ws.getCell(`D${row}`).value = resumen.montoVencido;
      ws.getCell(`D${row}`).numFmt = '"S/." #,##0.00';
      row += 2;

      // Encabezados de tabla
      const headers = ['Fecha', 'Documento', 'Cliente', 'Teléfono', 'Agente', 'Monto', 'Cuotas', 'Estado', 'Fecha Pago', 'Tipificación'];
      const headerRow = ws.getRow(row);
      headers.forEach((h, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = h;
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'D1D5DB' } },
          left: { style: 'thin', color: { argb: 'D1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
          right: { style: 'thin', color: { argb: 'D1D5DB' } }
        };
      });
      row++;

      // Datos
      this.promesasMes.promesas.forEach((p, idx) => {
        const dataRow = ws.getRow(row);
        dataRow.getCell(1).value = p.fechaGestion;
        dataRow.getCell(2).value = p.documentoCliente;
        dataRow.getCell(3).value = p.nombreCliente;
        dataRow.getCell(4).value = p.telefonoContacto;
        dataRow.getCell(5).value = p.nombreAgente;
        dataRow.getCell(6).value = p.montoPromesa;
        dataRow.getCell(6).numFmt = '"S/." #,##0.00';
        dataRow.getCell(7).value = p.totalCuotas || '-';
        dataRow.getCell(8).value = p.estadoPago;
        dataRow.getCell(9).value = p.fechaPagoCompromiso || '-';
        dataRow.getCell(10).value = p.tipificacion;

        // Color de estado
        const estadoCell = dataRow.getCell(8);
        const estadoColor = p.estadoPago === 'PAGADA' ? '10B981' :
                          p.estadoPago === 'VENCIDA' ? 'EF4444' :
                          p.estadoPago === 'PENDIENTE' ? 'F59E0B' : '6B7280';
        estadoCell.font = { bold: true, color: { argb: estadoColor } };

        // Alternar colores
        const bgColor = idx % 2 === 0 ? 'FFFFFF' : 'F3F4F6';
        for (let i = 1; i <= 10; i++) {
          dataRow.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
          dataRow.getCell(i).border = {
            top: { style: 'thin', color: { argb: 'D1D5DB' } },
            left: { style: 'thin', color: { argb: 'D1D5DB' } },
            bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
            right: { style: 'thin', color: { argb: 'D1D5DB' } }
          };
        }
        row++;
      });

      // Descargar
      const buffer = await workbook.xlsx.writeBuffer();
      const fecha = new Date().toISOString().split('T')[0];
      saveAs(new Blob([buffer]), `Promesas_Mes_${fecha}.xlsx`);

    } catch (error) {
      console.error('Error exportando Excel:', error);
    } finally {
      this.exportingExcel = false;
    }
  }
}
