import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMonitoreoDropdownOpen = false;
  isCargaDatosDropdownOpen = false;
  isMantenimientoDropdownOpen = false;
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleMonitoreoDropdown(): void {
    this.isMonitoreoDropdownOpen = !this.isMonitoreoDropdownOpen;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
  }

  toggleCargaDatosDropdown(): void {
    this.isCargaDatosDropdownOpen = !this.isCargaDatosDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
  }

  toggleMantenimientoDropdown(): void {
    this.isMantenimientoDropdownOpen = !this.isMantenimientoDropdownOpen;
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
  }

  closeDropdowns(): void {
    this.isMonitoreoDropdownOpen = false;
    this.isCargaDatosDropdownOpen = false;
    this.isMantenimientoDropdownOpen = false;
  }

  navigateTo(path: string): void {
    this.closeDropdowns();
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
