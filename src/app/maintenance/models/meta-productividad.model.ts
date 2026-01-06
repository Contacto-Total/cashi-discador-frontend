export interface MetaProductividad {
  id?: number;
  idTenant?: number | null;
  tenantName?: string;
  idCartera?: number | null;
  carteraName?: string;
  idSubcartera?: number | null;
  subcarteraName?: string;

  // Metas de Gestiones
  metaGestionesDiarias?: number | null;
  metaGestionesSemanales?: number | null;
  metaGestionesMensuales?: number | null;

  // Metas de Promesas
  metaPromesasDiarias?: number | null;
  metaPromesasSemanales?: number | null;
  metaPromesasMensuales?: number | null;

  // Metas de Monto
  metaMontoDiario?: number | null;
  metaMontoSemanal?: number | null;
  metaMontoMensual?: number | null;

  activo?: boolean;
}
