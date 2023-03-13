import { Message, GetMessageListParameters, GetMessageListResponse } from "../../types";

export enum MessageListActionType {
	FETCHING_MESSAGE_LIST = "uim/FETCHING_MESSAGE_LIST",
	MESSAGE_LIST_FETCHED = "uim/MESSAGE_LIST_FETCHED",
	ERROR_FETCHING_MESSAGE_LIST = "uim/ERROR_FETCHING_MESSAGE_LIST",
	MESSAGE_RECEIVED = "uim/MESSAGE_RECEIVED",
	MESSAGE_DELETED = "uim/MESSAGE_DELETED",
  MESSAGE_UPDATE = "uim/MESSAGE_UPDATE",
}

export type FetchMessageListRequest = GetMessageListParameters;

export type FetchMessageListResponse = GetMessageListResponse;

export interface FetchMessageListError {
	request: FetchMessageListRequest;
	error: Error;
};

export interface FetchMessageListSuccess {
	request: FetchMessageListRequest
	response: FetchMessageListResponse
}

export interface FetchingMessageListAction {
	type: typeof MessageListActionType.FETCHING_MESSAGE_LIST;
	payload: FetchMessageListRequest;
}

export interface MessageListFetchedAction {
	type: typeof MessageListActionType.MESSAGE_LIST_FETCHED;
	payload: FetchMessageListSuccess;
}

export interface ErrorFetchingMessageListAction {
	type: typeof MessageListActionType.ERROR_FETCHING_MESSAGE_LIST;
	payload: FetchMessageListError;
}

export interface MessageReceivedAction {
	type: typeof MessageListActionType.MESSAGE_RECEIVED;
	payload: Message;
}

export interface MessageUpdateAction {
  type: typeof MessageListActionType.MESSAGE_UPDATE;
  payload: Message;
}

export interface MessageDeletedPayload {
	// 消息ID
	id: string
	// 会话ID
	conversation_id: string
}

export interface MessageDeletedAction {
	type: typeof MessageListActionType.MESSAGE_DELETED;
	payload: MessageDeletedPayload
}

export type MessageListActions =
	| FetchingMessageListAction
	| MessageListFetchedAction
	| ErrorFetchingMessageListAction
	| MessageReceivedAction
	| MessageDeletedAction
  | MessageUpdateAction
