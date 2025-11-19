import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-speech-report',
  standalone: true,
  imports: [],
  templateUrl: './speech-report.component.html',
  styleUrl: './speech-report.component.scss'
})
export class SpeechReportComponent {
  reportUrl: SafeResourceUrl;
  reportTitle = 'Reporte de Speech';

  constructor(private sanitizer: DomSanitizer) {
    this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://docs.google.com/spreadsheets/d/1OG0MOPv-iKZyOl386-o0Bm4oS2O20qAByoBWI32iMaY/edit?rm=minimal'
    );
  }
}
