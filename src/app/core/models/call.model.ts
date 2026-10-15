export interface Call {
  id: number;
  callId: string;
  contactId: number;
  agentId: number;
  campaignId: number;
  phoneNumber: string;
  status: CallStatus;
  disposition?: CallDisposition;
  startTime?: Date;
  answerTime?: Date;
  endTime?: Date;
  duration?: number;
  talkDuration?: number;
  recordingPath?: string;
  notes?: string;
  sipCallId?: string;
  hangupCause?: string;
  createdAt?: Date;
}

export enum CallStatus {
  INITIATED = 'INITIATED',
  DIALING = 'DIALING',
  RINGING = 'RINGING',
  ANSWERED = 'ANSWERED',
  CONNECTED = 'CONNECTED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ABANDONED = 'ABANDONED'
}

export enum CallDisposition {
  CONTACTED = 'CONTACTED',
  NO_ANSWER = 'NO_ANSWER',
  VOICEMAIL = 'VOICEMAIL',
  SALE = 'SALE',
  NOT_INTERESTED = 'NOT_INTERESTED',
  CALLBACK_SCHEDULED = 'CALLBACK_SCHEDULED',
  BUSY = 'BUSY',
  INVALID_NUMBER = 'INVALID_NUMBER',
  DO_NOT_CALL = 'DO_NOT_CALL'
}

export interface MakeCallRequest {
  agentId: number;
  phoneNumber: string;
  contactId?: number;
  idCliente?: number;
  documento?: string;
  tenantId?: number;
  carteraId?: number;
  subcarteraId?: number;
  campaignId?: number;
  // Queda en marcador_llamadas.origen y es lo que le dice al backend que esta llamada
  // la marco el asesor, no el discador: con eso no la barre el limpiador de huerfanas
  // ni le reenvia la ficha que ya tiene abierta. Si no se manda, el backend asume
  // MANUAL.
  //
  // Las tres salen del mismo boton "Rellamar", y se distinguen por cuando se presiono:
  //   MANUAL              primera llamada sobre una ficha que el asesor abrio buscando
  //   RELLAMADA_MANUAL    segunda o siguiente sobre esa misma ficha manual
  //   RELLAMADA_DISCADOR  sobre una ficha que entro por el discador (tipificando)
  origen?: 'MANUAL' | 'RELLAMADA_MANUAL' | 'RELLAMADA_DISCADOR';
}

export interface CompleteCallRequest {
  disposition: CallDisposition;
  notes: string;
  scheduleCallback?: Date;
}

export interface CallEvent {
  type: CallEventType;
  callId: string;
  data?: any;
  timestamp: Date;
}

export enum CallEventType {
  CALL_INITIATED = 'CALL_INITIATED',
  CALL_RINGING = 'CALL_RINGING',
  CALL_ANSWERED = 'CALL_ANSWERED',
  CALL_CONNECTED = 'CALL_CONNECTED',
  CALL_ENDED = 'CALL_ENDED',
  NEW_CONTACT_ASSIGNED = 'NEW_CONTACT_ASSIGNED'
}
