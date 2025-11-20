import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomSelectComponent } from '../../../../../shared/components/custom-ui/custom-select/custom-select.component';
import { CustomInputNumberComponent } from '../../../../../shared/components/custom-ui/custom-input-number/custom-input-number.component';
import { CustomCheckboxComponent } from '../../../../../shared/components/custom-ui/custom-checkbox/custom-checkbox.component';
import { CustomTabsComponent } from '../../../../../shared/components/custom-ui/custom-tabs/custom-tabs.component';
import { CustomMultiSelectComponent } from '../../../../../shared/components/custom-ui/custom-multiselect/custom-multiselect.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ThemeService } from '../../../../../shared/services/theme.service';
import { CampaignService } from '../../services/campaign.service';
import { CampaignReportRequest } from '../../models/campaign-report.request';
import { Range } from '../../models/range.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomSelectComponent,
    CustomInputNumberComponent,
    CustomCheckboxComponent,
    CustomTabsComponent,
    CustomMultiSelectComponent,
    LucideAngularModule
  ],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeSliderComponent implements OnInit {
  campaignName: string = 'Tramo 3';
  tramoOptions = [
    { label: 'Tramo 3', value: 'Tramo 3' },
    { label: 'Tramo 5', value: 'Tramo 5' },
    { label: 'Contacto Total', value: 'CONTACTO_TOTAL' }
  ];

  filterType: string = 'saldoCapital';
  filterTypeOptions = [
    { label: 'Saldo Capital', value: 'saldoCapital' },
    { label: 'Baja 30', value: 'baja30' }
  ];

  dueDatesSelected: string[] = [];
  dueDatesOptions: any[] = [];

  contactoDirectoRanges: Range[] = [];
  contactoIndirectoRanges: Range[] = [];
  promesasRotasRanges: Range[] = [];
  noContactadoRanges: Range[] = [];

  contenido: boolean = true;
  excluirPagadasHoy: boolean = false;

  activeIndex: number = 3;

  tabs = [
    { title: 'Contacto Directo' },
    { title: 'Contacto Indirecto' },
    { title: 'Promesas Rotas' },
    { title: 'No Contactado' }
  ];

  // Separate error tracking for min and max inputs
  contactoDirectoMinErrors: boolean[] = [];
  contactoDirectoMaxErrors: boolean[] = [];
  contactoIndirectoMinErrors: boolean[] = [];
  contactoIndirectoMaxErrors: boolean[] = [];
  promesasRotasMinErrors: boolean[] = [];
  promesasRotasMaxErrors: boolean[] = [];
  noContactadoMinErrors: boolean[] = [];
  noContactadoMaxErrors: boolean[] = [];

  private lastEditedRangeIndex: number = -1;
  private lastEditedField: 'min' | 'max' = 'min';
  private isGenerating: boolean = false;

  private themeService = inject(ThemeService);
  isDarkMode = this.themeService.isDarkMode;

  constructor(
    private campaignService: CampaignService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load due dates
    this.campaignService.getDueDates().subscribe({
      next: (dates: string[]) => {
        this.dueDatesOptions = dates.map(date => ({ label: date, value: date }));
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener fechas:', err);
        this.toastService.error('Error al cargar fechas de vencimiento');
        this.cdr.markForCheck();
      }
    });

    // Initialize ranges with default values
    const initialRangesCd = [{ min: 0, max: 8000, isChecked: true }];
    const initialRangesCi = [{ min: 0, max: 8000, isChecked: true }];
    const initialRangesPr = [{ min: 0, max: 8000, isChecked: true }];
    const initialRangesNc = [
      { min: 1000, max: 2000, isChecked: false },
      { min: 2000, max: 3000, isChecked: false },
      { min: 3000, max: 4000, isChecked: false },
      { min: 4000, max: 5000, isChecked: true }
    ];

    this.campaignName = 'Tramo 3';
    this.contenido = true;
    this.contactoDirectoRanges = initialRangesCd.map(range => ({ ...range }));
    this.contactoIndirectoRanges = initialRangesCi.map(range => ({ ...range }));
    this.promesasRotasRanges = initialRangesPr.map(range => ({ ...range }));
    this.noContactadoRanges = initialRangesNc.map(range => ({ ...range }));

    this.updateErrorArrays();
    this.cdr.markForCheck();
  }

  private updateErrorArrays() {
    this.contactoDirectoMinErrors = new Array(this.contactoDirectoRanges.length).fill(false);
    this.contactoDirectoMaxErrors = new Array(this.contactoDirectoRanges.length).fill(false);
    this.contactoIndirectoMinErrors = new Array(this.contactoIndirectoRanges.length).fill(false);
    this.contactoIndirectoMaxErrors = new Array(this.contactoIndirectoRanges.length).fill(false);
    this.promesasRotasMinErrors = new Array(this.promesasRotasRanges.length).fill(false);
    this.promesasRotasMaxErrors = new Array(this.promesasRotasRanges.length).fill(false);
    this.noContactadoMinErrors = new Array(this.noContactadoRanges.length).fill(false);
    this.noContactadoMaxErrors = new Array(this.noContactadoRanges.length).fill(false);
  }

  private getActiveRanges(): Range[] {
    switch (this.activeIndex) {
      case 0: return this.contactoDirectoRanges;
      case 1: return this.contactoIndirectoRanges;
      case 2: return this.promesasRotasRanges;
      case 3: return this.noContactadoRanges;
      default: return [];
    }
  }

  private getActiveMinErrors(): boolean[] {
    switch (this.activeIndex) {
      case 0: return this.contactoDirectoMinErrors;
      case 1: return this.contactoIndirectoMinErrors;
      case 2: return this.promesasRotasMinErrors;
      case 3: return this.noContactadoMinErrors;
      default: return [];
    }
  }

  private getActiveMaxErrors(): boolean[] {
    switch (this.activeIndex) {
      case 0: return this.contactoDirectoMaxErrors;
      case 1: return this.contactoIndirectoMaxErrors;
      case 2: return this.promesasRotasMaxErrors;
      case 3: return this.noContactadoMaxErrors;
      default: return [];
    }
  }

  onTabChange(index: number) {
    this.activeIndex = index;
    this.cdr.markForCheck();
  }

  addRange() {
    const ranges = this.getActiveRanges();
    if (ranges.length > 0) {
      const lastRange = ranges[ranges.length - 1];
      // Convert infinite range to normal
      if (lastRange.isChecked) {
        lastRange.isChecked = false;
        lastRange.max = lastRange.min + 1000;
      }
      const newRange: Range = {
        min: lastRange.max,
        max: lastRange.max + 1000,
        isChecked: true
      };
      ranges.push(newRange);
    } else {
      const newRange: Range = { min: 0, max: 1000, isChecked: false };
      ranges.push(newRange);
    }

    // Sort ranges by min
    ranges.sort((a, b) => a.min - b.min);
    this.updateErrorArrays();
    this.clearAllErrors();
    this.cdr.markForCheck();
  }

  toggleCheck(index: number) {
    const ranges = this.getActiveRanges();
    ranges.forEach((range, i) => {
      if (i !== index) {
        range.isChecked = false;
      }
    });

    this.lastEditedRangeIndex = index;
    this.validateSpecificRange(index, 'min');
    this.cdr.markForCheck();
  }

  isAnyChecked(): boolean {
    const ranges = this.getActiveRanges();
    return ranges.some(range => range.isChecked);
  }

  deleteRange(index: number) {
    const ranges = this.getActiveRanges();
    ranges.splice(index, 1);
    this.updateErrorArrays();
    this.clearAllErrors();
    this.cdr.markForCheck();
  }

  private clearAllErrors() {
    const minErrors = this.getActiveMinErrors();
    const maxErrors = this.getActiveMaxErrors();
    minErrors.fill(false);
    maxErrors.fill(false);
    this.lastEditedRangeIndex = -1;
  }

  private validateSpecificRange(editedIndex: number, field: 'min' | 'max') {
    const ranges = this.getActiveRanges();
    const minErrors = this.getActiveMinErrors();
    const maxErrors = this.getActiveMaxErrors();
    const editedRange = ranges[editedIndex];

    // Clear errors for the edited range
    minErrors[editedIndex] = false;
    maxErrors[editedIndex] = false;

    // Check if min >= max in the edited range (if not infinite)
    if (!editedRange.isChecked && editedRange.min >= editedRange.max) {
      if (field === 'min') {
        minErrors[editedIndex] = true;
      } else {
        maxErrors[editedIndex] = true;
      }
      return;
    }

    // Check for overlap with other ranges
    let hasOverlap = false;
    for (let i = 0; i < ranges.length; i++) {
      if (i === editedIndex) continue;

      const otherRange = ranges[i];
      let overlaps = false;

      if (!editedRange.isChecked && !otherRange.isChecked) {
        overlaps = (editedRange.min < otherRange.max && editedRange.max > otherRange.min);
      } else if (editedRange.isChecked && !otherRange.isChecked) {
        overlaps = (otherRange.max > editedRange.min);
      } else if (!editedRange.isChecked && otherRange.isChecked) {
        overlaps = (editedRange.max > otherRange.min);
      } else if (editedRange.isChecked && otherRange.isChecked) {
        overlaps = true;
      }

      if (overlaps) {
        hasOverlap = true;
        break;
      }
    }

    if (hasOverlap) {
      if (field === 'min') {
        minErrors[editedIndex] = true;
      } else {
        maxErrors[editedIndex] = true;
      }
    }
  }

  onMinInputChange(index: number) {
    this.lastEditedRangeIndex = index;
    this.lastEditedField = 'min';
    setTimeout(() => {
      this.validateSpecificRange(index, 'min');
      this.cdr.markForCheck();
    }, 0);
  }

  onMaxInputChange(index: number) {
    this.lastEditedRangeIndex = index;
    this.lastEditedField = 'max';
    setTimeout(() => {
      this.validateSpecificRange(index, 'max');
      this.cdr.markForCheck();
    }, 0);
  }

  validateRanges(): boolean {
    let isValid = true;

    const sections = [
      {
        ranges: this.contactoDirectoRanges,
        minErrors: this.contactoDirectoMinErrors,
        maxErrors: this.contactoDirectoMaxErrors
      },
      {
        ranges: this.contactoIndirectoRanges,
        minErrors: this.contactoIndirectoMinErrors,
        maxErrors: this.contactoIndirectoMaxErrors
      },
      {
        ranges: this.promesasRotasRanges,
        minErrors: this.promesasRotasMinErrors,
        maxErrors: this.promesasRotasMaxErrors
      },
      {
        ranges: this.noContactadoRanges,
        minErrors: this.noContactadoMinErrors,
        maxErrors: this.noContactadoMaxErrors
      },
    ];

    for (const section of sections) {
      const { ranges, minErrors, maxErrors } = section;
      minErrors.fill(false);
      maxErrors.fill(false);

      for (let i = 0; i < ranges.length; i++) {
        const current = ranges[i];

        if (!current.isChecked && current.min >= current.max) {
          minErrors[i] = true;
          maxErrors[i] = true;
          isValid = false;
          continue;
        }

        for (let j = i + 1; j < ranges.length; j++) {
          const other = ranges[j];
          let hasOverlap = false;

          if (!current.isChecked && !other.isChecked) {
            hasOverlap = (current.min < other.max && current.max > other.min);
          } else if (current.isChecked && !other.isChecked) {
            hasOverlap = (other.min < current.min);
          } else if (!current.isChecked && other.isChecked) {
            hasOverlap = (current.max > other.min);
          } else if (current.isChecked && other.isChecked) {
            hasOverlap = true;
          }

          if (hasOverlap) {
            minErrors[i] = true;
            maxErrors[i] = true;
            minErrors[j] = true;
            maxErrors[j] = true;
            isValid = false;
          }
        }
      }
    }

    if (!isValid) {
      this.toastService.error('Por favor, corrige los rangos marcados en rojo antes de continuar');
      this.cdr.markForCheck();
    }

    return isValid;
  }

  onTramoChange() {
    if (this.campaignName === 'Tramo 5' || this.campaignName === 'CONTACTO_TOTAL') {
      this.dueDatesSelected = [];
      this.contenido = false;
      this.filterType = 'saldoCapital';
    } else {
      this.contenido = true;
    }
    this.cdr.markForCheck();
  }

  isDatesDisabled(): boolean {
    return this.campaignName === 'Tramo 5' || this.campaignName === 'CONTACTO_TOTAL';
  }

  getSelectedDatesLabel(): string {
    const count = this.dueDatesSelected.length;
    if (count === 0) {
      return 'Fechas de vencimiento';
    }
    return count === 1 ? '1 fecha seleccionada' : `${count} fechas seleccionadas`;
  }

  printRanges() {
    console.log('🚀 printRanges() llamado');

    if (this.isGenerating) {
      console.log('⏸️ Ya se está generando, saliendo...');
      return;
    }

    console.log('✅ Validando rangos...');
    if (!this.validateRanges()) {
      console.log('❌ Validación falló');
      return;
    }

    console.log('✅ Validación exitosa, iniciando generación...');
    this.isGenerating = true;

    const contactoDirectoRangesToConsult = this.contactoDirectoRanges.map(range => ({
      min: range.min.toString(),
      max: range.isChecked ? '+' : range.max.toString()
    }));

    const contactoIndirectoRangesToConsult = this.contactoIndirectoRanges.map(range => ({
      min: range.min.toString(),
      max: range.isChecked ? '+' : range.max.toString()
    }));

    const promesasRotasRangesToConsult = this.promesasRotasRanges.map(range => ({
      min: range.min.toString(),
      max: range.isChecked ? '+' : range.max.toString()
    }));

    const noContactadoRangesToConsult = this.noContactadoRanges.map(range => ({
      min: range.min.toString(),
      max: range.isChecked ? '+' : range.max.toString()
    }));

    const request: CampaignReportRequest = {
      campaignName: this.campaignName,
      filterType: this.filterType,
      dueDates: this.dueDatesSelected,
      directContactRanges: contactoDirectoRangesToConsult,
      indirectContactRanges: contactoIndirectoRangesToConsult,
      brokenPromisesRanges: promesasRotasRangesToConsult,
      notContactedRanges: noContactadoRangesToConsult,
      content: !this.contenido,
      excluirPagadasHoy: this.excluirPagadasHoy
    };

    this.toastService.info('Procesando... Insertando rangos, consultando y generando reporte');

    this.campaignService.getFileToCampaña(request).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output-files.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.toastService.success('Los rangos han sido procesados correctamente');
        this.isGenerating = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('Un error ha ocurrido al procesar los rangos');
        this.isGenerating = false;
        this.cdr.markForCheck();
      }
    });
  }
}
