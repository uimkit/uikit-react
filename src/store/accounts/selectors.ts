import { createSelector } from "reselect";
import { IMAccount } from "../../types";
import { AppState } from "../types";
import { AccountListState } from "./reducers";

const getAccountListStateSlice = (state: AppState) => state.accounts;

// 获取所有账号
export const getAccounts = createSelector(
	[getAccountListStateSlice],
	(state: AccountListState): IMAccount[] => {
		return state.accounts;
	}
)

// 是否正在查询账号列表
export const isFetchingAccounts = createSelector(
	[getAccountListStateSlice],
	(state: AccountListState): boolean => {
		return !!state.fetchingRequest;
	}
);

// 是否查询更多账号
export const isFetchingMoreAccounts = createSelector(
	[getAccountListStateSlice],
	(state: AccountListState): boolean => {
		return !!state.fetchingRequest && !!state.fetchingRequest.offset;
	}
)

// useSelector 依赖状态，需要为每个 compoenent 创建自己的实例
// 参考：
// https://react-redux.js.org/api/hooks#using-memoizing-selectors
// https://github.com/reduxjs/reselect#q-can-i-share-a-selector-across-multiple-component-instances

// 获取账号详情
export const getAccountById = (id: string) => createSelector(
	[getAccountListStateSlice],
	(state: AccountListState) => {
		return state.accounts.find(it => it.id === id) ?? null
	}
)

// 获取服务商的账号列表
export const getAccountsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice],
	(state: AccountListState) => {
		return state.accounts.filter(it => it.provider === provider)
	}
)

// 获取开通的服务商
export const getProviders = createSelector(
	[getAccountListStateSlice],
	(state: AccountListState) => {
		return new Set(state.accounts.map(it => it.provider))
	}
)