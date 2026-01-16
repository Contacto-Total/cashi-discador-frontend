export interface FieldDefinition {
  id: number;
  fieldCode: string;
  fieldName: string;
  description?: string;
  dataType: DataType;
  format?: string;
  associatedTable?: AssociatedTable;
  createdAt?: string;
  updatedAt?: string;
}

export type DataType = 'TEXTO' | 'NUMERICO' | 'FECHA';

/**
 * Tablas asociadas disponibles para campos
 */
export type AssociatedTable = 'clientes' | 'metodos_contacto' | 'otros';

/**
 * Labels para mostrar en UI
 */
export const ASSOCIATED_TABLE_LABELS: Record<AssociatedTable, string> = {
  'clientes': 'Clientes',
  'metodos_contacto': 'Métodos de Contacto',
  'otros': 'Otros'
};
