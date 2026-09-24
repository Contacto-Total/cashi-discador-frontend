/**
 * Plantilla del correo de carta de no adeudo.
 * El front es la fuente de verdad: se muestra en el preview y se envia al backend
 * en POST /solicitudes/enviar para que el correo real use exactamente este formato.
 *
 * Placeholders soportados (los reemplaza el backend por destinatario):
 *   {nombre}    -> nombre completo del cliente
 *   {documento} -> numero de documento del cliente
 */
export const CARTA_NO_ADEUDO_REMITENTE = 'NSOLUCIONES';

export const CARTA_NO_ADEUDO_ASUNTO = 'Su carta de no adeudo';

export const CARTA_NO_ADEUDO_CUERPO = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.12);">
          <tr>
            <td style="background:#1d4ed8;padding:20px 32px;">
              <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">NSOLUCIONES</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:22px;">Estimulado(a) <strong>{nombre}</strong>,</p>
              <p style="margin:0 0 16px;font-size:14px;line-height:22px;">
                Le hacemos llegar su <strong>carta de no adeudo</strong> correspondiente al documento
                <strong>{documento}</strong>. La encontrara adjunta a este correo en formato PDF.
              </p>
              <p style="margin:0 0 16px;font-size:14px;line-height:22px;">
                Si tiene alguna consulta, puede responder directamente a este correo.
              </p>
              <p style="margin:24px 0 0;font-size:14px;line-height:22px;">
                Saludos cordiales,<br>
                <strong>Equipo NSOLUCIONES</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;line-height:16px;color:#64748b;">
              Este es un mensaje automatico. Por su seguridad, no comparta sus datos personales por correo.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export interface DatosPlantillaCorreo {
  nombre: string;
  documento: string;
}

export function renderPlantillaCorreo(plantilla: string, datos: DatosPlantillaCorreo): string {
  return plantilla
    .split('{nombre}').join(datos.nombre?.trim() || 'cliente')
    .split('{documento}').join(datos.documento?.trim() || '');
}

export function nombreAdjuntoCartaNoAdeudo(documento: string): string {
  return `carta_no_adeudo_${documento}.pdf`;
}
