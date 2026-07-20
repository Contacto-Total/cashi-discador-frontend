export type UserRole =
  | 'ADMIN'
  | 'AGENT'
  | 'SUPERVISOR'
  | 'ASESOR'
  | 'ASESOR CASTIGO'
  | 'SUPERVISOR CASTIGO'
  | 'SUPERVISOR TRAMO PROPIO'
  | 'OPERACIONES'
  | 'ADMINISTRACION'
  | string;

export interface UserAssignment {
  idInquilino: number;
  nombreInquilino: string | null;
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
}

export interface UserInfo {
  idUsuario: number;
  primerNombre: string | null;
  primerApellido: string | null;
  activo: boolean;
  roles: UserRole[];
  asignaciones: UserAssignment[];
}

export interface UserInfoView extends UserInfo {
  displayName: string;
  initials: string;
}

export function toUserInfoView(user: UserInfo): UserInfoView {
  const nameParts = [user.primerNombre, user.primerApellido]
    .map((part) => part?.trim())
    .filter((part): part is string => !!part);
  const displayName = nameParts.length ? nameParts.join(' ') : `Usuario ${user.idUsuario}`;

  return {
    ...user,
    displayName,
    initials: nameParts.map((part) => part[0]).join('').slice(0, 2).toUpperCase() || String(user.idUsuario).slice(0, 2)
  };
}
