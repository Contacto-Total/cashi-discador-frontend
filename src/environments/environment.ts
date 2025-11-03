export const environment = {
  production: true,

    // Auth Backend (puerto 8082)
    apiUrl: '/auth-api',

    // API Gateway (puerto 8000) - para otras APIs
    gatewayUrl: '/api',
    wsUrl: '/ws',

    // Tipificación Backend (puerto 8085) a través del gateway
    tipificacionUrl: '/api/tipificacion/v1',

    // WhatsApp Backend
    whatsappApiUrl: '/wsp-api',
    whatsappWsUrl: '/wsp-ws',

    // FreeSWITCH on AWS - WebSocket SIP over SSL (port 7443)
    freeswitchWsUrl: 'cobranza.contactototal.com.pe:7443',
    freeswitchDomain: 'cobranza.contactototal.com.pe'
};

