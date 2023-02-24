import { Dispatch } from "redux";
import { AppState, AppThunkContext, ThunkAction } from "../types";
import { ChatStateActionType } from "./actions";
import { ChatState } from "./reducers";

export const updateChatState = (newState: ChatState): ThunkAction<void> => {
	return (dispatch: Dispatch, getState: () => AppState, context: AppThunkContext) => {   
    dispatch({
      type: ChatStateActionType.Change,
      payload: newState,
    });
	}
}