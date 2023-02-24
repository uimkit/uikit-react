import { Message, ListMessagesParameters, ListMessagesResponse } from "../../types";

export enum MessageListActionType {
	FETCHING_MESSAGE_LIST = "uim/FETCHING_MESSAGE_LIST",
	MESSAGE_LIST_FETCHED = "uim/MESSAGE_LIST_FETCHED",
	ERROR_FETCHING_MESSAGE_LIST = "uim/ERROR_FETCHING_MESSAGE_LIST",
	MESSAGE_RECEIVED = "uim/MESSAGE_RECEIVED",
	MESSAGE_DELETED = "uim/MESSAGE_DELETED",
}

export type FetchMessageListRequest = ListMessagesParameters;

export type FetchMessageListResponse = ListMessagesResponse;

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

export const fetchingMessageList = (
	payload: FetchMessageListRequest
): FetchingMessageListAction => ({
	type: MessageListActionType.FETCHING_MESSAGE_LIST,
	payload
})

export interface MessageListFetchedAction {
	type: typeof MessageListActionType.MESSAGE_LIST_FETCHED;
	payload: FetchMessageListSuccess;
}

export const messageListFetched = (
	payload: FetchMessageListSuccess
): MessageListFetchedAction => ({
	type: MessageListActionType.MESSAGE_LIST_FETCHED,
	payload
})

export interface ErrorFetchingMessageListAction {
	type: typeof MessageListActionType.ERROR_FETCHING_MESSAGE_LIST;
	payload: FetchMessageListError;
}

export const errorFetchingMessageList = (
	payload: FetchMessageListError
): ErrorFetchingMessageListAction => ({
	type: MessageListActionType.ERROR_FETCHING_MESSAGE_LIST,
	payload
})

export interface MessageReceivedAction {
	type: typeof MessageListActionType.MESSAGE_RECEIVED;
	payload: Message
}

export const messageReceived = (
	payload: Message
): MessageReceivedAction => ({
	type: MessageListActionType.MESSAGE_RECEIVED,
	payload
})

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

export const messageDeleted = (
	payload: MessageDeletedPayload
): MessageDeletedAction => ({
	type: MessageListActionType.MESSAGE_DELETED,
	payload
})

export type MessageListActions =
	| FetchingMessageListAction
	| MessageListFetchedAction
	| ErrorFetchingMessageListAction
	| MessageReceivedAction
	| MessageDeletedAction
