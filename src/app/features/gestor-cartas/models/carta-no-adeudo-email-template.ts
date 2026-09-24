/**
 * Plantilla del correo de carta de no adeudo.
 * El front es la fuente de verdad: se muestra en el preview y se envia al backend
 * en POST /solicitudes/enviar para que el correo real use exactamente este formato.
 *
 * Placeholders soportados (los reemplaza el backend por destinatario):
 *   {nombre}             -> nombre completo del cliente
 *   {nombre_mayusculas}  -> nombre completo del cliente en MAYUSCULAS
 *   {documento}          -> numero de documento del cliente
 */
export const CARTA_NO_ADEUDO_REMITENTE = 'Corporativo nsoluciones';

export const CARTA_NO_ADEUDO_ASUNTO = 'CARTA DE NO ADEUDO - {nombre_mayusculas}';

export const CARTA_NO_ADEUDO_CUERPO = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <div style="max-width:600px;margin:0 auto;padding:24px;font-size:14px;line-height:22px;">
    <p style="margin:0 0 12px;">Estimado (a):<br>Reciba un cordial saludo.</p>
    <p style="margin:0 0 12px;">
      Por medio del presente, adjuntamos la <strong>CARTA DE NO ADEUDO</strong>, documento que respalda la cancelaci&oacute;n total de su deuda.
    </p>
    <p style="margin:0 0 12px;">
      Le informamos que la presente se emite considerando la cancelaci&oacute;n total del producto otorgado originalmente por
      <strong>INFINANCE XP S.A.</strong> (Anteriormente con la raz&oacute;n social de <strong>FINANCIERA OH! S.A.</strong>)
      y posteriormente adquirido por <strong>NSOLUCIONES CONSULTING S.A.C.</strong>, quedando a la fecha sin saldo pendiente.
    </p>
    <p style="margin:0 0 12px;">Atentamente,</p>
    <p style="margin:0;line-height:20px;">
      <strong>Emily Saenz Martinez</strong><br>
      NSOLUCIONES CONSULTING S.A.C.<br>
      +51 915 257 493<br>
      contactototal.com.pe
    </p>
  </div>
</body>
</html>`;

export interface DatosPlantillaCorreo {
  nombre: string;
  documento: string;
}

export function renderPlantillaCorreo(plantilla: string, datos: DatosPlantillaCorreo): string {
  const nombre = datos.nombre?.trim() || 'cliente';
  return plantilla
    .split('{nombre_mayusculas}').join(nombre.toUpperCase())
    .split('{nombre}').join(nombre)
    .split('{documento}').join(datos.documento?.trim() || '');
}

export function nombreAdjuntoCartaNoAdeudo(documento: string): string {
  return `carta_no_adeudo_${documento}.pdf`;
}
