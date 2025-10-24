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
  campaignId?: number;
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
