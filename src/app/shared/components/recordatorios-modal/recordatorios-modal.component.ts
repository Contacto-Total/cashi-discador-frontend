import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { RecordatoriosService } from '../../../core/services/recordatorios.service';
import { RecordatorioPromesa, ResultadoLlamadaAMD } from '../../../core/models/recordatorio.model';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export interface RecordatoriosModalData {
  cantidad: number;
  pendientes: number;
  idAgente: number;
  idSubcartera?: number;
  modoSiguiente?: boolean;
  modoFinalizado?: boolean;
  recordatorio?: RecordatorioPromesa;
}

type ModalState = 'initial' | 'countdown' | 'calling' | 'analyzing' | 'buzon' | 'connecting' | 'in_call' | 'finished';

@Component({
  selector: 'app-recordatorios-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  animations: [
    trigger('countdownNumber', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.3)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(1.5)' }))
      ])
    ]),
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      state('active', style({ transform: 'scale(1)' })),
      transition('* => active', [
        animate('600ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ],
  template: `
    <div class="p-6 max-w-md min-w-[420px]">

      <!-- ========== ESTADO INICIAL ========== -->
      <ng-container *ngIf="modalState === 'initial'">
        <!-- Header con icono -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <lucide-angular name="bell-ring" [size]="24" class="text-white"></lucide-angular>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800 dark:text-white">Recordatorios del día</h2>
            <p class="text-sm text-slate-500 dark:text-gray-400">Promesas de pago pendientes</p>
          </div>
        </div>

        <!-- Contenido -->
        <div class="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4 mb-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-700 dark:text-orange-300">Tienes</p>
              <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ data.pendientes }}</p>
              <p class="text-sm text-orange-700 dark:text-orange-300">cliente(s) por llamar</p>
            </div>
            <lucide-angular name="phone-call" [size]="48" class="text-orange-300 dark:text-orange-600"></lucide-angular>
          </div>
        </div>

        <!-- Mensaje -->
        <p class="text-sm text-slate-600 dark:text-gray-400 mb-5">
          El sistema llamará automáticamente y detectará buzones de voz. Solo te conectará con clientes reales.
        </p>

        <!-- Botones -->
        <div class="flex gap-3">
          <button
            (click)="cerrar()"
            class="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-all duration-200">
            Más tarde
          </button>
          <button
            (click)="iniciarDiscado()"
            [disabled]="isLoading"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <lucide-angular name="play" [size]="16"></lucide-angular>
            {{ isLoading ? 'Cargando...' : 'Iniciar' }}
          </button>
        </div>
      </ng-container>

      <!-- ========== ESTADO COUNTDOWN CON INFO DEL CLIENTE ========== -->
      <ng-container *ngIf="modalState === 'countdown'">
        <div class="py-2">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <lucide-angular name="phone" [size]="16" class="text-white"></lucide-angular>
              </div>
              <span class="text-sm font-medium text-slate-600 dark:text-gray-400">
                Llamando en {{ countdownNumber }}s...
              </span>
            </div>
            <span class="text-xs text-slate-400">
              {{ estadoDialer?.recordatoriosCompletados || 0 }}/{{ estadoDialer?.totalRecordatorios || 0 }}
            </span>
          </div>

          <!-- Info del cliente -->
          <div *ngIf="recordatorioActual" class="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <!-- Nombre y documento -->
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-white">
                  {{ recordatorioActual.nombreCliente }}
                </h3>
                <p class="text-sm text-slate-500 dark:text-gray-400">
                  {{ recordatorioActual.documentoCliente }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-400">Teléfono</p>
                <p class="text-sm font-mono font-semibold text-slate-700 dark:text-gray-300">
                  {{ recordatorioActual.telefono }}
                </p>
              </div>
            </div>

            <!-- Estado de la promesa -->
            <div class="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-600 mb-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Promesa de Pago
                </span>
                <span [class]="getEstadoPromesaClass()">
                  {{ getEstadoPromesaLabel() }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <p class="text-xs text-slate-400">Cuota</p>
                  <p class="text-sm font-semibold text-slate-700 dark:text-gray-300">
                    {{ recordatorioActual.numeroCuota }}/{{ recordatorioActual.totalCuotas }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Monto</p>
                  <p class="text-sm font-bold text-green-600 dark:text-green-400">
                    S/ {{ recordatorioActual.monto | number:'1.2-2' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Fecha</p>
                  <p class="text-sm font-semibold text-slate-700 dark:text-gray-300">
                    {{ recordatorioActual.fechaPago | date:'dd/MM' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Observaciones si hay -->
            <div *ngIf="recordatorioActual.observaciones" class="text-xs text-slate-500 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-400">
              <span class="font-medium">Nota:</span> {{ recordatorioActual.observaciones }}
            </div>
          </div>

          <!-- Botón cancelar -->
          <button
            (click)="cancelarDiscado()"
            class="w-full mt-4 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            Cancelar
          </button>
        </div>
      </ng-container>

      <!-- ========== ESTADO ANALIZANDO (AMD) ========== -->
      <ng-container *ngIf="modalState === 'analyzing'">
        <div class="py-4">
          <!-- Header con animación -->
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <lucide-angular name="phone-outgoing" [size]="28" class="text-white"></lucide-angular>
            </div>
          </div>

          <h3 class="text-center text-lg font-bold text-slate-800 dark:text-white mb-2">
            Llamando...
          </h3>
          <p class="text-center text-sm text-slate-500 dark:text-gray-400 mb-4">
            Analizando respuesta del cliente
          </p>

          <!-- Info del cliente compacta -->
          <div *ngIf="recordatorioActual" class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
            <p class="font-semibold text-slate-800 dark:text-white">{{ recordatorioActual.nombreCliente }}</p>
            <p class="text-sm text-slate-500">{{ recordatorioActual.telefono }}</p>
          </div>

          <!-- Barra de progreso -->
          <div class="mt-4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </ng-container>

      <!-- ========== ESTADO BUZÓN DETECTADO ========== -->
      <ng-container *ngIf="modalState === 'buzon'">
        <div class="py-4 text-center" [@fadeSlide]>
          <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <lucide-angular name="voicemail" [size]="28" class="text-white"></lucide-angular>
          </div>

          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">
            Buzón de voz detectado
          </h3>
          <p class="text-sm text-slate-500 dark:text-gray-400 mb-4">
            Pasando al siguiente cliente...
          </p>

          <div *ngIf="recordatorioActual" class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-4">
            <p class="text-sm text-orange-700 dark:text-orange-300">
              {{ recordatorioActual.nombreCliente }} - Registrado como "Buzón"
            </p>
          </div>

          <div class="text-xs text-slate-400">
            Siguiente en {{ autoSkipCountdown }}s...
          </div>
        </div>
      </ng-container>

      <!-- ========== ESTADO CONECTANDO CON AGENTE ========== -->
      <ng-container *ngIf="modalState === 'connecting'">
        <div class="py-4 text-center" [@fadeSlide]>
          <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <lucide-angular name="phone-call" [size]="28" class="text-white"></lucide-angular>
          </div>

          <h3 class="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
            Conectando...
          </h3>
          <p class="text-sm text-slate-500 dark:text-gray-400 mb-4">
            Estableciendo conexión con el cliente
          </p>
        </div>
      </ng-container>

      <!-- ========== ESTADO EN LLAMADA (CONECTADO) ========== -->
      <ng-container *ngIf="modalState === 'in_call'">
        <div class="py-4" [@fadeSlide]>
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <lucide-angular name="phone-call" [size]="20" class="text-white"></lucide-angular>
              </div>
              <div>
                <p class="text-sm font-bold text-green-600 dark:text-green-400">En llamada</p>
                <p class="text-xs text-slate-400">{{ callDuration }}</p>
              </div>
            </div>
            <span class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
              {{ estadoDialer?.recordatoriosCompletados || 0 }}/{{ estadoDialer?.totalRecordatorios || 0 }}
            </span>
          </div>

          <!-- Info del cliente -->
          <div *ngIf="recordatorioActual" class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700 mb-4">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-white">
                  {{ recordatorioActual.nombreCliente }}
                </h3>
                <p class="text-sm text-slate-500 dark:text-gray-400">
                  {{ recordatorioActual.documentoCliente }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-400">Teléfono</p>
                <p class="text-sm font-mono font-semibold text-slate-700 dark:text-gray-300">
                  {{ recordatorioActual.telefono }}
                </p>
              </div>
            </div>

            <!-- Detalles de la promesa -->
            <div class="bg-white dark:bg-slate-800 rounded-lg p-3 border border-green-100 dark:border-slate-600">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-xs text-slate-400">Cuota</p>
                  <p class="text-sm font-bold text-slate-700 dark:text-gray-300">
                    {{ recordatorioActual.numeroCuota }}/{{ recordatorioActual.totalCuotas }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Monto</p>
                  <p class="text-sm font-bold text-green-600">
                    S/ {{ recordatorioActual.monto | number:'1.2-2' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-400">Fecha</p>
                  <p class="text-sm font-bold text-slate-700 dark:text-gray-300">
                    {{ recordatorioActual.fechaPago | date:'dd/MM' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-3">
            <button
              (click)="completarYSiguiente('CONTACTADO')"
              [disabled]="isLoading"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
              <lucide-angular name="check" [size]="18"></lucide-angular>
              Completar y Siguiente
            </button>
            <button
              (click)="terminarDiscado()"
              class="px-4 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-all duration-200">
              <lucide-angular name="x" [size]="18"></lucide-angular>
            </button>
          </div>
        </div>
      </ng-container>

      <!-- ========== ESTADO FINALIZADO ========== -->
      <ng-container *ngIf="modalState === 'finished'">
        <div class="text-center py-6" [@fadeSlide]>
          <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
            <lucide-angular name="check" [size]="40" class="text-white"></lucide-angular>
          </div>

          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">¡Terminaste!</h2>
          <p class="text-slate-600 dark:text-gray-400 mb-6">
            Has completado todos tus recordatorios de pago por hoy.
          </p>

          <div class="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 mb-5">
            <div class="flex items-center justify-center gap-3">
              <lucide-angular name="headset" [size]="24" class="text-green-600 dark:text-green-400"></lucide-angular>
              <p class="text-green-700 dark:text-green-300 font-medium">
                Ya puedes ponerte en línea para gestionar
              </p>
            </div>
          </div>

          <button
            (click)="cerrar()"
            class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
            <lucide-angular name="log-in" [size]="18"></lucide-angular>
            Ir al Dialer
          </button>
        </div>
      </ng-container>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .countdown-number {
      font-size: 8rem;
      font-weight: 800;
      line-height: 1;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    @keyframes progress {
      0% { width: 0%; }
      100% { width: 100%; }
    }

    .animate-progress {
      animation: progress 4s ease-in-out infinite;
    }
  `]
})
export class RecordatoriosModalComponent implements OnInit, OnDestroy {
  modalState: ModalState = 'initial';
  countdownNumber = 3;
  autoSkipCountdown = 2;
  isLoading = false;
  recordatorioActual: RecordatorioPromesa | null = null;
  estadoDialer: { recordatoriosCompletados: number; totalRecordatorios: number } | null = null;

