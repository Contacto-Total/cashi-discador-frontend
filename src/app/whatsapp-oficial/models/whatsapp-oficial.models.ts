export interface WaoMensaje {
  id: number;
  wamid: string | null;
  waId: string | null;
  userId: string | null;
  nombre: string | null;
  direccion: 'ENTRANTE' | 'SALIENTE';
  tipo: string;
  contenido: string | null;
  mediaId: string | null;
  mediaMime: string | null;
  plantilla: string | null;
  estado: 'RECIBIDO' | 'ENVIADO' | 'ENTREGADO' | 'LEIDO' | 'FALLIDO';
  codigoError: string | null;
  detalleError: string | null;
  usuario: string | null;
  fechaMeta: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface WaoEstado {
  habilitado: boolean;
  version: string;
  phoneNumberId: string;
  wabaId: string;
  tokenConfigurado: boolean;
  appSecretConfigurado: boolean;
  verifyTokenConfigurado: boolean;
  callbackUrl: string;
  ventanaHoras: number;
}

export interface WaoResumen {
  enviadosMes: number;
  recibidosMes: number;
  topeGratisMes: number;
}

export interface WaoBaja {
  id: number;
  waId: string;
  motivo: string | null;
  origen: string;
  fechaCreacion: string;
}

export interface WaoPlantillaComponente {
  type: string;
  text?: string;
}

export interface WaoPlantilla {
  name: string;
  status: string;
  category: string;
  language: string;
  components?: WaoPlantillaComponente[];
}

export interface WaoPlantillasRespuesta {
  data: WaoPlantilla[];
}

export interface WaoUsuario {
  id: number;
  nombre: string;
  rol: string | null;
}

export interface WaoRemitente {
  nombre: string;
  rol?: string;
  cartera?: string;
}
