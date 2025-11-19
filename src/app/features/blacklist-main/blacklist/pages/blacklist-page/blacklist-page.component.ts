import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlacklistTableComponent } from "../../components/blacklist-table/blacklist-table.component";
import { AddToBlacklistFormComponent } from '../../components/add-to-blacklist-form/add-to-blacklist-form.component';
import { BlacklistMainService } from '../../services/blacklist-service/blacklist.service';
import { BlacklistResponse } from '../../model/response/blacklist.response';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-blacklist-main-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AddToBlacklistFormComponent, BlacklistTableComponent],
  templateUrl: './blacklist-page.component.html',
  styleUrl: './blacklist-page.component.css'
})
export class BlacklistMainPageComponent implements OnInit {
  blacklistRows: BlacklistResponse[] = [];

  constructor(private blacklistService: BlacklistMainService) {}

  ngOnInit(): void {
    this.loadBlacklistRows();
  }

  loadBlacklistRows(): void {
    this.blacklistService.getAllBlacklist().subscribe(
      (data) => {
        this.blacklistRows = data;
      },
      (error) => {
        console.error('Error al obtener la lista de blacklists', error);
      }
    );
  }
}
