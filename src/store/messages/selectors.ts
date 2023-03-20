import { createSelector } from "reselect";
import { AppState } from "../types";
import { ConversationState, MessageListState, newState } from "./reducers";

const getMessageListStateSlice = (state: AppState) => state.messages;

/**
 * 获取会话的消息列表
 */
export const getConversationState = (conversationId: string) => createSelector(
	[getMessageListStateSlice],
	(state: MessageListState): ConversationState => {
		const s = state[conversationId];
    return s ?? newState();    
	}
);