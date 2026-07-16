export interface Reaction {
  emoji: string;
  fromMe: boolean;
}

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

  // Sender (grupos: participante que envió el mensaje)
  sender?: string;
  senderName?: string;

  // Reply/Quote fields
  quotedMessageId?: string;
  quotedText?: string;
  quotedSender?: string;
  quotedFromMe?: boolean;

  // Reacciones, edición y eliminación
  reactions?: Reaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
  isForwarded?: boolean;
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
  id?: number;
  jid: string;
  name: string;
  subject?: string;
  lastMsgText?: string;
  lastMsgTs?: number;
  unreadCount?: number;
  lastMsgFromMe?: boolean;
  profilePictureUrl?: string;
  isGroup?: boolean;
  lastMsgHasMedia?: boolean;
  lastMsgMediaKind?: string;
  blocked?: boolean;
  windowExpiresAt?: string;

  // Presencia (online / última vez / escribiendo)
  isOnline?: boolean;
  lastSeen?: number;
  isTyping?: boolean;
  typingMedia?: 'text' | 'audio';
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
