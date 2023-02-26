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

export interface ConversationListFetchedAction {
	type: typeof ConversationListActionType.CONVERSATION_LIST_FETCHED;
	payload: FetchConversationListSuccess;
}

export interface ErrorFetchingConversationListAction {
	type: typeof ConversationListActionType.ERROR_FETCHING_CONVERSATION_LIST;
	payload: FetchConversationListError;
}

export interface ConversationReceivedAction {
	type: typeof ConversationListActionType.CONVERSATION_RECEIVED;
	payload: Conversation
}

export type ConversationListActions =
	| FetchingConversationListAction
	| ConversationListFetchedAction
	| ErrorFetchingConversationListAction
	| ConversationReceivedAction