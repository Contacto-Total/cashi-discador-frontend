import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cartera-propia-report',
  standalone: true,
  imports: [],
  templateUrl: './cartera-propia-report.component.html',
  styleUrl: './cartera-propia-report.component.scss'
})
export class CarteraPropiaReportComponent {
  reportUrl: SafeResourceUrl;
  reportTitle = 'Reporte PowerBI Cartera Propia';

  constructor(private sanitizer: DomSanitizer) {
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiN2I3M2M5NjktYzZlNy00YzRiLWE3OWMtYTAxOTViYzk4OGYwIiwidCI6IjVmZjNlMmE4LTJkYWUtNGY2MC04ZWE4LWFjZjE5NTQ0MzMyNSIsImMiOjR9'
    );
  }
}
