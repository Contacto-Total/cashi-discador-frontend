export const environment = {
  production: false,

  // Local development - Backend running locally
  apiUrl: 'http://localhost:8080/api',
  wsUrl: 'http://localhost:8080/ws',

  // FreeSWITCH on AWS - WebSocket SIP (puerto 5066 para WS no seguro)
    freeswitchWsUrl: 'cobranza.contactototal.com.pe:7443',
    freeswitchDomain: 'cobranza.contactototal.com.pe'
};
