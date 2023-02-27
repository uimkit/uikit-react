import { Group, GroupMember, Moment, Contact, Conversation, ConversationType, CursorListQueryParameters, CursorListResponse, EmptyObject, IMAccount, ImageMessageBody, Message, MessageType, PageListQueryParameters, PageListResponse, VideoMessageBody, VoiceMessageBody } from "./models";


export interface SendMessageOptions {
}


export type RetrieveIMAccountParameters = {
    account_id: string;
    subscribe?: boolean;
};

export type RetrieveIMAccountResponse = IMAccount;
export type ListIMAccountsParameters = PageListQueryParameters<EmptyObject> & {
    provider?: string;
    subscribe?: boolean;
};

export type ListIMAccountsResponse = PageListResponse<IMAccount>;
export type ListContactsParameters = CursorListQueryParameters<EmptyObject> & {
    account_id: string;
};
export type ListContactsResponse = CursorListResponse<Contact>;
export type ListGroupsParameters = PageListQueryParameters<EmptyObject> & {
    account_id: string;
};
export type ListGroupsResponse = PageListResponse<Group>;
export type ListConversationsParameters = CursorListQueryParameters<EmptyObject> & {
    account_id: string;
};
export type ListConversationsResponse = CursorListResponse<Conversation>;
export type RetrieveConversationParameters = {
    conversation_id: string;
};
export type RetrieveConversationResponse = Conversation;
export type RetrieveContactConversationParameters = {
    account_id: string;
    user_id: string;
};
export type RetrieveContactConversationResponse = Conversation;
export type RetrieveGroupConversationParameters = {
    account_id: string;
    group_id: string;
};
export type RetrieveGroupConversationResponse = Conversation;
export type ResetConversationUnreadParameters = {
    conversation_id: string;
};
export type ResetConversationUnreadResponse = Conversation;
export type RetrieveContactParameters = {
    account_id: string;
    user_id: string;
};
export type RetrieveContactResponse = Contact;
export type AddContactParameters = {
    account_id: string;
    contact: string;
    hello_message?: string;
};
export type AddContactResponse = {
    success: boolean;
    reason?: string;
};
export type RetrieveGroupParameters = {
    account_id: string;
    group_id: string;
};
export type RetrieveGroupResponse = Group;
export type ListGroupMembersParameters = PageListQueryParameters<EmptyObject> & {
    group_id: string;
};
export type ListGroupMembersResponse = PageListResponse<GroupMember>;
export type ListMomentsParameters = CursorListQueryParameters<EmptyObject> & {
    account_id: string;
    user_id?: string;
};
export type ListMomentsResponse = CursorListResponse<Moment>;
export type ListMessagesParameters = CursorListQueryParameters<EmptyObject> & {
    conversation_id: string;
};
export type ListMessagesResponse = CursorListResponse<Message>;
export type SendMessageDirectParameters = {
    from: string;
    to: string;
    conversation_type: ConversationType;
    type: MessageType;
    text?: string;
    image?: ImageMessageBody;
    voice?: VoiceMessageBody;
    video?: VideoMessageBody;
};
export type SendMessageToConversationParameters = {
    conversation_id: string;
    type: MessageType;
    text?: string;
    image?: ImageMessageBody;
    voice?: VoiceMessageBody;
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


export interface APIClient {
  /******************** IMAccount ********************/
  listIMAccounts(params: any): Promise<any>;


  /******************** Contact ********************/
  /**
   * 
   * @param params 
   */
  listContacts(params: any): Promise<any>;

  retrieveContact(params: any): Promise<Contact>;


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
  retrieveIMAccount(params: any): Promise<IMAccount>;

  /**
   * 
   * @param params 
   */
  listMessages(params: any): Promise<any>;

  /**
   * 发送消息
   * 之前写法太奇怪， 要去掉 callback
   * @param params 
   */
  sendMessage(message: any | Message, callback: (accountId: string, event: any) => void, opts?: SendMessageOptions): Promise<any>;

  /**
   * 删除消息的接口
   * @param messageList 
   */
  deleteMessage(messageList: any): Promise<any>;

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
  /**
   * 
   * @param params 获取会话列表
   */
  listConversations(params: any): Promise<any>;

  retrieveConversation(params: any): Promise<Conversation>;

  retrieveContactConversation(params: any): Promise<Conversation>;

  resetConversationUnread(params: any): Promise<any>;


  /******************** Group ********************/
  retrieveGroup(params: any): Promise<Group>;
}
