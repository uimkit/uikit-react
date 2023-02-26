import { createSelector } from "reselect";
import first from 'lodash.first';
import flatten from 'lodash.flatten';
import { Contact, CursorListExtra } from "../../types";
import { AppState } from "../types";
import { AccountListState } from "../accounts";
import { ContactListIndexedByAccount, ContactListState } from "./reducers";



// 优先星标，再按时间排序
const sortContacts = (a: Contact, b: Contact): number => {
	if (!!a.marked === !!b.marked) {
		return b.created_at - a.created_at
	}
	return !!a.marked ? -1 : 1
}

const getContactListStateSlice = (state: AppState) => state.contacts;

const getAccountListStateSlice = (state: AppState) => state.accounts;

// 查询联系人信息
export const getContactById = (accountId: string, contactId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): Contact | null => {
		return state[accountId]?.contacts?.find(it => it.id === contactId) ?? null
	}
)


export const getContactsByAccountState = (accountId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): ContactListIndexedByAccount => {
		return state[accountId] ?? {};
	}
)

// 账号的联系人列表
export const getContactsByAccount = (accountId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): Contact[] => {
		return state[accountId]?.contacts ?? []
	}
)

// 账号的联系人游标
export const getContactsCursorByAccount = (accountId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): CursorListExtra => {
		return state[accountId]?.cursor ?? null
	}
)

// 账号是否有更多联系人
export const hasMoreContactsByAccount = (accountId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): boolean => {
		return state[accountId]?.cursor?.has_next ?? false
	}
)

export const errorGetContactsByAccount = (accountId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): Error => {
		return state[accountId]?.error;
	}
)

// 账号是否正在加载联系人
export const isFetchingContactsByAccount = (accountId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): boolean => {
		return !!state[accountId]?.fetchingRequest
	}
)

// 账号是否正在加载更多联系人
export const isFetchingMoreContactsByAccount = (accountId: string) => createSelector(
	[getContactListStateSlice],
	(state: ContactListState): boolean => {
		return !!state[accountId]?.fetchingRequest && !!state[accountId]?.fetchingRequest?.cursor
	}
)

// 服务商的联系人列表
export const getContactsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getContactListStateSlice],
	(
		accountListState: AccountListState,
		contactListState: ContactListState,
	): Contact[] => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		const contacts = flatten(accountIds.map(it => contactListState[it]?.contacts || []))
		contacts.sort(sortContacts)
		return contacts
	}
);

// 服务商的联系人游标
export const getContactsCursorByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getContactListStateSlice],
	(
		accountListState: AccountListState,
		contactListState: ContactListState,
	): CursorListExtra => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return first(accountIds.map(it => contactListState[it]?.cursor).filter(it => !!it))
	}
);

// 服务商是否有更多联系人
export const hasMoreContactsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getContactListStateSlice],
	(
		accountListState: AccountListState,
		contactListState: ContactListState,
	): boolean => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return accountIds.some(it => contactListState[it]?.cursor?.has_next ?? false);
	}
);

// 是否正在查询服务商的联系人
export const isFetchingContactsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getContactListStateSlice],
	(
		accountListState: AccountListState,
		contactListState: ContactListState,
	): boolean => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return accountIds.some(it => !!contactListState[it]?.fetchingRequest)
	}
)

// 是否正在加载服务商的更多联系人
export const isFetchingMoreContactsByProvider = (provider: string) => createSelector(
	[getAccountListStateSlice, getContactListStateSlice],
	(
		accountListState: AccountListState,
		contactListState: ContactListState,
	): boolean => {
		const accountIds = accountListState.accounts.filter(it => it.provider === provider).map(it => it.id)
		return accountIds.some(it => !!contactListState[it]?.fetchingRequest && !!contactListState[it]?.fetchingRequest?.cursor);
	}
)