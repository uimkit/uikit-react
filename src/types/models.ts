export class IMAccount {
  id: string;
  name: string;
  provider: string;
  avatar: string;
}

export class Contact {
  id: string;

  marked: boolean;
  created_at: number;
}

export enum MessageType {
  Text = 'text',
  Image = 'image',
  Voice = 'voice',
  Video = 'video',
  File = 'file',
  Location = 'location',
  Face = 'face',
  Custom = 'custom',
}

export interface ImageMessageBody {
}

export interface VoiceMessageBody {}

export interface VideoMessageBody {}

export interface Message {
  id: string;
  avatar?: string;
  name: string;

  type: MessageType;

  text?: string;
  image?: ImageMessageBody;
  sent_at: number;
  nick?: string;
  from?: string;
  data?: any;
  conversation_id: string;

  isRevoked: boolean;
  fromAccount: string;
  nameCard: string;
}

export enum ConversationType {
  Private = 'private',
  Group = 'group',
  System = 'system'
}

export interface Conversation {
  id: string;
  type; ConversationType;
  name: string;
  avatar?: string;

  unreadCount: number;
  last_message?: Message;

  pinned: boolean;
  accountId: string;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
}









export type EmptyObject = Record<string, unknown>;

export type PageListQueryParameters<T> = T & {
  offset?: number;
  limit?: number;
};

export type PageListExtra = {
  offset: number;
  limit: number;
  total: number;
};

export type PageListResponse<T> = {
  extra: PageListExtra;
  data: Array<T>;
};

export type Cursor = string | number;
export type CursorDirection = "after" | "before";
export type CursorListQueryParameters<T> = T & {
  cursor?: Cursor;
  direction?: CursorDirection;
  limit?: number;
};
export type CursorListExtra = {
  cursor: Cursor;
  has_more: boolean;
  limit: number;
};

export type CursorListResponse<T> = {
  extra: CursorListExtra;
  data: Array<T>;
};