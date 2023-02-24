import invariant from "invariant";
import { Dispatch } from "redux";
import { t } from "i18next";
import { AppState, AppThunkContext, ThunkAction } from "@/store/types";
import { conversationListFetched, errorFetchingConversationList, FetchConversationListRequest, fetchingConversationList } from "./actions";

/**
 * 查询服务商的所有会话列表
 * 
 * @param provider 服务商
 * @param loadMore 是否查询更多，false 代表重新开始查询，true 代表基于之前的游标继续查询
 * @param limit 查询数量
 * @returns 
 */
export const fetchConversationsByProvider = (provider: string, loadMore: boolean = false, limit: number = 50): ThunkAction<Promise<void[]>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void[]> => {
		const { client, onError } = context
		invariant(client, "requires client")
		// TODO 现在是前端自己便利所有账号查询，后续后端要提供接口
		const state = getState();
		const fetchings = state.accounts.accounts
			.filter(it => it.provider === provider)
			.map(it => {
				return (async () => {
					const cursor = state.conversations[it.id]?.cursor;
					const request: FetchConversationListRequest = {
						account_id: it.id,
						direction: "after",
						cursor: (loadMore && cursor) ? cursor.end_cursor : "",
						limit
					}
					try {
						dispatch(fetchingConversationList(request))
						const response = await client.listConversations(request)
						dispatch(conversationListFetched({ request, response }))
					} catch (e: unknown) {
						console.error("fetch conversations by provider error", e)
						dispatch(errorFetchingConversationList({ request, error: e as Error }))
						onError && onError(e, t([
							`${provider}:chat:conversations:fetchListError`,
							"default:chat:conversations:fetchListError"
						]))
					}
				})()
			});

		return Promise.all(fetchings)
	}
}

/**
 * 查询账号的会话列表
 * 
 * @param accountId
 * @param loadMore 是否查询更多，false 代表重新开始查询，true 代表基于之前的游标继续查询
 * @param limit
 * @returns 
 */
export const fetchConversationsByAccount = (accountId: string, loadMore: boolean = false, limit: number = 50): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		const state = getState();
		const account = state.accounts.accounts.find(it => it.id === accountId)
		const cursor = state.conversations[accountId]?.cursor;
		const request: FetchConversationListRequest = {
			account_id: accountId,
			direction: "after",
			cursor: (loadMore && cursor) ? cursor.end_cursor : "",
			limit
		}
		try {
			dispatch(fetchingConversationList(request))
			const response = await client.listConversations(request)
			dispatch(conversationListFetched({ request, response }))
		} catch (e: unknown) {
			console.error("fetch conversations by account error", e)
			dispatch(errorFetchingConversationList({ request, error: e as Error }))
			onError && onError(e, t([
				`${account?.provider}:chat:conversations:fetchListError`,
				"default:chat:conversations:fetchListError"
			]))
		}
	}
}