import { createSelector } from "reselect";
import { AppState } from "../../store/types";
import { ChatState } from "./reducers";


export const _getChatState = (state: AppState) => state.chatState;

// 获取所有账号
export const getChatState = createSelector(
	[_getChatState],
	(state: ChatState): ChatState  => {
    return state;
	}
)