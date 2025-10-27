export interface Message {
  msgId: string;
  chat: string;
  chatTitle?: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
  hasMedia?: boolean;
  media?: MediaInfo;
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'error';
  messageType?: string;
  buttonReplyId?: string;
  listRowId?: string;

  // Reply/Quote fields
  quotedMessageId?: string;
  quotedText?: string;
  quotedSender?: string;
  quotedFromMe?: boolean;
}

export interface MediaInfo {
  mediaId?: string;
  kind?: string;
  mime?: string;
  fileName?: string;
  caption?: string;
  fileLength?: number;
  url?: string;
  base64Data?: string;
}

export interface Chat {
  jid: string;
  name: string;
  subject?: string;
  lastMsgText?: string;
  lastMsgTs?: number;
  unreadCount?: number;
  lastMsgFromMe?: boolean;
  profilePictureUrl?: string;
}

export interface Contact {
  jid: string;
  name: string;
  pushName?: string;
  profilePictureUrl?: string;
}

export interface WSMessage {
  type: string;
  payload?: any;
}
