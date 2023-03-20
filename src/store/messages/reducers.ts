import { Conversation, Cursor, Message } from "../../types";
import { FetchMessageListError, FetchMessageListRequest, FetchMessageListSuccess, MessageDeletedPayload, MessageListActions, ConversationActionType } from "./actions";

export interface ConversationState {
	// 查询新消息的游标
	prevCursor: Cursor | null;
  loadingMoreNewer: boolean;
  hasMoreNewer: boolean;

	// 查询历史消息的游标
	nextCursor: Cursor | null;
  loadingMore: boolean;
  hasMore: boolean;
  // 消息列表，历史消息在前
	messages: Message[];
  error?: Error;
  suppressAutoscroll: boolean;
  highlightedMessageId?: string;
}

// 消息状态根据会话聚合
export type MessageListState = Record<string, ConversationState>;

const createInitialState = (): MessageListState => ({})

export const createMessageListReducer = () => (
	state: MessageListState = createInitialState(),
	action: MessageListActions
): MessageListState => {
	switch (action.type) {
		// 查询消息列表
		case ConversationActionType.FETCHING_MESSAGE_LIST: {
			return handleFetchingMessageList(state, action.payload);
		}
		// loadMore
		case ConversationActionType.MESSAGE_LIST_LOAD_MORE_FINISHED: {
			return handleMessageListLoadMoreFinished(state, action.conversation, action.payload);
		}
    // loadMoreNewer
		case ConversationActionType.MESSAGE_LIST_LOAD_MORE_NEWER_FINISHED: {
			return handleMessageListLoadMoreNewerFinished(state, action.payload);
		}
		// 查询消息列表错误
		case ConversationActionType.ERROR_FETCHING_MESSAGE_LIST: {
			return handleErrorFetchingMessageList(state, action.payload);
		}
		// 收到消息
		case ConversationActionType.MESSAGE_RECEIVED: {
			return handleMessageReceived(state, action.payload);
		}
    case ConversationActionType.MESSAGE_UPDATE: {
      return handleMessageUpdate(state, action.payload);
    }
		// 删除消息
		case ConversationActionType.MESSAGE_DELETED: {
			return handleMessageDeleted(state, action.payload);
		}
    // 跳转到最新消息
    case ConversationActionType.JumpToLatestMessage: {
      return handleUpdateConversationState(state, action.conversation, {
        hasMoreNewer: false,
        highlightedMessageId: undefined,
        suppressAutoscroll: false,
      });
    }
    case ConversationActionType.JumpToMessageFinished: {
      return handleUpdateConversationState(state, action.conversation, { 
        hasMoreNewer: action.hasMoreNewer, 
        highlightedMessageId: action.highlightedMessageId,
      });
    }
    case ConversationActionType.ClearHighlightedMessage: {
      return handleUpdateConversationState(state, action.conversation, {
        highlightedMessageId: undefined,
      });
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
const handleFetchingMessageList = (
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
				nextCursor: payload.cursor,
        loadingMore: true,
  		},
		}
	} else {
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
        prevCursor: payload.cursor,
        loadingMoreNewer: true,
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
const handleMessageListLoadMoreFinished = (
	state: MessageListState,
	conversation: Pick<Conversation, 'id'>,
  payload: Pick<ConversationState, 'messages' | 'hasMore' | 'nextCursor'>,
): MessageListState => {
	const { messages: _incomingMessages, hasMore, nextCursor } = payload;
	const stateByConversation = state[conversation.id] || newState();
	let { messages } = stateByConversation;

  const incomingMessages = _incomingMessages.sort((a, b) => a.sent_at - b.sent_at)
  let newMessages;
  if (incomingMessages.length > 0) {
    newMessages = [...incomingMessages, ...messages];
  } else {
    newMessages = messages;
  }

  // 历史消息
  return {
    ...state,
    [conversation.id]: {
      ...stateByConversation,
      messages: newMessages,
      nextCursor,
      hasMore, // ?? extra.has_next,
      loadingMore: false,
      suppressAutoscroll: false,
    }
  }
};

/**
 * @param state 
 * @param payload 
 * @returns 
 */
 const handleMessageListLoadMoreNewerFinished = (
	state: MessageListState,
	payload: FetchMessageListSuccess
): MessageListState => {
	const { request, response } = payload;
	const { conversation_id } = request;
	const { data, extra } = response;
	const stateByConversation = state[conversation_id] || newState();
	let { messages } = stateByConversation;

	const incomingMessages = data.sort((a, b) => a.sent_at - b.sent_at)

  let newMessages;
  if (incomingMessages.length > 0) {
    newMessages = [...messages, ...incomingMessages];
  } else {
    newMessages = messages;
  }

  // 查询新消息
  return {
    ...state,
    [conversation_id]: {
      ...stateByConversation,
      messages: newMessages,
      prevCursor: extra.start_cursor,
      nextCursor: stateByConversation.nextCursor ?? extra.end_cursor,
      hasMoreNewer: false, // incomingMessages.length === extra.limit, //extra.has_previous,
      loadingMoreNewer: false,
      suppressAutoscroll: false,
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
const handleErrorFetchingMessageList = (
	state: MessageListState,
	payload: FetchMessageListError
): MessageListState => {
	const { request, error } = payload
	const { conversation_id, direction } = request
	const stateByConversation = state[conversation_id] || newState();
	// 查询结果是从新到旧，查更新的是 before，查历史的是 after
	if (direction === "after") {
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
        loadingMore: false,
        error,
			}
		}
	} else {
		return {
			...state,
			[conversation_id]: {
				...stateByConversation,
        loadingMoreNewer: false,
        error,
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
const handleMessageReceived = (
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

const handleMessageUpdate = (
	state: MessageListState,
	payload: Message,
): MessageListState => {
	const { conversation_id } = payload;
	const stateByConversation = state[conversation_id] || newState();
  const messages = [...(stateByConversation.messages ?? [])];

  // 存在就替换，不存在就追加
	const idx = messages.findIndex(it => it.id === payload.id)

  if (idx >= 0) {
		messages[idx] = { ...messages[idx], ...payload }
	} else {
		messages.push({...payload});
	}

  return {
		...state,
		[conversation_id]: {
			...stateByConversation,
			messages,
      suppressAutoscroll: false,
		}
	}
}

/**
 * 删除消息
 * 
 * @param state 
 * @param payload 
 */
const handleMessageDeleted = (
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

const handleUpdateConversationState = (
	state: MessageListState,
  conversation: Pick<Conversation, 'id'>,
  payload: Partial<ConversationState>,
): MessageListState => {
	const { id } = conversation;
	const stateByConversation = state[id] || newState();
	
  return {
		...state,
		[id]: {
			...stateByConversation,
      hasMoreNewer: false,
      highlightedMessageId: undefined,
      suppressAutoscroll: false,
    }
	}
}



export const newState = (): ConversationState => ({
	prevCursor: null,
  hasMoreNewer: false,
  loadingMoreNewer: false,	
	nextCursor: null,
  hasMore: true,
	loadingMore: false,
  messages: [],
  error: null,
  suppressAutoscroll: false,
});

const MessageListReducer = createMessageListReducer()

export { MessageListReducer }