import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlacklistTableComponent } from '../../components/blacklist-table/blacklist-table.component';
import { AddBlacklistFormComponent } from '../../components/add-blacklist-form/add-blacklist-form.component';
import { BlacklistService } from '../../services/blacklist.service';
import { BlacklistResponse } from '../../models/blacklist.response';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-blacklist-page',
  standalone: true,
  imports: [CommonModule, AddBlacklistFormComponent, BlacklistTableComponent],
  templateUrl: './blacklist-page.component.html',
  styleUrls: ['./blacklist-page.component.scss']
})
export class BlacklistPageComponent implements OnInit {
  blacklistRows: BlacklistResponse[] = [];

  constructor(
    private blacklistService: BlacklistService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBlacklistRows();
  }

  loadBlacklistRows(): void {
    this.blacklistService.getAllBlacklist().subscribe({
      next: (data) => {
        this.blacklistRows = data;
      },
      error: (error) => {
        console.error('Error al obtener la lista de blacklists', error);
        this.toastService.error('Error al cargar la blacklist');
      }
    });
  }
}
