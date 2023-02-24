import invariant from "invariant";
import { Dispatch } from "redux";
import { t } from "i18next";
import { AppState, AppThunkContext, ThunkAction } from "../types";
import { ConversationType, Contact, Group } from "../../types";
import { currentConversationFetched, fetchingCurrentConversation, fetchingCurrentConversationByParticipant, leaveConversation } from "./actions";
import { conversationReceived } from "../conversations";

/**
 * 进入私聊会话
 * 
 * @param accountId 
 * @param userId 
 * @returns 
 */
export const enterPrivateConversation = (accountId: string, userId: string): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, _getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		try {
			// 先离开之前的会话
			dispatch(leaveConversation())

			// 开始进入会话
			dispatch(fetchingCurrentConversationByParticipant(userId))

			// 获取当前会话信息
			const [conversation, account, participant] = await Promise.all([
				client.retrieveContactConversation({ account_id: accountId, user_id: userId }),
				client.retrieveIMAccount({ account_id: accountId }),
				client.retrieveContact({ account_id: accountId, user_id: userId }),
			])

			conversation.unread = 0
			dispatch(currentConversationFetched({ conversation, account, participant }))
			dispatch(conversationReceived(conversation))

			// 清除未读数，异步处理即可
			client.resetConversationUnread({ conversation_id: conversation.id })

		} catch (e: unknown) {
			console.error("enter private conversation errro", e)
			onError && onError(e, t("default:chat:conversations:fetchError"))
		}
	}
}

/**
 * 进入指定会话
 * 
 * @param id 会话ID 
 * @returns 
 */
export const enterConversation = (id: string): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, _getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		try {
			// 先离开之前的会话
			dispatch(leaveConversation())

			// 开始进入会话
			dispatch(fetchingCurrentConversation(id))

			// 获取当前会话信息
			const conversation = await client.retrieveConversation({ conversation_id: id })
			const account = await client.retrieveIMAccount({ account_id: conversation.account })
			let participant: Contact | Group
			if (conversation.type === ConversationType.Private) {
				participant = await client.retrieveContact({ account_id: conversation.account, user_id: conversation.participant })
			} else if (conversation.type === ConversationType.Group) {
				participant = await client.retrieveGroup({ account_id: conversation.account, group_id: conversation.participant })
			}

			conversation.unread = 0
			dispatch(currentConversationFetched({ conversation, account, participant }))
			dispatch(conversationReceived(conversation))

			// 清除未读数，异步处理即可
			client.resetConversationUnread({ conversation_id: conversation.id })

		} catch (e: unknown) {
			console.error("enter conversation errro", e)
			onError && onError(e, t("default:chat:conversations:fetchError"))
		}
	}
}