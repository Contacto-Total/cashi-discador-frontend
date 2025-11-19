import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BlacklistResponse } from '../../models/blacklist.response';

@Component({
  selector: 'app-blacklist-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './blacklist-table.component.html',
  styleUrls: ['./blacklist-table.component.scss']
})
export class BlacklistTableComponent {
  @Input() blacklistRows: BlacklistResponse[] = [];

  currentPage = 1;
  rowsPerPage = 10;

  get paginatedRows(): BlacklistResponse[] {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    return this.blacklistRows.slice(startIndex, startIndex + this.rowsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.blacklistRows.length / this.rowsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
