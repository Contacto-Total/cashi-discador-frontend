import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlacklistTableComponent } from "../../components/blacklist-table/blacklist-table.component";
import { AddToBlacklistFormComponent } from '../../components/add-to-blacklist-form/add-to-blacklist-form.component';
import { BlacklistMainService } from '../../services/blacklist-service/blacklist.service';
import { BlacklistResponse } from '../../model/response/blacklist.response';
import { ErrorModalService } from '../../../../../shared/services/error-modal.service';
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

  constructor(
    private blacklistService: BlacklistMainService,
    private errorModalService: ErrorModalService
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

        // Extraer mensaje de error
        let errorMessage = 'No se pudo cargar la lista de blacklist';
        let errorDetails = undefined;

        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        // Si hay detalles técnicos, agregarlos
        if (error?.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
          errorDetails = 'Verifica tu conexión a internet o contacta al administrador';
        } else if (error?.status) {
          errorDetails = `Código de error: ${error.status}`;
        }

        // Mostrar popup de error con fondo difuminado
        this.errorModalService.showError(
          errorMessage,
          'Error al cargar Blacklist',
          errorDetails
        );
      }
    });
  }
}
