import { combineReducers } from "redux";

import { AccountListReducer } from "./accounts";
import { ConversationListReducer } from './conversations';
import { MessageListReducer } from "./messages";
import { ContactListReducer } from "./contacts";
import { CommonReducer } from "./common/reducers";

/**
 * Combine all of the reducers in this application
 */
const rootReducer = combineReducers({
  common: CommonReducer,
  accounts: AccountListReducer,
  conversations: ConversationListReducer,
  messages: MessageListReducer,
  contacts: ContactListReducer,
});

export default rootReducer;

/**
 * RootState describes the shape of the global Redux store in this application
 */
export type RootState = Readonly<ReturnType<typeof rootReducer>>;
