import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorModalComponent, ErrorModalData } from '../components/error-modal/error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {
  constructor(private dialog: MatDialog) {}

  /**
   * Muestra un modal de error con fondo difuminado
   * @param message Mensaje principal del error
   * @param title Título del modal (opcional, por defecto "Error")
   * @param details Detalles técnicos del error (opcional)
   */
  showError(message: string, title?: string, details?: string): void {
    const config: MatDialogConfig<ErrorModalData> = {
      data: {
        title: title || 'Error',
        message,
        details
      },
      panelClass: 'error-modal-panel',
      backdropClass: 'error-modal-backdrop',
      disableClose: false,
      hasBackdrop: true,
      width: '500px',
      maxWidth: '90vw'
    };

    this.dialog.open(ErrorModalComponent, config);
  }

  /**
   * Muestra un error de conexión estándar
   */
  showConnectionError(): void {
    this.showError(
      'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.',
      'Error de Conexión'
    );
  }

  /**
   * Muestra un error de validación
   */
  showValidationError(message: string): void {
    this.showError(message, 'Error de Validación');
  }

  /**
   * Muestra un error genérico del servidor
   */
  showServerError(details?: string): void {
    this.showError(
      'Ocurrió un error en el servidor. Por favor, intenta nuevamente más tarde.',
      'Error del Servidor',
      details
    );
  }
}