  // Para llamada en curso
  currentCallUuid: string | null = null;
  callDuration = '00:00';
  private callStartTime: Date | null = null;

  private countdownInterval: any = null;
  private autoSkipInterval: any = null;
  private callDurationInterval: any = null;

  constructor(
    public dialogRef: MatDialogRef<RecordatoriosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordatoriosModalData,
    private router: Router,
    private recordatoriosService: RecordatoriosService
  ) {}

  ngOnInit(): void {
    if (this.data.modoFinalizado) {
      this.modalState = 'finished';
    } else if (this.data.modoSiguiente && this.data.recordatorio) {
      this.recordatorioActual = this.data.recordatorio;
      this.iniciarCountdown();
    }
  }

  ngOnDestroy(): void {
    this.limpiarIntervals();
  }

  cerrar(): void {
    this.limpiarIntervals();
    this.dialogRef.close({ action: 'close' });
  }

  getEstadoPromesaClass(): string {
    if (!this.recordatorioActual) return '';

    switch (this.recordatorioActual.estadoPromesa) {
      case 'VENCIDA':
        return 'px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'PENDIENTE_HOY':
        return 'px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'AL_DIA':
        return 'px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700';
    }
  }

  getEstadoPromesaLabel(): string {
    if (!this.recordatorioActual) return '';

    switch (this.recordatorioActual.estadoPromesa) {
      case 'VENCIDA':
        const dias = this.recordatorioActual.diasVencida || 0;
        return `VENCIDA (${dias} día${dias !== 1 ? 's' : ''})`;
      case 'PENDIENTE_HOY':
        return 'VENCE HOY';
      case 'AL_DIA':
        return 'AL DÍA';
      default:
        return 'SIN FECHA';
    }
  }

