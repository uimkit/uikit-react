import { Contact, Conversation, Group, IMAccount } from "../../types";
import { CurrentConversationActions, CurrentConversationActionType, CurrentConversationFetchedPayload } from './actions';

export interface CurrentConversationState {
	// 正在查询的会话ID
	conversationId: string | null;
	// 会话
	conversation: Conversation | null;
	// 归属账号
	account: IMAccount | null;
	// 正在查询的参与者ID
	participantId: string | null;
	// 参与者
	participant: Contact | Group | null;
}

const createInitialState = (): CurrentConversationState => ({
	conversationId: null,
	conversation: null,
	account: null,
	participantId: null,
	participant: null
})

export const createCurrentConversationReducer = () => (
	state: CurrentConversationState = createInitialState(),
	action: CurrentConversationActions
): CurrentConversationState => {
	switch (action.type) {
		case CurrentConversationActionType.FETCHING_CURRENT_CONVERSATION: {
			return fetchingCurrentConversation(state, action.payload);
		}
		case CurrentConversationActionType.FETCHING_CURRENT_CONVERSATION_BY_PARTICIPANT: {
			return fetchingCurrentConversationByParticipant(state, action.payload);
		}
		case CurrentConversationActionType.CURRENT_CONVERSATION_FETCHED: {
			return currentConversationFetched(state, action.payload);
		}
		case CurrentConversationActionType.LEAVE_CONVERSATION: {
			return leaveConversation(state);
		}
		default:
			return state;
	}
}

const fetchingCurrentConversation = (
	state: CurrentConversationState,
	conversationId: string
): CurrentConversationState => {
	return {
		...state,
		conversationId,
		conversation: null,
		account: null,
		participantId: null,
		participant: null
	};
}


const fetchingCurrentConversationByParticipant = (
	state: CurrentConversationState,
	participantId: string
): CurrentConversationState => {
	return {
		...state,
		conversationId: null,
		conversation: null,
		account: null,
		participantId,
		participant: null
	};
}

const currentConversationFetched = (
	state: CurrentConversationState,
	payload: CurrentConversationFetchedPayload
): CurrentConversationState => {
	const { conversationId, participantId } = state
	const { conversation, account, participant } = payload
	if (conversationId === conversation.id || participantId === participant.id) {
		return {
			...state,
			conversationId: null,
			conversation,
			account,
			participantId: null,
			participant
		}
	}
	return state
}

const leaveConversation = (
	state: CurrentConversationState
): CurrentConversationState => {
	return {
		...state,
		conversationId: null,
		conversation: null,
		account: null,
		participantId: null,
		participant: null
	}
}

const CurrentConversationReducer = createCurrentConversationReducer()

export { CurrentConversationReducer }