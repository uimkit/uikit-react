import invariant from "invariant";
import { Dispatch } from "redux";
import { t } from 'i18next';
import { AppState, AppThunkContext, ThunkAction } from "../types";
import { ContactListActionType, FetchContactListRequest } from "./actions";

/**
 * 查询服务商的所有联系人列表
 * 
 * @param provider 服务商
 * @param loadMore 是否查询更多，false 代表重新开始查询，true 代表基于之前的游标继续查询
 * @param limit 查询数量
 * @returns 
 */
export const fetchContactsByProvider = (provider: string, loadMore: boolean = false, limit: number = 50): ThunkAction<Promise<void[]>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void[]> => {
		const { client, onError } = context
		invariant(client, "requires client")
		// TODO 现在是前端自己便利所有账号查询，后续后端要提供接口
		const state = getState();
		const fetchings = state.accounts.accounts
			.filter(it => it.provider === provider)
			.map(it => {
				return (async () => {
					const cursor = state.contacts[it.id]?.cursor;
					const request: FetchContactListRequest = {
						account_id: it.id,
						direction: "after",
						cursor: (loadMore && cursor) ? cursor.end_cursor : "",
						limit
					}
					try {
						dispatch({
              type: ContactListActionType.FETCHING_CONTACT_LIST,
              payload: request
            });

            const response = await context.client.getContactList(request)
						dispatch({
              type: ContactListActionType.CONTACT_LIST_FETCHED,
              payload: { request, response }
            });
					} catch (e: unknown) {
						console.error("fetch contacts by provider error", e)
						dispatch({
              type: ContactListActionType.ERROR_FETCHING_CONTACT_LIST,
              payload: { request, error: e as Error }
            });

            onError && onError(e, t([
							`${provider}:chat:contacts:fetchListError`,
							"default:chat:contacts:fetchListError"
						]))
					}
				})()
			});
		return Promise.all(fetchings)
	}
}


/**
 * 查询账号的联系人列表
 * 
 * @param accountId 
 * @param loadMore 是否查询更多，false 代表重新开始查询，true 代表基于之前的游标继续查询
 * @param limit 
 * @returns 
 */
export const fetchContactsByAccount = (accountId: string, loadMore: boolean = false, limit: number = 50): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		const state = getState();
		const account = state.accounts.accounts.find(it => it.id === accountId)
		const cursor = state.contacts[accountId]?.cursor;
  
    console.log('上一次的cursor: ', cursor);

    const request: FetchContactListRequest = {
			account_id: accountId,
			direction: "after",
			cursor: (loadMore && cursor) ? cursor.end_cursor : "",
			limit
		}
		try {
			dispatch({
        type: ContactListActionType.FETCHING_CONTACT_LIST,
        payload: request
      });

      const response = await context.client.getContactList(request)

      dispatch({
        type: ContactListActionType.CONTACT_LIST_FETCHED,
        payload: { request, response }
      });
		} catch (e: unknown) {
			dispatch({
        type: ContactListActionType.ERROR_FETCHING_CONTACT_LIST,
        payload: { request, error: e as Error }
      });

      onError && onError(e, t([
				`${account?.provider}:chat:contacts:fetchListError`,
				"default:chat:contacts:fetchListError"
			]))
		}
	}
}