  iniciarDiscado(): void {
    this.isLoading = true;

    // Usar idSubcartera si está disponible (directamente o del recordatorio)
    const idSubcartera = this.data.idSubcartera || this.data.recordatorio?.idSubcartera;

    this.recordatoriosService.iniciarDialer(this.data.idAgente, idSubcartera).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.estadoDialer = {
            recordatoriosCompletados: response.estado.recordatoriosCompletados,
            totalRecordatorios: response.estado.totalRecordatorios
          };
          // Obtener el primer recordatorio y mostrar countdown
          this.obtenerSiguienteYMostrar();
        } else {
          console.error('Error iniciando dialer:', response.mensaje);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error iniciando dialer:', err);
      }
    });
  }

  private obtenerSiguienteYMostrar(): void {
    this.recordatoriosService.obtenerSiguiente(this.data.idAgente).subscribe({
      next: (response) => {
        if (response.hayMas && response.recordatorio) {
          this.recordatorioActual = response.recordatorio;
          if (response.estado) {
            this.estadoDialer = {
              recordatoriosCompletados: response.estado.recordatoriosCompletados,
              totalRecordatorios: response.estado.totalRecordatorios
            };
          }
          this.iniciarCountdown();
        } else {
          this.modalState = 'finished';
        }
      },
      error: (err) => {
        console.error('Error obteniendo siguiente:', err);
        this.modalState = 'finished';
      }
    });
  }

  private iniciarCountdown(): void {
    this.modalState = 'countdown';
    this.countdownNumber = 3;

    this.countdownInterval = setInterval(() => {
      this.countdownNumber--;

      if (this.countdownNumber <= 0) {
        this.limpiarIntervals();
        this.iniciarLlamadaConAMD();
      }
    }, 1000);
  }

  private iniciarLlamadaConAMD(): void {
    this.modalState = 'analyzing';

    this.recordatoriosService.iniciarLlamadaConAMD(this.data.idAgente).subscribe({
      next: (resultado: ResultadoLlamadaAMD) => {
        if (resultado.esHumano) {
          // Humano detectado - mostrar "conectando" brevemente
          this.modalState = 'connecting';
          this.currentCallUuid = resultado.callUuid;

          // IMPORTANTE: Guardar datos del recordatorio en sessionStorage
          // para que la pantalla de tipificación los use
          if (this.recordatorioActual) {
            sessionStorage.setItem('recordatorioEnCurso', JSON.stringify({
              idCuota: this.recordatorioActual.idCuota,
              idAgente: this.data.idAgente,
              idCliente: this.recordatorioActual.idCliente,
              nombreCliente: this.recordatorioActual.nombreCliente,
              documentoCliente: this.recordatorioActual.documentoCliente,
              telefono: this.recordatorioActual.telefono,
              monto: this.recordatorioActual.monto,
              numeroCuota: this.recordatorioActual.numeroCuota,
              totalCuotas: this.recordatorioActual.totalCuotas,
              callUuid: resultado.callUuid,
              idSubcartera: this.recordatorioActual.idSubcartera
            }));
            console.log('📝 [RECORDATORIO] Datos guardados en sessionStorage para tipificación');
          }

          // Después de 1 segundo, pasar a estado "en llamada"
          setTimeout(() => {
            this.modalState = 'in_call';
            this.iniciarContadorLlamada();
          }, 1000);

        } else if (resultado.esBuzon || resultado.noContesto) {
          // Buzón o no contestó - mostrar y pasar al siguiente
          this.modalState = 'buzon';
          this.autoSkipCountdown = 2;

          // Actualizar estado del dialer
          if (resultado.estadoDialer) {
            this.estadoDialer = {
              recordatoriosCompletados: resultado.estadoDialer.recordatoriosCompletados,
              totalRecordatorios: resultado.estadoDialer.totalRecordatorios
            };
          }

          // Auto-skip al siguiente
          this.autoSkipInterval = setInterval(() => {
            this.autoSkipCountdown--;
            if (this.autoSkipCountdown <= 0) {
              this.limpiarIntervals();
              this.obtenerSiguienteYMostrar();
            }
          }, 1000);

        } else if (resultado.esError) {
          console.error('Error en llamada:', resultado.mensaje);
          // En caso de error, intentar siguiente
          this.obtenerSiguienteYMostrar();
        }
      },
      error: (err) => {
        console.error('Error en llamada con AMD:', err);
        this.modalState = 'finished';
      }
    });
  }

  private iniciarContadorLlamada(): void {
    this.callStartTime = new Date();
    this.callDuration = '00:00';

    this.callDurationInterval = setInterval(() => {
      if (this.callStartTime) {
        const diff = Math.floor((new Date().getTime() - this.callStartTime.getTime()) / 1000);
        const mins = Math.floor(diff / 60).toString().padStart(2, '0');
        const secs = (diff % 60).toString().padStart(2, '0');
        this.callDuration = `${mins}:${secs}`;
      }
    }, 1000);
  }

  completarYSiguiente(resultado: string): void {
    this.isLoading = true;
    this.limpiarIntervals();

    // Completar el recordatorio actual
    this.recordatoriosService.completarActual(
      this.data.idAgente,
      resultado,
      this.currentCallUuid || undefined
    ).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Actualizar estado
        if (response.estado) {
          this.estadoDialer = {
            recordatoriosCompletados: response.estado.recordatoriosCompletados,
            totalRecordatorios: response.estado.totalRecordatorios
          };
        }

        // Limpiar estado de llamada
        this.currentCallUuid = null;
        this.callDuration = '00:00';
        this.callStartTime = null;

        // Obtener siguiente si no ha terminado
        if (!response.terminado) {
          this.obtenerSiguienteYMostrar();
        } else {
          this.modalState = 'finished';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error completando recordatorio:', err);
        // Intentar continuar de todos modos
        this.obtenerSiguienteYMostrar();
      }
    });
  }

  terminarDiscado(): void {
    this.limpiarIntervals();
    this.recordatoriosService.detenerDialer(this.data.idAgente).subscribe({
      next: () => {
        this.dialogRef.close({ action: 'stopped' });
      },
      error: () => {
        this.dialogRef.close({ action: 'stopped' });
      }
    });
  }

  cancelarDiscado(): void {
    this.limpiarIntervals();
    this.recordatoriosService.detenerDialer(this.data.idAgente).subscribe({
      next: () => {
        this.dialogRef.close({ action: 'cancelled' });
      },
      error: () => {
        this.dialogRef.close({ action: 'cancelled' });
      }
    });
  }

  private limpiarIntervals(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.autoSkipInterval) {
      clearInterval(this.autoSkipInterval);
      this.autoSkipInterval = null;
    }
    if (this.callDurationInterval) {
      clearInterval(this.callDurationInterval);
      this.callDurationInterval = null;
    }
  }
}
