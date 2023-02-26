import { IMAccount } from '../../types';
import { AccountListActions, AccountListActionType, FetchAccountListRequest, FetchAccountListSuccess } from "./actions";

export interface AccountListState {
	// 查询账号列表的请求
	fetchingRequest: FetchAccountListRequest | null;
	// 账号列表
	accounts: IMAccount[];
}

const createInitialState = (): AccountListState => ({
	fetchingRequest: null,
	accounts: []
})

export const createAccountListReducer = () => (
	state: AccountListState = createInitialState(),
	action: AccountListActions
): AccountListState => {
	switch (action.type) {
		case AccountListActionType.ACCOUNT_FETCHED: {
			return handleAccountFetched(state, action.payload);
		}
		case AccountListActionType.FETCHING_ACCOUNT_LIST: {
			return handleFetchingAccountList(state, action.payload);
		}
		case AccountListActionType.ACCOUNT_LIST_FETCHED: {
			return handleAccountListFetched(state, action.payload);
		}
		case AccountListActionType.ERROR_FETCHING_ACCOUNT_LIST: {
			return { ...state, fetchingRequest: null };
		}
		default:
			return state;
	}
}

const handleAccountFetched = (
	state: AccountListState,
	payload: IMAccount
): AccountListState => {
	let { accounts } = state;
	const idx = accounts.findIndex(it => it.id === payload.id)
	if (idx < 0) {
		accounts.push(payload)
	} else {
		accounts[idx] = { ...accounts[idx], ...payload }
	}
	accounts.sort((a, b) => b.created_at - a.created_at)
	accounts = [...accounts]
	return {
		...state,
		accounts
	}
}

const handleFetchingAccountList = (
	state: AccountListState,
	payload: FetchAccountListRequest
): AccountListState => {
	return { ...state, fetchingRequest: payload };
}


const handleAccountListFetched = (
	state: AccountListState,
	payload: FetchAccountListSuccess
): AccountListState => {
	const { accounts } = state
	const { request, response } = payload
	const { offset } = request
	const { data } = response
	const accountIndexes = {};
	accounts.forEach((it, idx) => accountIndexes[it.id] = idx);

	// 有offset是查询更多，追加结果；没有offset是重新查询，重置结果
	const results = !!offset ? [...accounts] : [];
	data.forEach(it => {
		const idx = accountIndexes[it.id]
		const acct = idx === undefined ? it : { ...accounts[idx], ...it }
		if (!!offset && idx !== undefined) {
			results[idx] = acct
		} else {
			results.push(acct)
		}
	})

	// 排序
	results.sort((a, b) => b.created_at - a.created_at)

	return {
		...state,
		fetchingRequest: null,
		accounts: results
	}
};

const AccountListReducer = createAccountListReducer()

export { AccountListReducer }