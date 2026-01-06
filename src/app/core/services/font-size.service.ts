import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FontSizeService {
  private readonly FONT_SIZE_KEY = 'app-font-size';
  private readonly DEFAULT_SIZE = 16;
  private readonly MIN_SIZE = 14;
  private readonly MAX_SIZE = 24;

  private fontSizeSubject: BehaviorSubject<number>;
  public fontSize$: Observable<number>;

  constructor() {
    // Load font size from localStorage or default to 16
    const savedSize = this.getSavedFontSize();
    this.fontSizeSubject = new BehaviorSubject<number>(savedSize);
    this.fontSize$ = this.fontSizeSubject.asObservable();

    // Apply initial font size
    this.applyFontSize(savedSize);
  }

  /**
   * Get saved font size from localStorage
   */
  private getSavedFontSize(): number {
    const saved = localStorage.getItem(this.FONT_SIZE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= this.MIN_SIZE && parsed <= this.MAX_SIZE) {
        return parsed;
      }
    }
    return this.DEFAULT_SIZE;
  }

  /**
   * Get current font size
   */
  getCurrentFontSize(): number {
    return this.fontSizeSubject.value;
  }

  /**
   * Get minimum font size
   */
  getMinSize(): number {
    return this.MIN_SIZE;
  }

  /**
   * Get maximum font size
   */
  getMaxSize(): number {
    return this.MAX_SIZE;
  }

  /**
   * Get default font size
   */
  getDefaultSize(): number {
    return this.DEFAULT_SIZE;
  }

  /**
   * Set font size
   */
  setFontSize(size: number): void {
    // Clamp value between min and max
    const clampedSize = Math.min(Math.max(size, this.MIN_SIZE), this.MAX_SIZE);

    this.fontSizeSubject.next(clampedSize);
    this.applyFontSize(clampedSize);
    localStorage.setItem(this.FONT_SIZE_KEY, clampedSize.toString());
  }

  /**
   * Reset to default font size
   */
  resetFontSize(): void {
    this.setFontSize(this.DEFAULT_SIZE);
  }

  /**
   * Increase font size by 1px
   */
  increaseFontSize(): void {
    const current = this.fontSizeSubject.value;
    if (current < this.MAX_SIZE) {
      this.setFontSize(current + 1);
    }
  }

  /**
   * Decrease font size by 1px
   */
  decreaseFontSize(): void {
    const current = this.fontSizeSubject.value;
    if (current > this.MIN_SIZE) {
      this.setFontSize(current - 1);
    }
  }

  /**
   * Apply font size to document
   */
  private applyFontSize(size: number): void {
    const html = document.documentElement;
    html.style.fontSize = `${size}px`;

    // Also set a CSS custom property for components that might need it
    html.style.setProperty('--app-font-size', `${size}px`);
  }
}
