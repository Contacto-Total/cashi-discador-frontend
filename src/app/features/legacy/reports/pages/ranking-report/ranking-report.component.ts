import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ranking-report',
  standalone: true,
  imports: [],
  templateUrl: './ranking-report.component.html',
  styleUrl: './ranking-report.component.scss'
})
export class RankingReportComponent {
  reportUrl: SafeResourceUrl;
  reportTitle = 'Reporte de Ranking';

  constructor(private sanitizer: DomSanitizer) {
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://docs.google.com/spreadsheets/d/1Cmss5qJ8pemNHAcndN0B__AmyABWOqv1rYCHoQlmzuQ/edit?rm=minimal'
    );
  }
}
