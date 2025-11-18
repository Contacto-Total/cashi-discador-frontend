export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  sipExtension: string;
  active: boolean;
  tenantId?: number;
  portfolioId?: number;
  subPortfolioId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  AGENT = 'AGENT'
}

export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}

export interface LoginResponse {
  // Campos del auth-backend (en español)
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  nombreCompleto: string;
  extensionSip: string;
  accessToken: string;
  refreshToken: string;
  tipoToken: string;
  expiresIn: number;
  roles: string[];
  permisos: string[];
  mensaje: string;
  // Asignación del rol
  tenantId?: number;
  portfolioId?: number;
  subPortfolioId?: number;
}
