import { Contact, Conversation, ConversationType, CursorListQueryParameters, CursorListResponse, EmptyObject, IMAccount, ImageMessageBody, Message, MessageType, PageListQueryParameters, PageListResponse, VideoMessageBody, VoiceMessageBody } from "./models";

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
  createTextMessage(params: any): Message;

  createFaceMessage(params: any): Message;

  createVideoMessage(params: any): Message;

  createImageMessage(params: any): Message;

  createFileMessage(params: any): Message;

  createLocationMessage(params: any): Message;

  createMergerMessage(params: any): Message;

  createTextAtMessage(params: any): Message;

  createCustomMessage(params: any): Message;

  createAudioMessage(params: any): Message;
}