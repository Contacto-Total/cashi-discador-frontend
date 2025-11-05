/**
 * Modelo con información completa del cliente para la pantalla de tipificación
 */
export interface ClienteDetalle {
  // Información básica
  idCliente: number;
  documento: string;
  tipoDocumento?: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreCompleto: string;

  // Información de contacto
  telefonoPrincipal?: string;
  telefonoSecundario?: string;
  telefonoTrabajo?: string;
  telefonoReferencia1?: string;
  telefonoReferencia2?: string;
  email?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;

  // Información financiera
  cuenta?: string;
  deudaTotal?: number;
  deudaCapital?: number;
  deudaInteres?: number;
  diasMora?: number;
  fechaVencimiento?: string;
  producto?: string;
  estadoCuenta?: string;

  // Información personal
  fechaNacimiento?: string;
  edad?: number;
  genero?: string;
  estadoCivil?: string;
  ocupacion?: string;

  // Información de la campaña/cartera
  idInquilino?: number;
  idCartera?: number;
  idSubcartera?: number;
  nombreCartera?: string;
  tramo?: string;

  // Información del contacto en la campaña
  contactoId: number;
  numeroMarcado: string;
  estadoContacto: string;
  intentos: number;

  // Teléfonos adicionales
  telefonos?: Telefono[];
}

export interface Telefono {
  tipo: string;
  subtipo: string;
  numero: string;
  activo: boolean;
}
