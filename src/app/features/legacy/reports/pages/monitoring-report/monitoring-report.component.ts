import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-monitoring-report',
  standalone: true,
  imports: [],
  templateUrl: './monitoring-report.component.html',
  styleUrl: './monitoring-report.component.scss'
})
export class MonitoringReportComponent {
  reportUrl: SafeResourceUrl;
  reportTitle = 'Reporte de Monitoreo';

  constructor(private sanitizer: DomSanitizer) {
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://docs.google.com/spreadsheets/d/1mI3_V_2dtofFXubwvorDVK8nc5oS6Z0kxuEs8jq7m4Q/edit?rm=minimal'
    );
  }
}
