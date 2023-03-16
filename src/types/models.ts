export enum MessageType {
  // 文本消息
  Text = 'text',
  // 图片消息
  Image = 'image',
  // 语音消息
  Audio = 'audio',
  // 视频消息
  Video = 'video',
  // 文件消息
  File = 'file',
  // 位置消息
  Location = 'location',
  // 表情消息
  Face = 'face',

  // 链接消息
  Link = 'link',

  //
  Merger = 'merger',

  // 童话消息
  Calling = 'calling',

  // 自定义消息
  Custom = 'custom',

  // 群组提示
  GroupTip = 'group_tip',

  GroupSystemNotice = 'group_system_notice',
}


/**
 * 用户档案，IMAccount 应该继承这个
 */
export interface Profile {
  id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  gender?: number;
}

export interface IMAccount extends Profile {
  provider: string;
  created_at: number;
  presence: string;
  unread?: number;
}

/**
 * 联系人
 */
export interface Contact extends Profile {
  id: string;
  account: string;
  marked: boolean;
  created_at: number;
}

/**
 * 群成员
 */
export interface GroupMember extends Profile {
  id: string;
  group_id: string;
  nickname: string;
  avatar: string;
}

/**
 * 动态 / 朋友圈
 */
export interface Moment {
  id: string;
} 

export interface ImageMessageBody {
  url: string;
}

export interface AudioMessageBody {
  url: string;
  duration: number;
}

export interface VideoMessageBody {}

export interface CallingMessagePayload {
  data: any;
}

export interface GroupSystemNoticeMessagePayload {
  groupProfile: any;
  operatorID: string;
  operationType: number;
  userDefinedField: any;
}

export enum GroupTipOperationType {
  MemberJoin = 1,
  MemberQuit = 2,
  MemberKickedOut = 3,
  MemberSetAdmin = 4,
  MemberCanceledAdmin = 5,
  GroupProfileUpdated = 6,
  MemberProfileUpdated = 7,
}

export interface GroupTipMessagePayload {
  operationType: GroupTipOperationType;
  operatorID: string;
  userIDList: string[];
  memberList: string[];

  newGroupProfile?: any;
}

export interface Message {
  id: string;
  /**
   * 消息类型
   */
  type: MessageType;

  /* start 消息内容 */
  text?: string;
  image?: ImageMessageBody;
  audio?: AudioMessageBody;
  video?: VideoMessageBody;
  calling?: CallingMessagePayload;
  tip?: GroupTipMessagePayload;
  group_system_notice?: GroupSystemNoticeMessagePayload;

  /* end 消息内容 */

  /**
   * 消息发送者的头像地址
   */
  avatar?: string;

  /**
   * 消息发送者的昵称, 是否应该叫 nick
   */
  name: string;


  account: string;
  sent_at: number;
  nick?: string;
  data?: any;

  /**
   * 消息所属的会话 ID
   */
  conversation_id: string;
  conversation_type: ConversationType;

  /**
   * TODO 发送方的 id
   */
  from?: string;

  /**
   * TODO 接收方的 id
   */
  to: string;

  /**
   * 消息的流向
      in 为收到的消息
      out 为发出的消息
   */
  flow: string;

  	
  /**
   * 是否被撤回
   */
  revoked: boolean;
  fromAccount: string;
  nameCard: string;


  
  // TODO @deprecated 为什么会有这个字段, 对应到 TIM 是什么, 是否可并入消息状态
  sending: boolean;
  // TODO @deprecated 为什么会有这个字段, 对应到 TIM 是什么, 是否可并入消息状态
  succeeded: boolean;
  // TODO @deprecated 为什么会有这个字段, 对应到 TIM 是什么, 是否可并入消息状态
  failed: boolean;

  // TODO @deprecated 为什么会有这个字段, 明显不合理
  failed_reason?: string;

  mentioned_users?: Profile[];

  /**
   * 消息状态
   *  unSend(未发送)
   *  success(发送成功)
   *  fail(发送失败)
   */
  status: string;
}

export enum ConversationType {
  Private = 'private',
  Group = 'group',
  System = 'system'
}

export interface Conversation {
  id: string;

  /**
   * 会话类型
   */
  type: ConversationType;

  /**
   * TODO 群组会话类型, 聊天室 / 直播群
   */
  // groupType: ConversationGroupType;

  name: string;

  contact?: Contact;

  group?: Group;

  /**
   * 未读计数。GRP_MEETING / GRP_AVCHATROOM 类型的群组会话不记录未读计数
   */
  unread: number;
  
  /**
   * 会话最新的消息
   */  
  last_message?: Message;

  /**
   * 会话是否置顶
   */
  pinned: boolean;

  /**
   * 会话所属的账户id
   */
  // TODO 到底应该保留 accountId 还是 account
  accountId: string;
  account: string;

  /**
   * 时间戳(ms)
   */
  active_at: number;
  
  /**
   * 创建时间 时间戳(ms)
   */
  created_at: number;

  /**
   * 参与者，当会话是群时，代表 群id, 当会话是个人时，代表 用户id
   */
  participant: string;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
}

export interface GroupInvitation {
  
}

export interface GroupApplication {
  
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
  // cursor: Cursor;
  has_next: boolean;
  has_previous: boolean;
  start_cursor?: Cursor;
  end_cursor?: Cursor;
  limit: number;
};

export type CursorListResponse<T> = {
  extra: CursorListExtra;
  data: Array<T>;
};



export type FriendApplication = {
}


export enum SortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export type Filter = any;

export type SortField = {
  field: string;
  direction: SortDirection;
}

export type SearchQuery = {
  filter?: Filter;
  sort?: SortField[];
  limit?: number;
}

export type UserFilter = {};

export interface UserSearchQuery extends SearchQuery {
  filter: UserFilter;
  sort?: SortField[];
  limit?: number;
}