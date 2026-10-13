/**
 * Roles que intervienen en la emisión propia de cartas de no adeudo.
 * Se comparan con AuthService.hasAnyRole, que ignora mayúsculas, tildes y guiones.
 */
export const ROL_ADMIN = 'ADMIN';

/** Valida y envía el correo de la carta. */
export const ROLES_SUPERVISION_CARTAS = ['SUPERVISOR TRAMO PROPIO'];

/** Valida los pagos antes de emitir la carta. Los demás roles de administración (general, tramos, castigo) no entran. */
export const ROLES_ADMINISTRACION_CARTAS = ['ADMINISTRACION TRAMO PROPIO'];
