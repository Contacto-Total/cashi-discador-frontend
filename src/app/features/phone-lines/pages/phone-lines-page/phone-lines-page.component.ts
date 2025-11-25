import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PhoneLineService } from '../../services/phone-line.service';
import { PhoneLineResponse, PhoneLine } from '../../models/phone-line.response';

@Component({
  selector: 'app-phone-lines-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './phone-lines-page.component.html',
  styleUrl: './phone-lines-page.component.css'
})
export class PhoneLinesPageComponent {
  documentNumber: string = '';
  isLoading: boolean = false;
  response: PhoneLineResponse | null = null;
  error: string | null = null;

  constructor(private phoneLineService: PhoneLineService) {}

  search(): void {
    if (!this.documentNumber || this.documentNumber.length < 8) {
      this.error = 'Ingrese un documento válido (mínimo 8 dígitos)';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.response = null;

    this.phoneLineService.queryPhoneLines({ documentNumber: this.documentNumber }).subscribe({
      next: (response) => {
        this.response = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al consultar las líneas telefónicas';
        this.isLoading = false;
      }
    });
  }

  forceRefresh(): void {
    if (!this.documentNumber || this.documentNumber.length < 8) {
      this.error = 'Ingrese un documento válido (mínimo 8 dígitos)';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.response = null;

    this.phoneLineService.queryPhoneLinesForceRefresh({ documentNumber: this.documentNumber }).subscribe({
      next: (response) => {
        this.response = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al consultar las líneas telefónicas';
        this.isLoading = false;
      }
    });
  }

  clearResults(): void {
    this.documentNumber = '';
    this.response = null;
    this.error = null;
  }

  getCarrierColor(carrier: string): string {
    const lowerCarrier = carrier?.toLowerCase() || '';
    if (lowerCarrier.includes('claro')) return 'bg-red-100 text-red-700 border-red-300';
    if (lowerCarrier.includes('movistar')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (lowerCarrier.includes('entel')) return 'bg-orange-100 text-orange-700 border-orange-300';
    if (lowerCarrier.includes('bitel')) return 'bg-green-100 text-green-700 border-green-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  }

  getModalityIcon(modality: string): string {
    const lowerModality = modality?.toLowerCase() || '';
    if (lowerModality.includes('prepago')) return 'credit-card';
    if (lowerModality.includes('postpago')) return 'file-text';
    if (lowerModality.includes('control')) return 'sliders';
    return 'smartphone';
  }
}
