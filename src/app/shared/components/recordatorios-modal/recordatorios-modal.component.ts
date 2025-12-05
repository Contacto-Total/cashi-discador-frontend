import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';

export interface RecordatoriosModalData {
  cantidad: number;
  pendientes: number;
}

@Component({
  selector: 'app-recordatorios-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-6 max-w-md">
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
        Recuerda llamar a tus clientes para recordarles su compromiso de pago.
      </p>

      <!-- Botones -->
      <div class="flex gap-3">
        <button
          (click)="cerrar()"
          class="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-all duration-200">
          Más tarde
        </button>
        <button
          (click)="irARecordatorios()"
          class="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
          <lucide-angular name="arrow-right" [size]="16"></lucide-angular>
          Ver lista
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RecordatoriosModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RecordatoriosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordatoriosModalData,
    private router: Router
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  irARecordatorios(): void {
    this.dialogRef.close();
    this.router.navigate(['/recordatorios']);
  }
}
