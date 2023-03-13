import { Conversation, CursorListExtra } from "../../types";
import { FetchConversationListRequest, FetchConversationListSuccess, ConversationListActions, ConversationListActionType, FetchConversationListError } from "./actions";


// 优先置顶，再按时间排序
const sortConversations = (a: Conversation, b: Conversation): number => {
	if (!!a.pinned === !!b.pinned) {
		return (b as any).active_at - (a as any).active_at
	}
	return !!a.pinned ? -1 : 1
}


export interface ConversationListIndexedByAccount {
	// 查询请求
	fetchingRequest?: FetchConversationListRequest | null;
	// 上一次查询的游标
	cursor?: CursorListExtra | null;
	// 会话列表
	conversations?: Conversation[];

  loading?: boolean;

  error?: Error;
}

export type ConversationListState = Record<string, ConversationListIndexedByAccount>

const createInitialState = (): ConversationListState => ({})

export const createConversationListReducer = () => (
	state: ConversationListState = createInitialState(),
	action: ConversationListActions
): ConversationListState => {
	switch (action.type) {
		case ConversationListActionType.FETCHING_CONVERSATION_LIST: {
			return handleFetchingConversationList(state, action.payload);
		}
		case ConversationListActionType.CONVERSATION_LIST_FETCHED: {
			return handleConversationListFetched(state, action.payload);
		}
		case ConversationListActionType.ERROR_FETCHING_CONVERSATION_LIST: {
			return handleErrorFetchingConversationList(state, action.payload);
		}
		case ConversationListActionType.CONVERSATION_RECEIVED: {
			return handleUpdateConversation(state, action.payload);
		}
    case ConversationListActionType.CONVERSATION_UPDATE: {
      return handleUpdateConversation(state, action.payload);
    }
		default:
			return state;
	}
}

const handleFetchingConversationList = (
	state: ConversationListState,
	payload: FetchConversationListRequest
): ConversationListState => {
	const { account_id } = payload;
	const stateByAccount = state[account_id] || newState();
	return {
		...state,
		[account_id]: {
			...stateByAccount,
			fetchingRequest: payload,
      loading: true,
		}
	}
}

const handleConversationListFetched = (
	state: ConversationListState,
	payload: FetchConversationListSuccess
): ConversationListState => {
	const { request, response } = payload;
	const { account_id, cursor } = request;
	const { data, extra } = response;
	const stateByAccount = state[account_id] || newState();
	const { conversations } = stateByAccount;
	const conversationIndexes = {};
	conversations.forEach((it, idx) => conversationIndexes[it.id] = idx);

	// 有游标是查询更多，追加结果；没有游标是重新查询，重置结果
	const results = !!cursor ? [...conversations] : [];
	data.forEach(it => {
		const idx = conversationIndexes[it.id]
		const conv = idx === undefined ? it : { ...conversations[idx], ...it }
		if (!!cursor && idx !== undefined) {
			results[idx] = conv
		} else {
			results.push(conv)
		}
	})

	// 排序
	results.sort(sortConversations)

	return {
		...state,
		[account_id]: {
			...stateByAccount,
			fetchingRequest: null,
      loading: false,
			cursor: extra,
			conversations: results
		}
	}
};

const handleErrorFetchingConversationList = (
	state: ConversationListState,
	payload: FetchConversationListError
): ConversationListState => {
	const { request, error } = payload;
	const { account_id } = request;
	const stateByAccount = state[account_id] || newState();
	return {
		...state,
		[account_id]: {
			...stateByAccount,
			fetchingRequest: null,
      error,
      loading: false,
		}
	}
}

const handleUpdateConversation = (
	state: ConversationListState,
	payload: Conversation,
): ConversationListState => {
  const { account } = payload;
	const stateByAccount = state[account] || newState();
	let { conversations } = stateByAccount;
	const idx = conversations.findIndex(it => it.id === payload.id)
	if (idx >= 0) {
		conversations[idx] = { ...conversations[idx], ...payload }
	} else {
		conversations.push(payload);
	}
	conversations.sort(sortConversations)
	conversations = [...conversations]
	return {
		...state,
		[account]: {
			...stateByAccount,
			conversations
		}
	}
}

const newState = (): ConversationListIndexedByAccount => ({
	fetchingRequest: null,
	cursor: null,
	conversations: []
});

const ConversationListReducer = createConversationListReducer()

export { ConversationListReducer }