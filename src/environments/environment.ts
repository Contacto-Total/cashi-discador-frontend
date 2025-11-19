export const environment = {
  production: true,

  // API Gateway - URLs absolutas para producción
  apiUrl: 'https://cobranza.contactototal.com.pe/api',
  gatewayUrl: 'https://cobranza.contactototal.com.pe/api',
  wsUrl: 'https://cobranza.contactototal.com.pe/ws',

  // Web Service Backend (catch-all route)
  webServiceUrl: 'https://cobranza.contactototal.com.pe/web-service',

  // Tipificación Backend
  tipificacionUrl: 'https://cobranza.contactototal.com.pe/api/tipificacion/v1',

  // WhatsApp Backend
  whatsappApiUrl: 'https://cobranza.contactototal.com.pe/wsp-api',
  whatsappWsUrl: 'https://cobranza.contactototal.com.pe/wsp-ws',

  // FreeSWITCH on AWS - WebSocket SIP over SSL (port 7443)
  freeswitchWsUrl: 'cobranza.contactototal.com.pe:7443',
  freeswitchDomain: 'cobranza.contactototal.com.pe'
};

