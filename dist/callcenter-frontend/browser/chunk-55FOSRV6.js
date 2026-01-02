import {
  Router
} from "./chunk-OCZLH7K5.js";
import {
  environment
} from "./chunk-QF774CZR.js";
import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  setClassMetadata,
  tap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/core/services/auth.service.ts
var _AuthService = class _AuthService {
  constructor(http, router) {
    this.http = http;
    this.router = router;
    this.TOKEN_KEY = "callcenter_token";
    this.USER_KEY = "callcenter_user";
    let user = null;
    try {
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Error parsing stored user", e);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject = new BehaviorSubject(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }
  login(username, password) {
    const request = {
      nombreUsuario: username,
      contrasena: password
    };
    return this.http.post(`${environment.apiUrl}/auth/login`, request).pipe(tap((response) => {
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      localStorage.setItem("refresh_token", response.refreshToken);
      const nameParts = response.nombreCompleto?.split(" ") || ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const user = {
        id: response.idUsuario,
        username: response.nombreUsuario,
        email: response.email,
        firstName,
        lastName,
        role: response.roles?.[0] || "AGENT",
        sipExtension: response.extensionSip,
        active: true,
        tenantId: response.tenantId,
        portfolioId: response.portfolioId,
        subPortfolioId: response.subPortfolioId
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    }));
  }
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem("refresh_token");
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }
  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1e3;
      return Date.now() < expiry;
    } catch (e) {
      return false;
    }
  }
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  getCurrentUserId() {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }
  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }
  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    return this.http.post(`${environment.apiUrl}/auth/refresh-token`, {
      refreshToken
    }).pipe(tap((response) => {
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refresh_token", response.refreshToken);
      }
    }));
  }
  isTokenExpiringSoon() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1e3;
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1e3;
      return expiry - now < fiveMinutes && expiry > now;
    } catch (e) {
      return false;
    }
  }
};
_AuthService.\u0275fac = function AuthService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(Router));
};
_AuthService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
var AuthService = _AuthService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }, { type: Router }], null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-55FOSRV6.js.map
