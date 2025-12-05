import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { RecordatoriosService } from '../../../core/services/recordatorios.service';
import { RecordatorioPromesa } from '../../../core/models/recordatorio.model';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

export interface RecordatoriosModalData {
  cantidad: number;
  pendientes: number;
  idAgente: number;
  modoSiguiente?: boolean;
  modoFinalizado?: boolean;
  recordatorio?: any;
}

type ModalState = 'initial' | 'countdown' | 'calling' | 'finished';

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
    <div class="p-6 max-w-md min-w-[380px]">

      <!-- ========== ESTADO INICIAL ========== -->
      <ng-container *ngIf="modalState === 'initial'">
        <!-- Header con icono -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <lucide-angular name="bell-ring" [size]="24" class="text-white"></lucide-angular>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-800 dark:text-white">Recordatorios del día</h2>
            <p class="text-sm text-slate-500 dark:text-gray-400">Promesas de pago que vencen hoy</p>
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
          Inicia el marcado automático para recordar a tus clientes sobre sus compromisos de pago.
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

      <!-- ========== ESTADO CUENTA REGRESIVA ========== -->
      <ng-container *ngIf="modalState === 'countdown'">
        <div class="text-center py-8">
          <p class="text-lg text-slate-600 dark:text-gray-400 mb-6">Iniciando en...</p>

          <div class="relative h-40 flex items-center justify-center">
            <div *ngIf="countdownNumber > 0"
                 [@countdownNumber]
                 class="countdown-number"
                 [class.text-red-500]="countdownNumber <= 2"
                 [class.text-orange-500]="countdownNumber === 3"
                 [class.text-yellow-500]="countdownNumber === 4"
                 [class.text-green-500]="countdownNumber === 5">
              {{ countdownNumber }}
            </div>
          </div>

          <p class="text-sm text-slate-500 dark:text-gray-500 mt-4">
            Preparando la llamada al cliente...
          </p>

          <button
            (click)="cancelarDiscado()"
            class="mt-6 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300 underline">
            Cancelar
          </button>
        </div>
      </ng-container>

      <!-- ========== ESTADO LLAMANDO ========== -->
      <ng-container *ngIf="modalState === 'calling'">
        <div class="text-center py-4" [@fadeSlide]>
          <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <lucide-angular name="phone-outgoing" [size]="32" class="text-white"></lucide-angular>
          </div>

          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">Llamando...</h2>

          <div *ngIf="recordatorioActual" class="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mt-4 text-left">
            <p class="text-sm text-slate-500 dark:text-gray-400">Cliente</p>
            <p class="text-lg font-semibold text-slate-800 dark:text-white">{{ recordatorioActual.nombreCliente }}</p>

            <div class="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p class="text-xs text-slate-400 dark:text-gray-500">Teléfono</p>
                <p class="text-sm font-medium text-slate-700 dark:text-gray-300">{{ recordatorioActual.telefono }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 dark:text-gray-500">Monto</p>
                <p class="text-sm font-medium text-green-600 dark:text-green-400">S/ {{ recordatorioActual.monto | number:'1.2-2' }}</p>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-400 dark:text-gray-500">Cuota {{ recordatorioActual.numeroCuota }} de {{ recordatorioActual.totalCuotas }}</p>
            </div>
          </div>

          <div class="mt-4 text-sm text-slate-500 dark:text-gray-400">
            Recordatorio {{ estadoDialer?.recordatoriosCompletados || 0 }} de {{ estadoDialer?.totalRecordatorios || 0 }}
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

    @keyframes pulseRing {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }
  `]
})
export class RecordatoriosModalComponent implements OnInit, OnDestroy {
  modalState: ModalState = 'initial';
  countdownNumber = 5;
  isLoading = false;
  recordatorioActual: RecordatorioPromesa | null = null;
  estadoDialer: { recordatoriosCompletados: number; totalRecordatorios: number } | null = null;

  private countdownInterval: any = null;

  constructor(
    public dialogRef: MatDialogRef<RecordatoriosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordatoriosModalData,
    private router: Router,
    private recordatoriosService: RecordatoriosService
  ) {}

  ngOnInit(): void {
    // Manejar diferentes modos del modal
    if (this.data.modoFinalizado) {
      // Modo finalizado: mostrar directamente el estado de terminado
      this.modalState = 'finished';
    } else if (this.data.modoSiguiente && this.data.recordatorio) {
      // Modo siguiente: iniciar countdown directamente con el recordatorio pasado
      this.recordatorioActual = this.data.recordatorio;
      this.iniciarCountdown();
    }
    // Si no hay modo especial, se queda en 'initial' (flujo normal)
  }

  ngOnDestroy(): void {
    this.limpiarInterval();
  }

  cerrar(): void {
    this.limpiarInterval();
    this.dialogRef.close({ action: 'close' });
  }

  iniciarDiscado(): void {
    this.isLoading = true;

    this.recordatoriosService.iniciarDialer(this.data.idAgente).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.estadoDialer = {
            recordatoriosCompletados: response.estado.recordatoriosCompletados,
            totalRecordatorios: response.estado.totalRecordatorios
          };
          this.iniciarCountdown();
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

  private iniciarCountdown(): void {
    this.modalState = 'countdown';
    this.countdownNumber = 5;

    this.countdownInterval = setInterval(() => {
      this.countdownNumber--;

      if (this.countdownNumber <= 0) {
        this.limpiarInterval();
        this.obtenerSiguienteYLlamar();
      }
    }, 1000);
  }

  private obtenerSiguienteYLlamar(): void {
    // Si estamos en modoSiguiente, ya tenemos el recordatorio - solo mostrar la llamada
    if (this.data.modoSiguiente && this.recordatorioActual) {
      this.modalState = 'calling';

      // Cerrar el modal y emitir evento para iniciar la llamada
      setTimeout(() => {
        this.dialogRef.close({
          action: 'call',
          recordatorio: this.recordatorioActual,
          estado: this.estadoDialer
        });
      }, 1500);
      return;
    }

    // Flujo normal: obtener siguiente del backend
    this.recordatoriosService.obtenerSiguiente(this.data.idAgente).subscribe({
      next: (response) => {
        if (response.hayMas && response.recordatorio) {
          this.recordatorioActual = response.recordatorio;
          this.estadoDialer = response.estado ? {
            recordatoriosCompletados: response.estado.recordatoriosCompletados,
            totalRecordatorios: response.estado.totalRecordatorios
          } : null;
          this.modalState = 'calling';

          // Cerrar el modal y emitir evento para iniciar la llamada
          setTimeout(() => {
            this.dialogRef.close({
              action: 'call',
              recordatorio: this.recordatorioActual,
              estado: this.estadoDialer
            });
          }, 1500);
        } else {
          // No hay más recordatorios
          this.modalState = 'finished';
        }
      },
      error: (err) => {
        console.error('Error obteniendo siguiente:', err);
        this.modalState = 'finished';
      }
    });
  }

  cancelarDiscado(): void {
    this.limpiarInterval();
    this.recordatoriosService.detenerDialer(this.data.idAgente).subscribe({
      next: () => {
        this.dialogRef.close({ action: 'cancelled' });
      },
      error: () => {
        this.dialogRef.close({ action: 'cancelled' });
      }
    });
  }

  private limpiarInterval(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}
