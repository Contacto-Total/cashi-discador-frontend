import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-powerbi-report',
  standalone: true,
  imports: [],
  templateUrl: './powerbi-report.component.html',
  styleUrl: './powerbi-report.component.scss'
})
export class PowerbiReportComponent {
  reportUrl: SafeResourceUrl;
  reportTitle = 'Reporte PowerBI';

  constructor(private sanitizer: DomSanitizer) {
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiMDFmZTFmMTctYmEwYi00NGY2LTk1YjItYTc5MWU0M2U4NWI4IiwidCI6IjVmZjNlMmE4LTJkYWUtNGY2MC04ZWE4LWFjZjE5NTQ0MzMyNSIsImMiOjR9'
    );
  }
}
