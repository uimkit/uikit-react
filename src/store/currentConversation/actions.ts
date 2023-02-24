import { Contact, Conversation, Group, IMAccount } from "../../types";

export enum CurrentConversationActionType {
	FETCHING_CURRENT_CONVERSATION = "uim/FETCHING_CURRENT_CONVERSATION",
	FETCHING_CURRENT_CONVERSATION_BY_PARTICIPANT = "uim/FETCHING_CURRENT_CONVERSATION_BY_PARTICIPANT",
	CURRENT_CONVERSATION_FETCHED = "uim/CURRENT_CONVERSATION_FETCHED",
	LEAVE_CONVERSATION = "uim/LEAVE_CONVERSATION"
};

export interface FetchingCurrentConversationAction {
	type: typeof CurrentConversationActionType.FETCHING_CURRENT_CONVERSATION;
	payload: string
}

/**
 * 开始查询当前会话
 * 
 * @param id 会话ID
 * @returns 
 */
export const fetchingCurrentConversation = (id: string): FetchingCurrentConversationAction => {
	return {
		type: CurrentConversationActionType.FETCHING_CURRENT_CONVERSATION,
		payload: id
	}
}

export interface FetchingCurrentConversationByParticipantAction {
	type: typeof CurrentConversationActionType.FETCHING_CURRENT_CONVERSATION_BY_PARTICIPANT;
	payload: string
}

/**
 * 开始根据参与者查询当前会话
 * 
 * @param id 参与者ID
 * @returns 
 */
export const fetchingCurrentConversationByParticipant = (id: string): FetchingCurrentConversationByParticipantAction => {
	return {
		type: CurrentConversationActionType.FETCHING_CURRENT_CONVERSATION_BY_PARTICIPANT,
		payload: id
	}
}

export interface CurrentConversationFetchedPayload {
	account?: IMAccount;
	conversation?: Conversation;
	participant?: Contact | Group;
}

export interface CurrentConversationFetchedAction {
	type: typeof CurrentConversationActionType.CURRENT_CONVERSATION_FETCHED;
	payload: CurrentConversationFetchedPayload;
};

/**
 * 查询当前会话成功 
 * 
 * @param payload 
 * @returns 
 */
export const currentConversationFetched = (payload: CurrentConversationFetchedPayload): CurrentConversationFetchedAction => {
	return {
		type: CurrentConversationActionType.CURRENT_CONVERSATION_FETCHED,
		payload: payload,
	};
};

export interface LeaveConversationAction {
	type: typeof CurrentConversationActionType.LEAVE_CONVERSATION;
}

/**
 * 离开当前会话
 * 
 * @returns 
 */
export const leaveConversation = (): LeaveConversationAction => {
	return {
		type: CurrentConversationActionType.LEAVE_CONVERSATION
	}
}

export type CurrentConversationActions =
	| FetchingCurrentConversationAction
	| FetchingCurrentConversationByParticipantAction
	| CurrentConversationFetchedAction
	| LeaveConversationAction
