import { createSelector } from "reselect";
import { AppState } from "../types";
import { Contact, Conversation, Group, IMAccount } from "../../types";
import { CurrentConversationState } from "./reducers";

export const getCurrentConversationSlice = (state: AppState) => state.currentConversation;

// 是否正在查询当前会话数据
export const isFetchingCurrentConversation = createSelector(
	[getCurrentConversationSlice],
	(state: CurrentConversationState): boolean => {
		return !!state.conversationId || !!state.participantId;
	}
);

// 当前会话
export const getCurrentConversation = createSelector(
	[getCurrentConversationSlice],
	(state: CurrentConversationState): Conversation | null => {
		return state.conversation;
	}
);

// 当前会话的参与者
export const getCurrentParticipant = createSelector(
	[getCurrentConversationSlice],
	(state: CurrentConversationState): Contact | Group | null => {
		return state.participant;
	}
);

// 当前会话的归属账号
export const getCurrentAccount = createSelector(
	[getCurrentConversationSlice],
	(state: CurrentConversationState): IMAccount | null => {
		return state.account;
	}
);
