export interface MensajeRapido {
  titulo: string;
  texto: string;
}

export const MENSAJES_RAPIDOS: MensajeRapido[] = [
  { titulo: 'Saludo', texto: 'Hola {nombre}, gracias por escribirnos. ¿En qué podemos ayudarte?' },
  { titulo: 'Un momento', texto: 'Un momento por favor, estamos revisando tu consulta.' },
  { titulo: 'Pedir DNI', texto: 'Para ayudarte mejor, ¿puedes indicarnos tu número de DNI?' },
  { titulo: 'Horario de llamada', texto: '¿En qué horario prefieres que un asesor te llame?' },
  { titulo: 'Recibimos tu mensaje', texto: 'Recibimos tu mensaje. Un asesor te responderá a la brevedad.' },
  { titulo: 'Pedir comprobante', texto: 'Si ya realizaste el pago, por favor envíanos una foto del comprobante.' },
  { titulo: 'Aviso de baja', texto: 'Si no deseas recibir más mensajes por este medio, escribe BAJA y dejaremos de escribirte.' },
  { titulo: 'Despedida', texto: 'Gracias por comunicarte con nosotros. Que tengas un buen día.' }
];
