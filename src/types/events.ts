import { Contact, Conversation, FriendApplication, Group, GroupApplication, GroupInvitation, GroupMember, IMAccount, Message } from "./models";

export interface Event<T> {
  // 事件数据
  data: T;
  // 事件类型
  type: string;
}

export enum EventType {
  // 账号在线状态变化
  ACCOUNT_PRESENCE_CHANGED = 'account_presence_changed',
  // 账号总未读数量变化
  ACCOUNT_UNREAD_COUNT = 'account_unread_count',
  // 账号更新
  ACCOUNT_UPDATED = 'account_updated',
  // 好友更新
  CONTACT_UPDATED = 'contact_updated',
  // 新会话
  CONVERSATION_CREATED = 'conversation_created',
  // 会话更新
  CONVERSATION_UPDATED = 'conversation_updated',
  // 群组被解散
  GROUP_DISMISSED = 'group_dismissed',
  // 离开群组
  GROUP_QUITED = 'group_quited',
  // 群组更新
  GROUP_UPDATED = 'group_updated',
  // 收到新消息
  MESSAGE_RECEIVED = 'message_received',
  // 消息被撤回
  MESSAGE_REVOKED = 'message_revoked',
  // 消息更新
  MESSAGE_UPDATED = 'message_updated',
  // 新好友
  NEW_CONTACT = 'contact_new',
  // 收到好友申请
  NEW_FRIEND_APPLICATION = 'friend_application_new',
  // 新群组
  NEW_GROUP = 'group_new',
  // 收到入群申请
  NEW_GROUP_APPLICATION = 'group_application_new',
  // 收到入群邀请
  NEW_GROUP_INVITATION = 'group_invitation_new',
}

// 账号更新
export type AccountUpdatedEvent = Event<IMAccount>;
// 账号在线状态变化
export type AccountPresenceChangedEvent = Event<Pick<IMAccount, 'id' | 'presence'>>;
// 账号总未读数量变化
export type AccountUnreadCountEvent = Event<Pick<IMAccount, 'id' | 'unread'>>;
// 新好友
export type NewContactEvent = Event<Contact>;
// 好友更新
export type ContactUpdatedEvent = Event<Contact>;
// 收到好友申请
export type NewFriendApplicationEvent = Event<FriendApplication>;
// 新会话
export type ConversationCreatedEvent = Event<Conversation>;
// 会话更新
export type ConversationUpdatedEvent = Event<Conversation>;
// 会话未读数量变化
export type ConversationUnreadCountEvent = Event<Pick<Conversation, 'id' | 'unread'>>;
// 收到新消息
export type MessageReceivedEvent = Event<Message>;
// 消息更新
export type MessageUpdatedEvent = Event<Message>;
// 消息被撤回
export type MessageRevokedEvent = Event<Message>;
// 新群组
export type NewGroupEvent = Event<Group>;
// 群组更新
export type GroupUpdatedEvent = Event<Group>;
// 群组被解散
export type GroupDismissedEvent = Event<Pick<Group, 'id'>>;
// 离开群组
export type GroupQuitedEvent = Event<Pick<Group, 'id'>>;
// 收到入群申请
export type NewGroupApplicationEvent = Event<GroupApplication>;
// 收到入群邀请
export type NewGroupInvitationEvent = Event<GroupInvitation>;
// 新群成员
export type NewGroupMemberEvent = Event<GroupMember>;
// 群成员更新
export type GroupMemberUpdatedEvent = Event<GroupMember>;
// 群成员被踢出群
export type GroupMemberKickedEvent = Event<Pick<GroupMember, 'id' | 'group_id' | 'nickname' | 'avatar'>>;
// 群成员主动退群
export type GroupMemberQuitedEvent = Event<Pick<GroupMember, 'id' | 'group_id' | 'nickname' | 'avatar'>>;

export type IMEvent =
  | AccountUpdatedEvent
  | AccountPresenceChangedEvent
  | AccountUnreadCountEvent
  | NewContactEvent
  | ContactUpdatedEvent
  | NewFriendApplicationEvent
  | ConversationCreatedEvent
  | ConversationUpdatedEvent
  | ConversationUnreadCountEvent
  | MessageReceivedEvent
  | MessageUpdatedEvent
  | MessageRevokedEvent
  | NewGroupEvent
  | GroupUpdatedEvent
  | GroupDismissedEvent
  | GroupQuitedEvent
  | NewGroupApplicationEvent
  | NewGroupMemberEvent
  | GroupMemberUpdatedEvent
  | GroupMemberKickedEvent
  | GroupMemberQuitedEvent;

export type EventHandler = (_: any, evt: IMEvent) => void;