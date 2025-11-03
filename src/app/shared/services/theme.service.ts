import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject: BehaviorSubject<Theme>;
  public currentTheme$: Observable<Theme>;

  constructor() {
    // Check localStorage for saved theme, default to 'light'
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    this.currentThemeSubject = new BehaviorSubject<Theme>(savedTheme);
    this.currentTheme$ = this.currentThemeSubject.asObservable();

    // Apply theme on initialization
    this.applyTheme(savedTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentThemeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    // Remove existing theme class
    document.body.classList.remove('light-theme', 'dark-theme');
    // Add new theme class
    document.body.classList.add(`${theme}-theme`);
  }

  isDarkTheme(): boolean {
    return this.currentThemeSubject.value === 'dark';
  }

  isLightTheme(): boolean {
    return this.currentThemeSubject.value === 'light';
  }
}
