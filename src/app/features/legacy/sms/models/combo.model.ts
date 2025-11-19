export interface RangeDto {
  field: string;
  min?: number;
  max?: number;
  inclusiveMin?: boolean;
  inclusiveMax?: boolean;
}

export interface ComboCreateRequest {
  name: string;
  descripcion: string;
  tramo: '3' | '5' | 'CONTACTO_TOTAL';
  selects: string[];
  condiciones: string[];
  restricciones: {
    noContenido: boolean;
    excluirPromesasPeriodoActual: boolean;
    excluirCompromisos: boolean;
    excluirBlacklist: boolean;
  };
  plantillaTexto: string;
  plantillaName?: string;
  importeExtra?: number | null;
  rangos?: RangeDto[];
}

export interface ComboResponse {
  id: number;
  name: string;
  descripcion: string;
  tramo: '3' | '5' | 'CONTACTO_TOTAL';
  selects: string[];
  condiciones: string[];
  restricciones: {
    noContenido: boolean;
    excluirPromesasPeriodoActual: boolean;
    excluirCompromisos: boolean;
    excluirBlacklist: boolean;
  };
  plantillaSmsId?: number | null;
  plantillaTexto?: string;
  isActive: boolean;
  rangos?: RangeDto[];
  createdAt?: string;
  updatedAt?: string;
}
