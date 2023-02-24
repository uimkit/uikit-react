
import invariant from "invariant";
import { Dispatch } from "redux";
import { t } from "i18next";
import { AppState, AppThunkContext, ThunkAction } from "../types";
import { Message, ListMessagesParameters, SendMessageToConversationParameters } from "../../types";
import { errorFetchingMessageList, fetchingMessageList, messageDeleted, messageListFetched, messageReceived } from "./actions";
import { conversationReceived, getConversationById } from "../conversations";
import last from "lodash.last";

/**
 * 更新消息
 * 
 * @param message 
 * @returns 
 */
export const updateMessage = (message: Message): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, _getState: () => AppState, _context: AppThunkContext): Promise<void> => {
		dispatch(messageReceived(message))
	}
}

/**
 * 删除消息
 * 
 * @param message 
 * @returns 
 */
export const deleteMessage = (message: Message): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		try {
			dispatch(messageDeleted(message))

			// 更新会话摘要
			const { conversations, messages } = getState()
			const accountId = message.account
			const conversationId = message.conversation_id
			const conversation = conversations[accountId]?.conversations?.find(it => it.id === conversationId)
			if (conversation?.last_message?.id === message.id) {
				const lastMessage = last(messages[conversationId]?.messages ?? [])
				conversation.last_message = lastMessage
				conversation.active_at = lastMessage?.sent_at ?? conversation.created_at
				dispatch(conversationReceived(conversation))
			}

			await client.deleteMessage({ message_id: message.id })

		} catch (e: unknown) {
			console.error("delete message error", e)
			onError && onError(e, t("default:chat:messages:deleteError"))
		}
	}
}

/**
 * 发送消息
 * 
 * @param message 
 * @returns 
 */
export const sendMessage = (message: Message): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		try {
			// 本地先追加消息
			dispatch(messageReceived(message))

			// 发送
			const sendReq: SendMessageToConversationParameters = {
				conversation_id: message.conversation_id,
				type: message.type,
				text: message.text,
				image: message.image,
				voice: message.voice,
				video: message.video,
			}
			const sendResp = await client.sendMessage(sendReq, (_accountId, evt) => {
				// 因为前端是用的临时id，这里需要用推送的消息替换前端的，这样变成真实id
				onMessageSent(dispatch, getState, message, evt.data)
			})
			onMessageSent(dispatch, getState, message, sendResp)

			// 错误提示
			if (sendResp.failed && onError) {
				onError(new Error(sendResp.failed_reason), t("default:chat:messages:sendError"))
			}

		} catch (e: unknown) {
			// 发送消息失败
			console.error("send message to conversation error", e)
			onError && onError(e, t("default:chat:messages:sendError"))
			dispatch(messageReceived({
				...message,
				sending: false,
				succeeded: false,
				failed: true,
				failed_reason: ''
			}))
		}
	}
}

const onMessageSent = (dispatch: Dispatch, getState: () => AppState, localMessage: Message, message: Message) => {
	// 用后端返回的消息替换掉前端展示的
	const newMessage = { ...localMessage, ...message }
	dispatch(messageDeleted({ id: localMessage.id, conversation_id: localMessage.conversation_id }))
	dispatch(messageReceived(newMessage))

	// 更新前端的会话摘要和排序
	const conversation = getConversationById(localMessage.conversation_id)(getState())
	conversation.last_message = newMessage
	conversation.active_at = newMessage.sent_at
	dispatch(conversationReceived(conversation))
}

/**
 * 重发消息
 * 
 * @param message 
 * @returns 
 */
export const resendMessage = (message: Message): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
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
			dispatch(messageReceived(newMessage))

			// 重发消息
			const sendResp = await client.resendMessage({ message_id: message.id })
			onMessageSent(dispatch, getState, newMessage, sendResp)

			// 错误提示
			if (sendResp.failed && onError) {
				onError(new Error(sendResp.failed_reason), t("default:chat:messages:resendError"))
			}

		} catch (e: unknown) {
			// 发送消息失败
			console.error("resend message error ", e)
			onError && onError(e, t("default:chat:messages:resendError"))
			dispatch(messageReceived({
				...newMessage,
				sending: false,
				succeeded: false,
				failed: true,
				failed_reason: ''
			}))
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
		const { client, onError } = context
		invariant(client, "requires client")

		const state = getState().messages[conversationId];
		if (state?.fetchingNewRequest) return

		// 查询结果是从新到旧，因此查更新的是 before
		const request: ListMessagesParameters = {
			conversation_id: conversationId,
			direction: 'before',
			cursor: state?.fetchingNewCursor?.start_cursor ?? '',
			limit,
		}

		try {
			dispatch(fetchingMessageList(request))
			const response = await client.listMessages(request)
			dispatch(messageListFetched({ request, response }))
		} catch (e: unknown) {
			dispatch(errorFetchingMessageList({ request, error: e as Error }))
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
		const { client, onError } = context
		invariant(client, "requires client")

		const state = getState().messages[conversationId];
		if (state?.fetchingHistoryRequest) return

		// 查询结果是从新到旧，因此查历史的是 after
		const request: ListMessagesParameters = {
			conversation_id: conversationId,
			direction: 'after',
			cursor: state?.fetchingHistoryCursor?.end_cursor ?? '',
			limit,
		}

		try {
			dispatch(fetchingMessageList(request))
			const response = await client.listMessages(request)
			dispatch(messageListFetched({ request, response }))
		} catch (e: unknown) {
			dispatch(errorFetchingMessageList({ request, error: e as Error }))
			onError && onError(e, t("default:chat:messages:fetchListError"))
		}
	}
}