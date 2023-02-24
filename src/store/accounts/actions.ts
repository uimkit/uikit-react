import { IMAccount, ListIMAccountsParameters, ListIMAccountsResponse } from '../../types';

export enum AccountListActionType {
	ACCOUNT_FETCHED = "uim/ACCOUNT_FETCHED",
	FETCHING_ACCOUNT_LIST = "uim/FETCHING_ACCOUNT_LIST",
	ACCOUNT_LIST_FETCHED = "uim/ACCOUNT_LIST_FETCHED",
	ERROR_FETCHING_ACCOUNT_LIST = "uim/ERROR_FETCHING_ACCOUNT_LIST",
}

export interface AccountFetchedAction {
	type: typeof AccountListActionType.ACCOUNT_FETCHED;
	payload: IMAccount
}

export const accountFetched = (payload: IMAccount): AccountFetchedAction => ({
	type: AccountListActionType.ACCOUNT_FETCHED,
	payload
})

export type FetchAccountListRequest = ListIMAccountsParameters

export type FetchAccountListResponse = ListIMAccountsResponse

export interface FetchAccountListError {
	request: FetchAccountListRequest
	error: Error
}

export interface FetchAccountListSuccess {
	request: FetchAccountListRequest
	response: FetchAccountListResponse
}

export interface FetchingAccountListAction {
	type: typeof AccountListActionType.FETCHING_ACCOUNT_LIST;
	payload: FetchAccountListRequest;
}

export const fetchingAccountList = (
	payload: FetchAccountListRequest
): FetchingAccountListAction => ({
	type: AccountListActionType.FETCHING_ACCOUNT_LIST,
	payload
})

export interface AccountListFetchedAction {
	type: typeof AccountListActionType.ACCOUNT_LIST_FETCHED;
	payload: FetchAccountListSuccess;
}

export const accountListFetched = (
	payload: FetchAccountListSuccess
): AccountListFetchedAction => ({
	type: AccountListActionType.ACCOUNT_LIST_FETCHED,
	payload
})

export interface ErrorFetchingAccountListAction {
	type: typeof AccountListActionType.ERROR_FETCHING_ACCOUNT_LIST;
	payload: FetchAccountListError;
}

export const errorFetchingAccountList = (
	payload: FetchAccountListError
): ErrorFetchingAccountListAction => ({
	type: AccountListActionType.ERROR_FETCHING_ACCOUNT_LIST,
	payload
})

export type AccountListActions =
	| AccountFetchedAction
	| FetchingAccountListAction
	| AccountListFetchedAction
	| ErrorFetchingAccountListAction
