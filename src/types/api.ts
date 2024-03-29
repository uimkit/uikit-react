import { EventHandler } from "./events";
import { Group, GroupMember, Moment, Contact, Conversation, ConversationType, CursorListQueryParameters, CursorListResponse, EmptyObject, IMAccount, ImageMessageBody, Message, MessageType, PageListQueryParameters, PageListResponse, VideoMessageBody, AudioMessageBody } from "./models";


export type GetIMAccountParameters = {
    account_id: string;
    subscribe?: boolean;
};

export type GetIMAccountResponse = IMAccount;
export type GetAccountListParameters = PageListQueryParameters<EmptyObject> & {
    provider?: string;
    subscribe?: boolean;
};

export type GetAccountListResponse = PageListResponse<IMAccount>;
export type GetContactListParameters = CursorListQueryParameters<EmptyObject> & {
    account_id: string;
};
export type GetContactListResponse = CursorListResponse<Contact>;
export type GetGroupListParameters = PageListQueryParameters<EmptyObject> & {
    account_id: string;
};
export type GetGroupsResponse = PageListResponse<Group>;
export type GetConversationsParameters = CursorListQueryParameters<EmptyObject> & {
    account_id: string;
};
export type GetConversationsResponse = CursorListResponse<Conversation>;
export type GetConversationParameters = {
    conversation_id: string;
};
export type GetConversationResponse = Conversation;
export type GetContactConversationParameters = {
    account_id: string;
    user_id: string;
};
export type GetContactConversationResponse = Conversation;
export type GetGroupConversationParameters = {
    account_id: string;
    group_id: string;
};
export type GetGroupConversationResponse = Conversation;
export type ResetConversationUnreadParameters = {
    conversation_id: string;
};
export type ResetConversationUnreadResponse = Conversation;
export type GetContactParameters = {
    account_id: string;
    user_id: string;
};
export type GetContactResponse = Contact;
export type AddContactParameters = {
    account_id: string;
    contact: string;
    hello_message?: string;
};
export type AddContactResponse = {
    success: boolean;
    reason?: string;
};
export type GetGroupParameters = {
    account_id: string;
    group_id: string;
};
export type GetGroupResponse = Group;
/*export type GetGroupMemberListParameters = PageListQueryParameters<EmptyObject> & {
    group_id: string;
};*/
export type GetGroupMemberListParameters = CursorListQueryParameters<EmptyObject> & {
  group_id: string;
};

// export type GetGroupMemberListResponse = PageListResponse<GroupMember>;

// 查询账号的动态列表请求
export type GetAccountMomentListParameters = CursorListQueryParameters<{
  account_id: string;
}>;

// 查询好友的动态列表请求
export type GetContactMomentListParameters = CursorListQueryParameters<{
  contact_id: string;
}>;


export type GetMomentListResponse = CursorListResponse<Moment>;
export type GetMessageListParameters = CursorListQueryParameters<EmptyObject> & {
    conversation_id: string;
};
export type GetMessageListResponse = CursorListResponse<Message>;
export type SendMessageDirectParameters = {
    from: string;
    to: string;
    conversation_type: ConversationType;
    type: MessageType;
    text?: string;
    image?: ImageMessageBody;
    audio?: AudioMessageBody;
    video?: VideoMessageBody;
};
export type SendMessageToConversationParameters = {
    conversation_id: string;
    type: MessageType;
    text?: string;
    image?: ImageMessageBody;
    voice?: AudioMessageBody;
    video?: VideoMessageBody;
};
export type SendMessageParameters = SendMessageDirectParameters | SendMessageToConversationParameters;
export type SendMessageResponse = Message;
export type ResendMessageParameters = {
    message_id: string;
};
export type ResendMessageResponse = Message;
export type DeleteMessageParameters = {
    message_id: string;
};
export type DeleteMessageResponse = any;


export type GetGroupMemberListResponse = CursorListResponse<GroupMember>;



export interface APIClient {
  /******************** IMAccount ********************/
  getAccountList(params: GetAccountListParameters): Promise<GetAccountListResponse>;


  /******************** Contact ********************/
  /**
   * 
   * @param params 
   */
  getContactList(params: GetContactListParameters): Promise<GetContactListResponse>;

  getContact(params: any): Promise<Contact>;


  /******************** Message ********************/

  /**
   * 
   * @param params 
   */
  createTextMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createFaceMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createVideoMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createImageMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createFileMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createLocationMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createMergerMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createTextAtMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createCustomMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  createAudioMessage(params: any): Message;

  /**
   * 
   * @param params 
   */
  getAccount(params: any): Promise<IMAccount>;

  /**
   * 
   * @param params 
   */
  getMessageList(params: GetMessageListParameters): Promise<GetMessageListResponse>;

  /**
   * 发送消息
   * @param params 
   */
  sendMessage(message: any | Message): Promise<any>;

  deleteMessage(id: string): Promise<any>;

  /**
   * 删除消息的接口
   * @param messageList 
   */
  getMessage(messageList: any): Promise<any>;

  /**
   * 重发消息的接口，当消息发送失败时，可调用该接口进行重发。
   * @param @Message message 消息实例
   */
  resendMessage(message: any | Message): Promise<any>;

  /**
   * 
   * @param message 
   */
  revokeMessage(message: any): Promise<any>;


  /******************** Conversation ********************/
  createConversation(params: any): Promise<Conversation>;

  /**
   * 
   * @param params 获取会话列表
   */
  getConversationList(params: any): Promise<any>;

  getConversation(params: any): Promise<Conversation>;

  /**
   * 删除会话
   * @param id 
   */
  deleteConversation(id: string): Promise<void>;

  getContactConversation(params: any): Promise<Conversation>;

  resetConversationUnread(params: any): Promise<any>;

  /**
   * 标记会话消息为已读
   * @param id 
   */
  setConversationRead(conversationID: string): Promise<void>;

  /**
   * 置顶会话
   * @param conversationID 会话ID
   * @param pinned true 置顶; false 取消置顶
   */
  pinConversation(conversationID: string, pinned: boolean): Promise<void>;

  /******************** Group ********************/
  getGroup(params: any): Promise<Group>;

  getGroupList(params: GetGroupListParameters): Promise<GetGroupMemberListResponse>;

  getGroupMembers(query: GetGroupMemberListParameters): Promise<GetGroupMemberListResponse>;

  on(event: string, handler: EventHandler);
  off(event: string, handler: EventHandler);

  /******************** Moment ********************/
  getContactMomentList(params: GetContactMomentListParameters): Promise<GetMomentListResponse>;
}