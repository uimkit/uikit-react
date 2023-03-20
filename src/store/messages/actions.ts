import { Message, GetMessageListParameters, GetMessageListResponse, Conversation } from "../../types";
import { ConversationState } from "./reducers";

export enum ConversationActionType {
	FETCHING_MESSAGE_LIST = "uim/FETCHING_MESSAGE_LIST",
	MESSAGE_LIST_LOAD_MORE_FINISHED = "uim/MESSAGE_LIST_LOAD_MORE_FINISHED",
	MESSAGE_LIST_LOAD_MORE_NEWER_FINISHED = "uim/MESSAGE_LIST_LOAD_MORE_NEWER_FINISHED",
  ERROR_FETCHING_MESSAGE_LIST = "uim/ERROR_FETCHING_MESSAGE_LIST",
	MESSAGE_RECEIVED = "uim/MESSAGE_RECEIVED",
	MESSAGE_DELETED = "uim/MESSAGE_DELETED",
  MESSAGE_UPDATE = "uim/MESSAGE_UPDATE",

  SET_LOADING_MORE = 'uim/SET_LOADING_MORE',
  JumpToLatestMessage = 'uim/jumpToLatestMessage',
  JumpToMessageFinished = 'uim/jumpToMessageFinished',
  ClearHighlightedMessage = 'uim/clearHighlightedMessage',
}

export type FetchMessageListRequest = GetMessageListParameters;

export interface FetchMessageListError {
	request: FetchMessageListRequest;
	error: Error;
};

export interface FetchMessageListSuccess {
	request: FetchMessageListRequest
	response: GetMessageListResponse
}

export interface FetchingMessageListAction {
	type: typeof ConversationActionType.FETCHING_MESSAGE_LIST;
	payload: FetchMessageListRequest;
}

export interface MessageListLoadMoreFinishedAction {
	type: typeof ConversationActionType.MESSAGE_LIST_LOAD_MORE_FINISHED;
  conversation: Pick<Conversation, 'id'>;
	payload: Pick<ConversationState, 'messages' | 'hasMore' | 'nextCursor'>;
}

export interface MessageListLoadMoreNewerFinishedAction {
	type: typeof ConversationActionType.MESSAGE_LIST_LOAD_MORE_NEWER_FINISHED;
	payload: FetchMessageListSuccess;
}

export interface ErrorFetchingMessageListAction {
	type: typeof ConversationActionType.ERROR_FETCHING_MESSAGE_LIST;
	payload: FetchMessageListError;
}

export interface MessageReceivedAction {
	type: typeof ConversationActionType.MESSAGE_RECEIVED;
	payload: Message;
}

export interface MessageUpdateAction {
  type: typeof ConversationActionType.MESSAGE_UPDATE;
  payload: Message;
}

export interface JumpToLatestMessageAction {
  type: typeof ConversationActionType.JumpToLatestMessage;
  conversation: Pick<Conversation, 'id'>;
}

export interface JumpToMessageFinished {
  type: typeof ConversationActionType.JumpToMessageFinished;
  conversation: Pick<Conversation, 'id'>;
  hasMoreNewer: boolean;
  highlightedMessageId: string;
}

export interface MessageDeletedPayload {
	// 消息ID
	id: string
	// 会话ID
	conversation_id: string
}

export interface MessageDeletedAction {
	type: typeof ConversationActionType.MESSAGE_DELETED;
	payload: MessageDeletedPayload
}

export interface SetLoadingMoreAction {
	type: typeof ConversationActionType.SET_LOADING_MORE;
  conversation: Pick<Conversation, 'id'>;
  loadingMore: boolean;
}

export interface ClearHighlightedMessage {
  type: typeof ConversationActionType.ClearHighlightedMessage;
  conversation: Pick<Conversation, 'id'>;
}

export type MessageListActions =
	| FetchingMessageListAction
	| MessageListLoadMoreFinishedAction
  | MessageListLoadMoreNewerFinishedAction
  | SetLoadingMoreAction
	| ErrorFetchingMessageListAction
	| MessageReceivedAction
	| MessageDeletedAction
  | MessageUpdateAction
  | JumpToLatestMessageAction
  | JumpToMessageFinished
  | ClearHighlightedMessage