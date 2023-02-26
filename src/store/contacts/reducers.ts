import { Contact, CursorListExtra } from "../../types";
import { ContactListActions, ContactListActionType, FetchContactListError, FetchContactListRequest, FetchContactListSuccess } from "./actions";


// 优先星标，再按时间排序
const sortContacts = (a: Contact, b: Contact): number => {
	if (!!a.marked === !!b.marked) {
		return b.created_at - a.created_at
	}
	return !!a.marked ? -1 : 1
}


export interface ContactListIndexedByAccount {
	// 查询请求
	fetchingRequest: FetchContactListRequest | null;
	// 上一次查询的游标
	cursor: CursorListExtra | null;
	// 联系人列表
	contacts: Contact[];
}

export type ContactListState = Record<string, ContactListIndexedByAccount>

const createInitialState = (): ContactListState => ({})

export const createContactListReducer = () => (
	state: ContactListState = createInitialState(),
	action: ContactListActions
): ContactListState => {
	switch (action.type) {
		case ContactListActionType.FETCHING_CONTACT_LIST: {
			return fetchingContactList(state, action.payload);
		}
		case ContactListActionType.CONTACT_LIST_FETCHED: {
			return contactListFetched(state, action.payload);
		}
		case ContactListActionType.ERROR_FETCHING_CONTACT_LIST: {
			return errorFetchingContactList(state, action.payload);
		}
		case ContactListActionType.CONTACT_RECEIVED: {
			return contactReceived(state, action.payload);
		}
		default:
			return state;
	}
}

const fetchingContactList = (
	state: ContactListState,
	payload: FetchContactListRequest
): ContactListState => {
	const { account_id } = payload;
	const stateByAccount = state[account_id] || newState();
	return {
		...state,
		[account_id]: {
			...stateByAccount,
			fetchingRequest: payload
		}
	}
}

const contactListFetched = (
	state: ContactListState,
	payload: FetchContactListSuccess
): ContactListState => {
	const { request, response } = payload;
	const { account_id, cursor } = request;
	const { data, extra } = response;
	const stateByAccount = state[account_id] || newState();
	const { contacts } = stateByAccount;
	const contactIndexes = {};
	contacts.forEach((it, idx) => contactIndexes[it.id] = idx);

	// 有游标是查询更多，追加结果；没有游标是重新查询，重置结果
	const results = !!cursor ? [...contacts] : [];
	data.forEach(it => {
		const idx = contactIndexes[it.id]
		const c = idx === undefined ? it : { ...contacts[idx], ...it }
		if (!!cursor && idx !== undefined) {
			results[idx] = c
		} else {
			results.push(c)
		}
	})

	// 让后端排序，不要在前端排序
	// results.sort(sortContacts)

	return {
		...state,
		[account_id]: {
			...stateByAccount,
			fetchingRequest: null,
			cursor: extra,
			contacts: results
		}
	}
};

const errorFetchingContactList = (
	state: ContactListState,
	payload: FetchContactListError
): ContactListState => {
	const { request } = payload;
	const { account_id } = request;
	const stateByAccount = state[account_id] || newState();
	return {
		...state,
		[account_id]: {
			...stateByAccount,
			fetchingRequest: null,
		}
	}
}

const contactReceived = (
	state: ContactListState,
	payload: Contact
): ContactListState => {
	const { account } = payload;
	const stateByAccount = state[account] || newState();
	let { contacts } = stateByAccount;
	const idx = contacts.findIndex(it => it.id === payload.id)
	if (idx >= 0) {
		contacts[idx] = { ...contacts[idx], ...payload }
	} else {
		contacts.push(payload)
	}
	contacts.sort(sortContacts)
	contacts = [...contacts]
	return {
		...state,
		[account]: {
			...stateByAccount,
			contacts
		}
	}
}

const newState = (): ContactListIndexedByAccount => ({
	fetchingRequest: null,
	cursor: null,
	contacts: []
});

const ContactListReducer = createContactListReducer()

export { ContactListReducer }