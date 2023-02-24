import { Dispatch } from "redux";
import { APIClient } from '../types';
// import { createMessageListListener } from "../messages/listener";
// import { createConversationListListener } from "../conversations/listener";
import { AppState } from "./types";

export const createListeners = (client: APIClient, dispatch: Dispatch, getState: () => AppState) => {
	// createMessageListListener(client, dispatch, getState)
	// createConversationListListener(client, dispatch, getState)
}