export const environment = {
  production: false,

  // Local development - API Gateway (unifica auth + discador + whatsapp)
  apiUrl: 'http://localhost:8000/api',
  wsUrl: 'http://localhost:8000/ws',

  // FreeSWITCH on AWS - WebSocket SIP (puerto 5066 para WS no seguro)
    freeswitchWsUrl: 'cobranza.contactototal.com.pe:7443',
    freeswitchDomain: 'cobranza.contactototal.com.pe'
};
