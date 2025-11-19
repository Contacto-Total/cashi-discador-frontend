import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-report',
  standalone: true,
  imports: [],
  templateUrl: './contact-report.component.html',
  styleUrl: './contact-report.component.scss'
})
export class ContactReportComponent {
  reportUrl: SafeResourceUrl;
  reportTitle = 'Reporte de Contacto';

  constructor(private sanitizer: DomSanitizer) {
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://docs.google.com/spreadsheets/d/14_qw5CebkN3Ar7fzF3k814dVyQ3KVwbQG1A9x_PrZpc/edit?rm=minimal'
    );
  }
}
