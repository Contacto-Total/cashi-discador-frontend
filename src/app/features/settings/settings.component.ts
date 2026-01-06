import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { FontSizeService } from '../../core/services/font-size.service';
import { ThemeService, Theme } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  // Font size
  currentFontSize: number = 16;
  minFontSize: number = 14;
  maxFontSize: number = 24;
  defaultFontSize: number = 16;

  // Theme
  currentTheme: Theme = 'dark';
  isDarkMode: boolean = true;

  // Preview text
  previewText: string = 'Este es un texto de ejemplo para visualizar el tamaño de la fuente seleccionada.';

  private subscriptions: Subscription[] = [];

  constructor(
    private fontSizeService: FontSizeService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Load font size settings
    this.minFontSize = this.fontSizeService.getMinSize();
    this.maxFontSize = this.fontSizeService.getMaxSize();
    this.defaultFontSize = this.fontSizeService.getDefaultSize();

    // Subscribe to font size changes
    this.subscriptions.push(
      this.fontSizeService.fontSize$.subscribe(size => {
        this.currentFontSize = size;
      })
    );

    // Subscribe to theme changes
    this.subscriptions.push(
      this.themeService.theme$.subscribe(theme => {
        this.currentTheme = theme;
        this.isDarkMode = theme === 'dark';
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Handle font size slider change
   */
  onFontSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const size = parseInt(target.value, 10);
    this.fontSizeService.setFontSize(size);
  }

  /**
   * Reset font size to default
   */
  resetFontSize(): void {
    this.fontSizeService.resetFontSize();
  }

  /**
   * Increase font size
   */
  increaseFontSize(): void {
    this.fontSizeService.increaseFontSize();
  }

  /**
   * Decrease font size
   */
  decreaseFontSize(): void {
    this.fontSizeService.decreaseFontSize();
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  /**
   * Check if font size is at default
   */
  isDefaultFontSize(): boolean {
    return this.currentFontSize === this.defaultFontSize;
  }

  /**
   * Get percentage for slider background
   */
  getSliderPercentage(): number {
    return ((this.currentFontSize - this.minFontSize) / (this.maxFontSize - this.minFontSize)) * 100;
  }
}
