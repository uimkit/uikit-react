import invariant from "invariant";
import { Dispatch } from "redux";
import { t } from "i18next";
import { AppState, AppThunkContext, ThunkAction } from "../types";
import { ConversationListActionType, FetchConversationListRequest } from "./actions";
import { Conversation } from "../../types";

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
		const client = getState().common.client;    
    const { onError } = context;
		invariant(client, "requires client")
		const state = getState();
		const account = state.accounts.accounts.find(it => it.id === accountId)
		const cursor = state.conversations[accountId]?.cursor;
		const request: FetchConversationListRequest = {
			account_id: accountId,
			direction: "after",
			cursor: (loadMore && cursor) ? cursor.end_cursor : "",
			limit,
		}
		try {
			dispatch({
        type: ConversationListActionType.FETCHING_CONVERSATION_LIST,
        payload: request,
      });

      const response = await client.getConversationList(request)
			dispatch({
        type: ConversationListActionType.CONVERSATION_LIST_FETCHED,
        payload: { request, response },
      });
		} catch (e: unknown) {
			console.error("fetch conversations by account error", e)
			dispatch({
        type: ConversationListActionType.ERROR_FETCHING_CONVERSATION_LIST,
        payload: { request, error: e as Error },
      });

			onError && onError(e, t([
				`${account?.provider}:chat:conversations:fetchListError`,
				"default:chat:conversations:fetchListError"
			]))
		}
	}
}

/**
 * 更新会话, 没有就插入
 * @param accountId 
 * @param loadMore 
 * @param limit 
 * @returns 
 */
export const updateConversation = (conversation: Partial<Conversation>): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
    dispatch({
      type: ConversationListActionType.CONVERSATION_UPDATE,
      payload: conversation,
    });
  }
}