import { CursorListExtra, Message } from "../../types";
import { FetchMessageListError, FetchMessageListRequest, FetchMessageListSuccess, MessageDeletedPayload, MessageListActions, MessageListActionType } from "./actions";

export interface MessageListIndexedByConversation {
	// 查询历史消息的请求
	fetchingHistoryRequest: FetchMessageListRequest | null;
	// 查询历史消息的游标
	fetchingHistoryCursor: CursorListExtra | null;
	// 查询新消息的请求
	fetchingNewRequest: FetchMessageListRequest | null;
	// 查询新消息的游标
	fetchingNewCursor: CursorListExtra | null;
	// 消息列表，历史消息在前
	messages: Message[];
}

// 消息状态根据会话聚合
export type MessageListState = Record<string, MessageListIndexedByConversation>;

const createInitialState = (): MessageListState => ({})

export const createMessageListReducer = () => (
	state: MessageListState = createInitialState(),
	action: MessageListActions
): MessageListState => {
	switch (action.type) {
		// 查询消息列表
		case MessageListActionType.FETCHING_MESSAGE_LIST: {
			return fetchingMessageList(state, action.payload);
		}
		// 查询消息列表完成
		case MessageListActionType.MESSAGE_LIST_FETCHED: {
			return messageListFetched(state, action.payload);
		}
		// 查询消息列表错误
		case MessageListActionType.ERROR_FETCHING_MESSAGE_LIST: {
			return errorFetchingMessageList(state, action.payload);
		}
		// 收到消息
		case MessageListActionType.MESSAGE_RECEIVED: {
			return messageReceived(state, action.payload);
		}
		// 删除消息
		case MessageListActionType.MESSAGE_DELETED: {
			return messageDeleted(state, action.payload);
		}
		default:
			return state;
	}
}

/**
 * 查询列表消息
 * 
 * @param state 
 * @param payload 
 * @returns 
 */
const fetchingMessageList = (
	state: MessageListState,
	payload: FetchMessageListRequest
): MessageListState => {
	const { conversation_id, direction } = payload
	const stateByConversation = state[conversation_id] || newState()
	// 查询结果是从新到旧，查更新的是 before，查历史的是 after
	if (direction === "after") {
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
				fetchingHistoryRequest: payload,
			},
		}
	} else {
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
				fetchingNewRequest: payload,
			}
		}
	}
};

/**
 * 查询消息列表结果
 * 
 * @param state 
 * @param payload 
 * @returns 
 */
const messageListFetched = (
	state: MessageListState,
	payload: FetchMessageListSuccess
): MessageListState => {
	const { request, response } = payload;
	const { conversation_id, direction } = request;
	const { data, extra } = response;
	const stateByConversation = state[conversation_id] || newState();
	let { messages } = stateByConversation;

	if (data.length > 0) {
		// 存在就替换，不存在就追加
		data.forEach(it => {
			const idx = messages.findIndex(it2 => it2.id === it.id)
			if (idx >= 0) {
				// 用查询的数据覆盖本地的，这样前端自己扩展的字段并不会被覆盖
				messages[idx] = { ...messages[idx], ...it }
			} else {
				messages.push(it)
			}
		})
		// 前端是从旧到新
		messages.sort((a, b) => a.sent_at - b.sent_at)
		// 这里要clone一下，否则相同的引用认为没更新
		messages = [...messages]
	}

	if (direction === "after") {
		// 查询历史消息
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
				fetchingHistoryRequest: null,
				fetchingHistoryCursor: extra,
				messages
			}
		}
	} else {
		// 查询新消息
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
				fetchingNewRequest: null,
				fetchingNewCursor: extra,
				messages
			}
		}
	}
};

/**
 * 查询消息列表错误
 * 
 * @param state 
 * @param payload 
 * @returns 
 */
const errorFetchingMessageList = (
	state: MessageListState,
	payload: FetchMessageListError
): MessageListState => {
	const { request } = payload
	const { conversation_id, direction } = request
	const stateByConversation = state[conversation_id] || newState();
	// 查询结果是从新到旧，查更新的是 before，查历史的是 after
	if (direction === "after") {
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
				fetchingHistoryRequest: null
			}
		}
	} else {
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
				fetchingNewRequest: null
			}
		}
	}
}

/**
 * 收到消息
 * 
 * @param state 
 * @param payload 
 * @returns 
 */
const messageReceived = (
	state: MessageListState,
	payload: Message
): MessageListState => {
	const { conversation_id } = payload;
	const stateByConversation = state[conversation_id] || newState();
	const { messages } = stateByConversation;
	// 存在就替换，不存在就追加
	const idx = messages.findIndex(it => it.id === payload.id)
	if (idx >= 0) {
		messages[idx] = { ...messages[idx], ...payload }
	} else {
		messages.push(payload)
	}
	// 前端是从旧到新
	messages.sort((a, b) => a.sent_at - b.sent_at)
	return {
		...state,
		[conversation_id]: {
			...stateByConversation,
			messages: [...messages]
		}
	}
}

/**
 * 删除消息
 * 
 * @param state 
 * @param payload 
 */
const messageDeleted = (
	state: MessageListState,
	payload: MessageDeletedPayload
): MessageListState => {
	const { conversation_id } = payload;
	const stateByConversation = state[conversation_id] || newState();
	const { messages } = stateByConversation;
	// 存在就替换，不存在就追加
	const idx = messages.findIndex(it => it.id === payload.id)
	if (idx < 0) {
		return state
	}
	messages.splice(idx, 1)
	return {
		...state,
		[conversation_id]: {
			...stateByConversation,
			messages: [...messages]
		}
	}
}

const newState = (): MessageListIndexedByConversation => ({
	fetchingNewRequest: null,
	fetchingNewCursor: null,
	fetchingHistoryRequest: null,
	fetchingHistoryCursor: null,
	messages: []
});

const MessageListReducer = createMessageListReducer()

export { MessageListReducer }