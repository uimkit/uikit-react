import invariant from "invariant";
import { Dispatch } from "redux";
import { t } from 'i18next';
import { AppState, AppThunkContext, ThunkAction } from "../types";
import { accountFetched, accountListFetched, errorFetchingAccountList, fetchingAccountList } from "./actions";

/**
 * 查询指定账号
 * 
 * @param id 账号ID
 * @returns 
 */
export const fetchAccount = (id): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, _getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		try {
			const account = await client.retrieveIMAccount({ account_id: id, subscribe: true })
			dispatch(accountFetched(account))
		} catch (e: unknown) {
			console.error("fetch account error", e)
			onError && onError(e, t("default:chat:accounts:fetchError"))
		}
	}
}

/**
 * 查询全部账号
 * 
 * @param limit 翻页大小
 * @returns 
 */
export const fetchAllAccounts = (limit = 100): ThunkAction<Promise<void>> => {
	return async (dispatch: Dispatch, _getState: () => AppState, context: AppThunkContext): Promise<void> => {
		const { client, onError } = context
		invariant(client, "requires client")
		let offset = 0
		while (true) {
			const request = { offset, limit, subscribe: true }
			dispatch(fetchingAccountList(request))
			try {
				const response = await client.listIMAccounts(request)
				dispatch(accountListFetched({ request, response }))
				if (response.data.length < limit) {
					break
				} else {
					offset += limit
				}
			} catch (e: unknown) {
				dispatch(errorFetchingAccountList({ request, error: e as Error }))
				onError && onError(e, t("default:chat:accounts:fetchAllError"))
				break
			}
		}
	}
}