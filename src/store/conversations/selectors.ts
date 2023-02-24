import { createSelector } from "reselect";
import first from 'lodash.first';
import flatten from 'lodash.flatten';
import some from 'lodash.some';

import { Conversation, ConversationType, CursorListExtra } from "../../types";
import { AppState } from "../types";
import { AccountListState } from "../accounts";
import { ConversationListState } from "./reducers";



// 优先置顶，再按时间排序
const sortConversations = (a: Conversation, b: Conversation): number => {
	if (!!a.pinned === !!b.pinned) {
		return (b as any).active_at - (a as any).active_at
	}
	return !!a.pinned ? -1 : 1
}


const getConversationListStateSlice = (state: AppState) => state.conversations;

const getAccountListStateSlice = (state: AppState) => state.accounts;

// 查询会话信息
export const getConversationById = (id: string) => createSelector(
	[getConversationListStateSlice],
	(state: ConversationListState): Conversation | null => {
		for (let accountId in state) {
			const conversations = state[accountId].conversations
			for (let i in conversations) {
				const conv = conversations[i]
				if (conv.id === id) {
					return conv
				}
			}
		}
		return null
	}
)

export const getConversationByParticipant = (account: string, type: ConversationType, participant: string) => createSelector(
	[getConversationListStateSlice],
	(state: ConversationListState): Conversation | null => {
		return state[account]?.conversations?.find(it => it.account === account && it.type === type && it.participant === participant) ?? null
	}
)

// 账号的会话列表
export const getConversationsByAccount = (accountId: string) => createSelector(
	[getConversationListStateSlice],
	(state: ConversationListState): Conversation[] => {
		return state[accountId]?.conversations ?? []
	}
)

// 账号的会话游标
export const getConversationsCursorByAccount = (accountId: string) => createSelector(
	[getConversationListStateSlice],
	(state: ConversationListState): CursorListExtra => {
		return state[accountId]?.cursor ?? null
	}
)

// 账号是否有更多会话
export const hasMoreConversationsByAccount = (accountId: string) => createSelector(
	[getConversationListStateSlice],
	(state: ConversationListState): boolean => {
		return state[accountId]?.cursor?.has_next ?? false
	}
)

// 是否正在加载账号的会话
export const isFetchingConversationsByAccount = (accountId: string) => createSelector(
	[getConversationListStateSlice],
	(state: ConversationListState): boolean => {
		return !!state[accountId]?.fetchingRequest
	}
)

// 账号是否正在加载更多会话
export const isFetchingMoreConversationsByAccount = (accountId: string) => createSelector(
	[getConversationListStateSlice],
	(state: ConversationListState): boolean => {
		return !!state[accountId]?.fetchingRequest && !!state[accountId]?.fetchingRequest?.cursor
	}
)

// 服务商的会话列表
export const getConversationsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getConversationListStateSlice],
	(
		accountListState: AccountListState,
		conversationListState: ConversationListState,
	): Conversation[] => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		const conversations = flatten(accountIds.map(it => conversationListState[it]?.conversations || []))
		conversations.sort(sortConversations)
		return conversations
	}
);

// 服务商的会话游标
export const getConversationsCursorByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getConversationListStateSlice],
	(
		accountListState: AccountListState,
		conversationListState: ConversationListState,
	): CursorListExtra => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return first(accountIds.map(it => conversationListState[it]?.cursor).filter(it => !!it)) ?? null
	}
);

// 服务商是否有更多会话
export const hasMoreConversationsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getConversationListStateSlice],
	(
		accountListState: AccountListState,
		conversationListState: ConversationListState,
	): boolean => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return some(accountIds, it => conversationListState[it]?.cursor?.has_next || false)
	}
);

// 是否正在查询服务商的会话
export const isFetchingConversationsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getConversationListStateSlice],
	(
		accountListState: AccountListState,
		conversationListState: ConversationListState,
	): boolean => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return some(accountIds, it => !!conversationListState[it]?.fetchingRequest)
	}
)

// 是否正在加载服务商的更多会话
export const isFetchingMoreConversationsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getConversationListStateSlice],
	(
		accountListState: AccountListState,
		conversationListState: ConversationListState,
	): boolean => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return some(accountIds, it => !!conversationListState[it]?.fetchingRequest && !!conversationListState[it]?.fetchingRequest?.cursor)
	}
)