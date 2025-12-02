import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutorizacionService, SolicitudAutorizacion, CuotaSolicitud } from '../../../core/services/autorizacion.service';

@Component({
  selector: 'app-authorization-approval-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  template: `
    @if (visible && solicitud) {
      <div class="modal-overlay">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-left">
              <h2>📋 Solicitud de Autorización</h2>
              <div class="agent-info">
                <span class="agent-name">👤 {{ solicitud.nombreAgente }}</span>
                <span class="badge-warning">Solicita Autorización</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Información del cliente -->
            <div class="section">
              <h4><span class="icon">🪪</span> Datos del Cliente</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre</label>
                  <p>{{ solicitud.nombreCliente || 'N/A' }}</p>
                </div>
                <div class="info-item">
                  <label>Documento</label>
                  <p>{{ solicitud.documentoCliente || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Tipificación -->
            <div class="section">
              <h4><span class="icon">🏷️</span> Tipificación</h4>
              <span class="badge-info">{{ solicitud.nombreTipificacion || 'Promesa de Pago' }}</span>
            </div>

            <!-- Detalles del cronograma -->
            <div class="section">
              <h4><span class="icon">💰</span> Detalle del Cronograma</h4>

              <div class="summary-box">
                <div class="summary-item">
                  <span class="summary-label">Monto Total</span>
                  <span class="summary-value highlight">S/ {{ solicitud.montoTotal?.toFixed(2) }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Número de Cuotas</span>
                  <span class="summary-value">{{ solicitud.numeroCuotas }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Campo Origen</span>
                  <span class="summary-value small">{{ solicitud.campoMontoOrigen || 'Personalizado' }}</span>
                </div>
              </div>

              @if (solicitud.cuotas && solicitud.cuotas.length > 0) {
                <div class="table-container">
                  <table class="cuotas-table">
                    <thead>
                      <tr>
                        <th>Cuota</th>
                        <th>Monto</th>
                        <th>Fecha de Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (cuota of solicitud.cuotas; track cuota.numeroCuota) {
                        <tr>
                          <td class="text-center">{{ cuota.numeroCuota }}</td>
                          <td class="font-medium">S/ {{ cuota.monto?.toFixed(2) }}</td>
                          <td>{{ formatFecha(cuota.fechaPago) }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>

            <!-- Observaciones del agente -->
            @if (solicitud.observacionesAgente) {
              <div class="section">
                <h4><span class="icon">💬</span> Observaciones del Agente</h4>
                <div class="observations-box">
                  {{ solicitud.observacionesAgente }}
                </div>
              </div>
            }

            <!-- Comentarios del supervisor -->
            <div class="section">
              <h4><span class="icon">✏️</span> Comentarios (opcional)</h4>
              <textarea
                [(ngModel)]="comentarios"
                rows="2"
                placeholder="Agrega comentarios para el agente..."
                class="comment-input">
              </textarea>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              class="btn btn-reject"
              [disabled]="procesando()"
              (click)="rechazar()">
              ❌ Rechazar
            </button>
            <button
              class="btn btn-approve"
              [disabled]="procesando()"
              (click)="aprobar()">
              @if (procesando()) {
                <span class="spinner-small"></span>
              }
              ✅ Aprobar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
      width: 95%;
      max-width: 650px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 16px 16px 0 0;
      color: white;
    }

    .header-left h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .agent-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .agent-name {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .badge-warning {
      background: rgba(255,255,255,0.2);
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .badge-info {
      background: #dbeafe;
      color: #1d4ed8;
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .time-remaining {
      text-align: right;
      min-width: 100px;
    }

    .time-remaining.warning .time-value {
      color: #fef3c7;
    }

    .time-remaining.urgent .time-value {
      color: #fee2e2;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .time-display {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .time-icon {
      font-size: 1rem;
    }

    .time-value {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .progress-bar {
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: white;
      border-radius: 2px;
      transition: width 1s linear;
    }

    .modal-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .section {
      margin-bottom: 1.25rem;
    }

    .section h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.75rem 0;
      font-size: 0.9rem;
      color: #374151;
      font-weight: 600;
    }

    .icon {
      font-size: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .info-item label {
      display: block;
      font-size: 0.75rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .info-item p {
      margin: 0;
      font-weight: 600;
      color: #1f2937;
    }

    .summary-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
    }

    .summary-item {
      text-align: center;
    }

    .summary-label {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .summary-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
    }

    .summary-value.highlight {
      color: #0369a1;
      font-size: 1.25rem;
    }

    .summary-value.small {
      font-size: 0.85rem;
    }

    .table-container {
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .cuotas-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    .cuotas-table th {
      background: #f9fafb;
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      position: sticky;
      top: 0;
    }

    .cuotas-table td {
      padding: 0.6rem 0.75rem;
      border-top: 1px solid #f3f4f6;
    }

    .cuotas-table tr:hover {
      background: #f9fafb;
    }

    .text-center {
      text-align: center;
    }

    .font-medium {
      font-weight: 600;
    }

    .observations-box {
      background: #f9fafb;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #374151;
      border: 1px solid #e5e7eb;
    }

    .comment-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      resize: vertical;
      font-family: inherit;
    }

    .comment-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 0 0 16px 16px;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-reject {
      background: white;
      border: 2px solid #ef4444;
      color: #ef4444;
    }

    .btn-reject:hover:not(:disabled) {
      background: #fef2f2;
    }

    .btn-approve {
      background: #22c55e;
      border: none;
      color: white;
    }

    .btn-approve:hover:not(:disabled) {
      background: #16a34a;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .summary-box {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .modal-header {
        flex-direction: column;
        gap: 1rem;
      }

      .time-remaining {
        text-align: left;
        width: 100%;
      }

      .time-display {
        justify-content: flex-start;
      }
    }
  `]
})
export class AuthorizationApprovalModalComponent {
  @Input() visible = false;
  @Input() solicitud: SolicitudAutorizacion | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() aprobada = new EventEmitter<{solicitud: SolicitudAutorizacion, comentarios: string}>();
  @Output() rechazada = new EventEmitter<{solicitud: SolicitudAutorizacion, comentarios: string}>();

  comentarios = '';
  procesando = signal<boolean>(false);

  constructor(private autorizacionService: AutorizacionService) {}

  formatFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  }

  aprobar(): void {
    if (!this.solicitud) return;

    this.procesando.set(true);
    this.aprobada.emit({
      solicitud: this.solicitud,
      comentarios: this.comentarios
    });
  }

  rechazar(): void {
    if (!this.solicitud) return;

    this.procesando.set(true);
    this.rechazada.emit({
      solicitud: this.solicitud,
      comentarios: this.comentarios
    });
  }
}
