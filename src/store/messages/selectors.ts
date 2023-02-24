import { createSelector } from "reselect";
import { AppState } from "../types";
import { Message } from "../../types";
import { MessageListState } from "./reducers";

const getMessageListStateSlice = (state: AppState) => state.messages;

/**
 * 获取会话的消息列表
 */
export const getMessagesInConversation = (conversationId: string) => createSelector(
	[getMessageListStateSlice],
	(state: MessageListState): Message[] => {
		return state[conversationId]?.messages ?? []
	}
);

/**
 * 会话是否正在查询历史消息
 */
export const isFetchingHistoryMessagesInConversation = (conversationId: string) => createSelector(
	[getMessageListStateSlice],
	(state: MessageListState): boolean => {
		return !!state[conversationId]?.fetchingHistoryRequest
	}
);

/**
 * 会话是否正在查询新消息
 */
export const isFetchingNewMessagesInConversation = (conversationId: string) => createSelector(
	[getMessageListStateSlice],
	(state: MessageListState): boolean => {
		return !!state[conversationId]?.fetchingNewRequest
	}
);

/**
 * 会话是否正在查询消息，包括历史消息和新消息
 */
export const isFetchingMessagesInConversation = (conversationId: string) => createSelector(
	[getMessageListStateSlice],
	(state: MessageListState): boolean => {
		return !!state[conversationId]?.fetchingNewRequest || !!state[conversationId]?.fetchingHistoryRequest
	}
);

/**
 * 会话是否有更多历史消息
 */
export const hasMoreHistoryMessagesInConversation = (conversationId: string) => createSelector(
	[getMessageListStateSlice],
	(state: MessageListState): boolean => {
		const stateByConversation = state[conversationId]
		// 还未查询，认为还有消息
		if (!stateByConversation || !stateByConversation.fetchingHistoryCursor) return true;
		// 查询结果从新到旧
		return stateByConversation.fetchingHistoryCursor.has_next
	}
);

/**
 * 会话是否有更多新消息
 */
export const hasNewMessagesInConversation = (conversationId: string) => createSelector(
	[getMessageListStateSlice],
	(state: MessageListState): boolean => {
		const stateByConversation = state[conversationId]
		// 还未查询，认为还有消息
		if (!stateByConversation || !stateByConversation.fetchingNewCursor) return true;
		// 查询结果从新到旧
		return stateByConversation.fetchingNewCursor.has_previous
	}
);