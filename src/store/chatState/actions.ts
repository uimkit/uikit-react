import { ChatState } from "./reducers";

export enum ChatStateActionType {
	Change = "chat_state/change",
};

export interface ChangeAction {
	type: typeof ChatStateActionType.Change;
	payload: ChatState,
}

export type ChatStateActions =
	| ChangeAction;