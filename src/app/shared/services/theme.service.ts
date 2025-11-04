import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal para el estado del modo oscuro (compatible con web-app-cashi)
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Cargar preferencia guardada del localStorage
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Por defecto SIEMPRE modo claro, ignorar preferencia del sistema
      this.isDarkMode.set(false);
      localStorage.setItem('theme', 'light');
    }

    // Effect para aplicar tema cuando cambie el signal
    effect(() => {
      const isDark = this.isDarkMode(); // Leer el signal para que el effect lo rastree
      const theme = isDark ? 'dark' : 'light';

      // IMPORTANTE: Aplicar clase 'dark' a document.documentElement (HTML tag)
      // Esto es compatible con el CSS de web-app-cashi que usa :root.dark
      if (isDark) {
        document.documentElement.classList.add('dark');
        // Mantener compatibilidad con código legacy que usa body
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark');
        // Mantener compatibilidad con código legacy que usa body
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }

      // Actualizar meta tag color-scheme
      const metaTag = document.querySelector('meta[name="color-scheme"]');
      if (metaTag) {
        metaTag.setAttribute('content', theme);
      }

      // Guardar en localStorage
      localStorage.setItem('theme', theme);
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }

  // Métodos de compatibilidad con código existente
  getCurrentTheme(): Theme {
    return this.isDarkMode() ? 'dark' : 'light';
  }

  setTheme(theme: Theme): void {
    this.isDarkMode.set(theme === 'dark');
  }

  isDarkTheme(): boolean {
    return this.isDarkMode();
  }

  isLightTheme(): boolean {
    return !this.isDarkMode();
  }
}
