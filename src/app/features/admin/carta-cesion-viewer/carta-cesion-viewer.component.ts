import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule } from 'lucide-angular';
import { CartaCesionService, CartaCesionResponse } from '../../../core/services/carta-cesion.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-carta-cesion-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    LucideAngularModule
  ],
  templateUrl: './carta-cesion-viewer.component.html',
  styleUrls: ['./carta-cesion-viewer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CartaCesionViewerComponent implements OnInit {
  dni: string = '';
  loading: boolean = false;
  searching: boolean = false;
  cartaFound: boolean = false;
  errorMessage: string = '';

  cartaData: CartaCesionResponse | null = null;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private cartaCesionService: CartaCesionService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Initialization if needed
  }

  /**
   * Buscar carta por DNI
   */
  searchCarta(): void {
    // Validar DNI
    if (!this.dni || this.dni.trim().length !== 8) {
      this.errorMessage = 'Por favor ingrese un DNI válido de 8 dígitos';
      return;
    }

    if (!/^\d{8}$/.test(this.dni)) {
      this.errorMessage = 'El DNI debe contener solo números';
      return;
    }

    this.searching = true;
    this.loading = true;
    this.errorMessage = '';
    this.cartaFound = false;
    this.pdfUrl = null;

    this.cartaCesionService.searchByDni(this.dni).subscribe({
      next: (response) => {
        console.log('Carta encontrada:', response);
        this.cartaData = response;
        this.cartaFound = true;
        this.searching = false;

        // Cargar PDF
        this.loadPdf(response.filename);
      },
      error: (error) => {
        console.error('Error buscando carta:', error);
        this.searching = false;
        this.loading = false;

        if (error.status === 404) {
          this.errorMessage = `No se encontró carta de cesión para el DNI: ${this.dni}`;
        } else if (error.status === 400) {
          this.errorMessage = 'DNI inválido. Debe tener exactamente 8 dígitos';
        } else {
          this.errorMessage = 'Error al buscar la carta de cesión. Por favor intente nuevamente';
        }
      }
    });
  }

  /**
   * Cargar PDF para visualización (usando blob con autenticación)
   */
  loadPdf(filename: string): void {
    this.cartaCesionService.downloadPdf(filename).subscribe({
      next: (blob) => {
        // Crear URL temporal del blob para mostrarlo en el iframe
        const url = window.URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando PDF:', error);
        this.loading = false;
        this.errorMessage = 'Error al cargar el PDF para visualización';
      }
    });
  }

  /**
   * Descargar PDF
   */
  downloadPdf(): void {
    if (!this.cartaData) return;

    this.cartaCesionService.downloadPdf(this.cartaData.filename).subscribe({
      next: (blob) => {
        // Crear URL temporal del blob
        const url = window.URL.createObjectURL(blob);

        // Crear elemento <a> temporal para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = this.cartaData!.filename;
        document.body.appendChild(link);
        link.click();

        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('PDF descargado:', this.cartaData!.filename);
      },
      error: (error) => {
        console.error('Error descargando PDF:', error);
        this.errorMessage = 'Error al descargar el PDF. Por favor intente nuevamente';
      }
    });
  }

  /**
   * Limpiar búsqueda
   */
  clearSearch(): void {
    this.dni = '';
    this.cartaFound = false;
    this.cartaData = null;
    this.pdfUrl = null;
    this.errorMessage = '';
    this.searching = false;
    this.loading = false;
  }

  /**
   * Manejar Enter en el input
   */
  onEnter(): void {
    this.searchCarta();
  }
}
