import { Contact } from "../../types";
import { ListContactsParameters, ListContactsResponse } from "../../types";

export enum ContactListActionType {
	FETCHING_CONTACT_LIST = "uim/FETCHING_CONTACT_LIST",
	CONTACT_LIST_FETCHED = "uim/CONTACT_LIST_FETCHED",
	ERROR_FETCHING_CONTACT_LIST = "uim/ERROR_FETCHING_CONTACT_LIST",
	CONTACT_RECEIVED = "uim/CONTACT_RECEIVED",
}

export type FetchContactListRequest = ListContactsParameters;

export type FetchContactListResponse = ListContactsResponse;

export interface FetchContactListError {
	request: FetchContactListRequest
	error: Error
};

export interface FetchContactListSuccess {
	request: FetchContactListRequest
	response: FetchContactListResponse
}

export interface FetchingContactListAction {
	type: typeof ContactListActionType.FETCHING_CONTACT_LIST;
	payload: FetchContactListRequest;
}

export interface ContactListFetchedAction {
	type: typeof ContactListActionType.CONTACT_LIST_FETCHED;
	payload: FetchContactListSuccess;
}

export interface ErrorFetchingContactListAction {
	type: typeof ContactListActionType.ERROR_FETCHING_CONTACT_LIST;
	payload: FetchContactListError;
}

export interface ContactReceivedAction {
	type: typeof ContactListActionType.CONTACT_RECEIVED;
	payload: Contact;
}

export const contactReceived = (
	payload: Contact
): ContactReceivedAction => ({
	type: ContactListActionType.CONTACT_RECEIVED,
	payload
})

export type ContactListActions =
	| FetchingContactListAction
	| ContactListFetchedAction
	| ErrorFetchingContactListAction
	| ContactReceivedAction
