import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutorizacionService, SupervisorEnLinea } from '../../../core/services/autorizacion.service';

@Component({
  selector: 'app-select-supervisor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (visible) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <h2>🔐 Seleccionar Supervisor para Autorización</h2>
            <button class="close-btn" (click)="onCancel()">&times;</button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            @if (cargando()) {
              <div class="loading-container">
                <div class="spinner"></div>
                <p>Buscando supervisores en línea...</p>
              </div>
            } @else if (supervisores().length === 0) {
              <div class="no-supervisors">
                <span class="warning-icon">⚠️</span>
                <p class="title">No hay supervisores en línea</p>
                <p class="subtitle">Intenta de nuevo más tarde o contacta a un administrador</p>
                <button class="retry-btn" (click)="cargarSupervisores()">
                  🔄 Reintentar
                </button>
              </div>
            } @else {
              <p class="instruction">Selecciona a quién enviar la solicitud de autorización:</p>

              <div class="supervisors-list">
                @for (supervisor of supervisores(); track supervisor.idUsuario) {
                  <div
                    class="supervisor-card"
                    [class.selected]="supervisorSeleccionado?.idUsuario === supervisor.idUsuario"
                    (click)="selectSupervisor(supervisor)">
                    <div class="radio-container">
                      <input
                        type="radio"
                        [name]="'supervisor'"
                        [value]="supervisor.idUsuario"
                        [checked]="supervisorSeleccionado?.idUsuario === supervisor.idUsuario"
                        (change)="selectSupervisor(supervisor)">
                    </div>
                    <div class="supervisor-info">
                      <div class="name">
                        <span class="user-icon">👤</span>
                        {{ supervisor.nombreCompleto }}
                      </div>
                      <div class="details">
                        <span class="rol-badge" [class.admin]="supervisor.rol === 'ADMIN'">
                          {{ supervisor.rol }}
                        </span>
                        <span class="estado-badge" [class]="getEstadoClass(supervisor.estado)">
                          {{ supervisor.estado }}
                        </span>
                        @if (supervisor.solicitudesPendientes && supervisor.solicitudesPendientes > 0) {
                          <span class="pendientes-badge">
                            {{ supervisor.solicitudesPendientes }} pendiente(s)
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn btn-cancel" (click)="onCancel()">
              Cancelar
            </button>
            <button
              class="btn btn-primary"
              [disabled]="!supervisorSeleccionado || cargando()"
              (click)="onConfirm()">
              📤 Enviar Solicitud
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
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 550px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 12px 12px 0 0;
      color: white;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .modal-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
      min-height: 200px;
    }

    .loading-container,
    .no-supervisors {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .warning-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .no-supervisors .title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
    }

    .no-supervisors .subtitle {
      color: #6b7280;
      margin: 0 0 1rem 0;
    }

    .retry-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #3b82f6;
      background: white;
      color: #3b82f6;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .retry-btn:hover {
      background: #eff6ff;
    }

    .instruction {
      color: #6b7280;
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
    }

    .supervisors-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .supervisor-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .supervisor-card:hover {
      border-color: #93c5fd;
      background: #f0f9ff;
    }

    .supervisor-card.selected {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .radio-container {
      flex-shrink: 0;
    }

    .radio-container input[type="radio"] {
      width: 18px;
      height: 18px;
      accent-color: #3b82f6;
      cursor: pointer;
    }

    .supervisor-info {
      flex: 1;
    }

    .name {
      font-weight: 600;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .user-icon {
      font-size: 1rem;
    }

    .details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .rol-badge {
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      background: #dbeafe;
      color: #1d4ed8;
    }

    .rol-badge.admin {
      background: #fee2e2;
      color: #dc2626;
    }

    .estado-badge {
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .estado-badge.disponible {
      background: #dcfce7;
      color: #166534;
    }

    .estado-badge.en-llamada {
      background: #fef3c7;
      color: #92400e;
    }

    .estado-badge.desconectado {
      background: #fee2e2;
      color: #dc2626;
    }

    .pendientes-badge {
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      background: #fef3c7;
      color: #92400e;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 0 0 12px 12px;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: white;
      border: 1px solid #d1d5db;
      color: #374151;
    }

    .btn-cancel:hover {
      background: #f3f4f6;
    }

    .btn-primary {
      background: #3b82f6;
      border: none;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      background: #93c5fd;
      cursor: not-allowed;
    }
  `]
})
export class SelectSupervisorModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() supervisorSelected = new EventEmitter<SupervisorEnLinea>();
  @Output() cancelled = new EventEmitter<void>();

  supervisores = signal<SupervisorEnLinea[]>([]);
  cargando = signal<boolean>(false);
  supervisorSeleccionado: SupervisorEnLinea | null = null;

  constructor(private autorizacionService: AutorizacionService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.cargarSupervisores();
    }
  }

  cargarSupervisores(): void {
    this.cargando.set(true);
    this.autorizacionService.obtenerSupervisoresEnLinea().subscribe({
      next: (supervisores) => {
        this.supervisores.set(supervisores);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('[SELECT-SUPERVISOR] Error al cargar supervisores:', error);
        this.cargando.set(false);
      }
    });
  }

  selectSupervisor(supervisor: SupervisorEnLinea): void {
    this.supervisorSeleccionado = supervisor;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE':
      case 'CONECTADO':
        return 'disponible';
      case 'EN_LLAMADA':
        return 'en-llamada';
      case 'DESCONECTADO':
        return 'desconectado';
      default:
        return '';
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCancel();
    }
  }

  onConfirm(): void {
    if (this.supervisorSeleccionado) {
      this.supervisorSelected.emit(this.supervisorSeleccionado);
      this.closeModal();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.closeModal();
  }

  private closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.supervisorSeleccionado = null;
  }
}
