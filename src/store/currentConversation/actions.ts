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

export interface LeaveConversationAction {
	type: typeof CurrentConversationActionType.LEAVE_CONVERSATION;
}

export type CurrentConversationActions =
	| FetchingCurrentConversationAction
	| FetchingCurrentConversationByParticipantAction
	| CurrentConversationFetchedAction
	| LeaveConversationAction
