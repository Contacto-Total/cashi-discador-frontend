import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Métricas de un agente
 */
export interface AgenteMetrica {
  agenteId: number;
  nombreAgente: string;
  cantidadPagos: number;
  montoTotal: number;
  promesasRegistradas: number;
  promesasCumplidas: number;
  tasaCumplimiento: number;
}

/**
 * Pagos por día
 */
export interface PagosDiario {
  fecha: string;
  cantidadBanco: number;
  montoBanco: number;
  cantidadAgente: number;
  montoAgente: number;
}

/**
 * Distribución por banco
 */
export interface PagosPorBanco {
  banco: string;
  cantidad: number;
  monto: number;
}

/**
 * DTO completo del dashboard de pagos
 */
export interface PaymentsDashboard {
  // Resumen general - Banco
  totalPagosBanco: number;
  montoTotalBanco: number;
  pagosConciliados: number;
  montoConciliado: number;
  pagosPorFuera: number;
  montoPorFuera: number;

  // Resumen general - Agente
  totalPagosAgente: number;
  montoTotalAgente: number;
  pagosVerificados: number;
  pagosNoVerificados: number;
  montoNoVerificado: number;

  // Promesas
  totalPromesas: number;
  promesasCumplidas: number;
  promesasVencidas: number;
  promesasPendientes: number;
  montoPrometido: number;
  tasaCumplimiento: number;

  // Top agentes
  topAgentes: AgenteMetrica[];

  // Tendencia diaria
  tendenciaDiaria: PagosDiario[];

  // Distribución por banco
  distribucionBancos: PagosPorBanco[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsDashboardService {

  private readonly baseUrl = `${environment.gatewayUrl}/dashboard/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las métricas del dashboard de pagos
   */
  getDashboard(): Observable<PaymentsDashboard> {
    console.log('[DASHBOARD] Obteniendo métricas de pagos...');
    return this.http.get<PaymentsDashboard>(this.baseUrl);
  }
}
