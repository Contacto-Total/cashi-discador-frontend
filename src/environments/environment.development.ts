export const environment = {
  production: false,

  // Local development - API Gateway (unifica auth + discador + whatsapp)
  //apiUrl: 'http://localhost:8000/api',
  //wsUrl: 'http://localhost:8000/ws',

  apiUrl: 'https://cobranza.contactototal.com.pe/api',
  wsUrl: 'https://cobranza.contactototal.com.pe/ws',

  // Legacy API - Módulos antiguos (campaña, reportes, SMS, etc.)
  legacyApiUrl: 'https://huge-only-marmoset.ngrok-free.app/api',

  // Web Service Backend (catch-all route)
  webServiceUrl: 'https://cobranza.contactototal.com.pe/web-service',

  // FreeSWITCH on AWS - WebSocket SIP (puerto 5066 para WS no seguro)
  freeswitchWsUrl: 'cobranza.contactototal.com.pe:7443',
  freeswitchDomain: 'cobranza.contactototal.com.pe'
};
