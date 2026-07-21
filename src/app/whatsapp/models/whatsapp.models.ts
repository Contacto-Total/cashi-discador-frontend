export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'error';

export type OutboundType = 'TEXT' | 'MEDIA' | 'TEMPLATE';

export type WhatsAppEventType =
  | 'INCOMING'
  | 'OUTGOING'
  | 'RECEIPT'
  | 'CHAT_UPDATE'
  | 'VIEWERS'
  | 'STATUS'
  | 'MESSAGE_NOTIFICATION';

export interface MediaInfo {
  mediaId?: string;
  kind?: 'image' | 'video' | 'audio' | 'document' | 'sticker' | string;
  mime?: string;
  fileName?: string;
  caption?: string;
  fileLength?: number;
  url?: string;
}

export interface Conversation {
  id: number;
  accountId?: number;
  contactJid: string;
  contactPhone?: string;
  name?: string;
  isGroup?: boolean;
  lastMsgTs?: number;
  lastMsgText?: string;
  lastMsgFromMe?: boolean;
  unreadCount?: number;
  profilePictureUrl?: string;
  lastIncomingAt?: string;
  lastOutgoingAt?: string;
  windowExpiresAt?: string;
  blocked?: boolean;
}

export interface Chat {
  id?: number;
  jid: string;
  contactPhone?: string;
  name: string;
  lastMsgText?: string;
  lastMsgTs?: number;
  unreadCount?: number;
  lastMsgFromMe?: boolean;
  profilePictureUrl?: string;
  isGroup?: boolean;
  blocked?: boolean;
  windowExpiresAt?: string;
}

export interface Message {
  id?: number;
  msgId: string;
  chat: string;
  conversationId?: number;
  chatTitle?: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
  hasMedia?: boolean;
  media?: MediaInfo;
  status?: MessageStatus;
  messageType?: 'INCOMING' | 'OUTGOING' | string;
  sentByAgentId?: string;
  quotedMessageId?: string;
  quotedText?: string;
  quotedSender?: string;
  quotedFromMe?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface MessagePageResponse {
  messages: Message[];
  hasMore: boolean;
}

export interface MessageReceipt {
  msgId: string;
  status: Extract<MessageStatus, 'sent' | 'delivered' | 'read'>;
}

export interface MessageAgentView {
  agentId: string;
  seenAt: string;
}

export interface SendMessageRequest {
  conversationId: number;
  type: OutboundType;
  body?: string;
  mediaRef?: string;
  quotedMessageId?: string;
}

export interface SendMessageResponse {
  id: number;
  status: 'QUEUED' | string;
}

export interface WindowStatus {
  conversationId?: number;
  blocked: boolean;
  hasActiveWindow: boolean;
  windowExpiresAt?: string;
}

export interface ViewerResponse {
  conversationId: number;
  viewers: string[];
}

export interface MessageNotification {
  conversationId: number;
  chat: string;
  chatTitle: string;
  msgId: string;
  text?: string;
  timestamp: number;
  hasMedia: boolean;
  mediaKind?: string;
}

export interface AccountStatusEvent {
  instanciaId: string;
  status: string;
  jid?: string;
  phoneNumber?: string;
}

export interface WhatsAppEventPayloadMap {
  INCOMING: Message;
  OUTGOING: Message;
  RECEIPT: MessageReceipt;
  CHAT_UPDATE: Conversation;
  VIEWERS: ViewerResponse;
  STATUS: AccountStatusEvent;
  MESSAGE_NOTIFICATION: MessageNotification;
}

export interface WhatsAppEvent<T = unknown> {
  type: WhatsAppEventType;
  conversationId?: number | null;
  chat?: string | null;
  payload: T;
}

export type TypedWhatsAppEvent = {
  [K in WhatsAppEventType]: WhatsAppEvent<WhatsAppEventPayloadMap[K]> & { type: K };
}[WhatsAppEventType];

export function conversationToChat(conversation: Conversation): Chat {
  return {
    id: conversation.id,
    jid: conversation.contactJid,
    contactPhone: conversation.contactPhone,
    name: conversation.name || conversation.contactPhone || conversation.contactJid,
    lastMsgText: conversation.lastMsgText,
    lastMsgTs: conversation.lastMsgTs,
    unreadCount: conversation.unreadCount,
    lastMsgFromMe: conversation.lastMsgFromMe,
    profilePictureUrl: conversation.profilePictureUrl,
    isGroup: conversation.isGroup,
    blocked: conversation.blocked,
    windowExpiresAt: conversation.windowExpiresAt
  };
}
