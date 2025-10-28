export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  token?: string;  // Alias para compatibilidad
  nombreUsuario: string;
  username?: string;  // Alias para compatibilidad
  nombreCompleto?: string;  // Nombre completo del usuario
  roles: string[];
  role?: string;  // Alias para compatibilidad
  mensaje?: string;
  message?: string;  // Alias para compatibilidad
}

export interface User {
  username: string;
  fullName?: string;  // Nombre completo para mostrar
  role: string;
}
