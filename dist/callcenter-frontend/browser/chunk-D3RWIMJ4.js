import {
  Injectable,
  effect,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-CTRHJBBW.js";

// src/app/shared/services/theme.service.ts
var _ThemeService = class _ThemeService {
  constructor() {
    this.isDarkMode = signal(false, ...ngDevMode ? [{ debugName: "isDarkMode" }] : []);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === "dark");
    } else {
      this.isDarkMode.set(false);
      localStorage.setItem("theme", "light");
    }
    effect(() => {
      const isDark = this.isDarkMode();
      const theme = isDark ? "dark" : "light";
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
      }
      const metaTag = document.querySelector('meta[name="color-scheme"]');
      if (metaTag) {
        metaTag.setAttribute("content", theme);
      }
      localStorage.setItem("theme", theme);
    });
  }
  toggleTheme() {
    this.isDarkMode.update((current) => !current);
  }
  // Métodos de compatibilidad con código existente
  getCurrentTheme() {
    return this.isDarkMode() ? "dark" : "light";
  }
  setTheme(theme) {
    this.isDarkMode.set(theme === "dark");
  }
  isDarkTheme() {
    return this.isDarkMode();
  }
  isLightTheme() {
    return !this.isDarkMode();
  }
};
_ThemeService.\u0275fac = function ThemeService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ThemeService)();
};
_ThemeService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
var ThemeService = _ThemeService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  ThemeService
};
//# sourceMappingURL=chunk-D3RWIMJ4.js.map
