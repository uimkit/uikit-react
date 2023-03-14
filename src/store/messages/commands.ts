
import invariant from "invariant";
import { Dispatch } from "redux";
import { t } from "i18next";
import { AppState, AppThunkContext, ThunkAction } from "../types";
import { Message, GetMessageListParameters } from "../../types";
import { MessageListActionType } from "./actions";
import { ConversationListActionType } from "../conversations";
import last from "lodash.last";

/**
 * 更新已经存在的消息
 * 
 * @param message 
 * @returns 
 */
export const updateMessage = (message: Message): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
    dispatch({
      type: MessageListActionType.MESSAGE_UPDATE,
      payload: message,
    });
	}
}

/**
 * 删除消息(local)
 * 
 * @param message 
 * @returns 
 */
 export const deleteMessageLocal = (message: Message): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		dispatch({
      type: MessageListActionType.MESSAGE_DELETED,
      payload: message,
    });

    // 更新会话摘要
    const { conversations, messages } = getState()
    const accountId = message.account
    const conversationId = message.conversation_id
    const conversation = conversations[accountId]?.conversations?.find(it => it.id === conversationId)
    if (conversation?.last_message?.id === message.id) {
      const lastMessage = last(messages[conversationId]?.messages ?? [])
      conversation.last_message = lastMessage
      conversation.active_at = lastMessage?.sent_at ?? conversation.created_at
      dispatch({
        type: ConversationListActionType.CONVERSATION_UPDATE,
        payload: conversation
      });
    }
	}
}

/**
 * 重发消息
 * 
 * @param message 
 * @returns 
 */
export const resendMessage = (message: Message): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const client = getState().common.client;
    const { onError } = context;
		invariant(client, "requires client");
		const newMessage: Message = {
			...message,
			sent_at: new Date().getTime(),
			sending: true,
			succeeded: false,
			failed: false,
			failed_reason: ""
		}
		try {
			// 先更新本地消息状态 
			dispatch({
        type: MessageListActionType.MESSAGE_RECEIVED,
        payload: newMessage,
      });

			// 重发消息
			const sendResp = await client.resendMessage({ message_id: message.id })

			// 错误提示
			if (sendResp.failed && onError) {
				onError(new Error(sendResp.failed_reason), t("default:chat:messages:resendError"))
			}

		} catch (e: unknown) {
			// 发送消息失败
			console.error("resend message error ", e)
			onError && onError(e, t("default:chat:messages:resendError"))
			dispatch({
        type: MessageListActionType.MESSAGE_RECEIVED,
        payload: {
          ...newMessage,
          sending: false,
          succeeded: false,
          failed: true,
          failed_reason: ''
        },
      });
		}
	}
}

/**
 * 查询新消息
 * 
 * @param conversationId 会话ID
 */
export const fetchConversationNewMessages = (conversationId: string, limit = 50): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const client = getState().common.client;
    const { onError } = context;
		invariant(client, "requires client");

		const state = getState().messages[conversationId];
		if (state?.fetchingNewRequest) return

		// 查询结果是从新到旧，因此查更新的是 before
		const request: GetMessageListParameters = {
			conversation_id: conversationId,
			direction: 'before',
			cursor: state?.fetchingNewCursor?.start_cursor ?? '',
			limit,
		}

		try {
			dispatch({
        type: MessageListActionType.FETCHING_MESSAGE_LIST,
        payload: request,
      });

      const response = await client.getMessageList(request)
			dispatch({
        type: MessageListActionType.MESSAGE_LIST_FETCHED,
        payload: { request, response },
      });
		} catch (e: unknown) {
			dispatch({
        type: MessageListActionType.ERROR_FETCHING_MESSAGE_LIST,
        payload: { request, error: e as Error },
      });

      onError && onError(e, t("default:chat:messages:fetchListError"))
		}
	}
}


/**
 * 查询历史消息
 * 
 * @param conversationId 会话ID 
 */
export const fetchConversationHistoryMessages = (conversationId: string, limit = 50): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
    const client = getState().common.client;
    const { onError } = context;
		invariant(client, "requires client");

		const state = getState().messages[conversationId];
		if (state?.fetchingHistoryRequest) return;

		// 查询结果是从新到旧，因此查历史的是 after
		const request: GetMessageListParameters = {
			conversation_id: conversationId,
			direction: 'after',
			cursor: state?.fetchingHistoryCursor?.end_cursor ?? '',
			limit,
		}

		try {
			dispatch({
        type: MessageListActionType.FETCHING_MESSAGE_LIST,
        payload: request,
      });

      const response = await client.getMessageList(request)
			dispatch({
        type: MessageListActionType.MESSAGE_LIST_FETCHED,
        payload: { request, response },
      });
		} catch (e: unknown) {
			dispatch({
        type: MessageListActionType.ERROR_FETCHING_MESSAGE_LIST,
        payload: { request, error: e as Error },
      });

      onError && onError(e, t("default:chat:messages:fetchListError"))
		}
	}
}