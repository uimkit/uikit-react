import { Conversation, ListConversationsParameters, ListConversationsResponse } from "../../types";

export enum ConversationListActionType {
	FETCHING_CONVERSATION_LIST = "uim/FETCHING_CONVERSATION_LIST",
	CONVERSATION_LIST_FETCHED = "uim/CONVERSATION_LIST_FETCHED",
	ERROR_FETCHING_CONVERSATION_LIST = "uim/ERROR_FETCHING_CONVERSATION_LIST",
	CONVERSATION_RECEIVED = "uim/CONVERSATION_RECEIVED"
}

export type FetchConversationListRequest = ListConversationsParameters;

export type FetchConversationListResponse = ListConversationsResponse;

export interface FetchConversationListError {
	request: FetchConversationListRequest
	error: Error
};

export interface FetchConversationListSuccess {
	request: FetchConversationListRequest
	response: FetchConversationListResponse
}

export interface FetchingConversationListAction {
	type: typeof ConversationListActionType.FETCHING_CONVERSATION_LIST;
	payload: FetchConversationListRequest;
}

// 开始查询会话列表
export const fetchingConversationList = (
	payload: FetchConversationListRequest
): FetchingConversationListAction => ({
	type: ConversationListActionType.FETCHING_CONVERSATION_LIST,
	payload
})

export interface ConversationListFetchedAction {
	type: typeof ConversationListActionType.CONVERSATION_LIST_FETCHED;
	payload: FetchConversationListSuccess;
}

// 会话列表查询成功
export const conversationListFetched = (
	payload: FetchConversationListSuccess
): ConversationListFetchedAction => ({
	type: ConversationListActionType.CONVERSATION_LIST_FETCHED,
	payload
})

export interface ErrorFetchingConversationListAction {
	type: typeof ConversationListActionType.ERROR_FETCHING_CONVERSATION_LIST;
	payload: FetchConversationListError;
}

// 会话列表查询错误
export const errorFetchingConversationList = (
	payload: FetchConversationListError
): ErrorFetchingConversationListAction => ({
	type: ConversationListActionType.ERROR_FETCHING_CONVERSATION_LIST,
	payload
})

export interface ConversationReceivedAction {
	type: typeof ConversationListActionType.CONVERSATION_RECEIVED;
	payload: Conversation
}

// 收到会话信息
export const conversationReceived = (
	payload: Conversation
): ConversationReceivedAction => ({
	type: ConversationListActionType.CONVERSATION_RECEIVED,
	payload
})

export type ConversationListActions =
	| FetchingConversationListAction
	| ConversationListFetchedAction
	| ErrorFetchingConversationListAction
	| ConversationReceivedAction