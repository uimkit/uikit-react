import { combineReducers } from "redux";

import { AccountListReducer } from "./accounts";
import { ConversationListReducer } from './conversations';
import { CurrentConversationReducer } from "./currentConversation";
import { MessageListReducer } from "./messages";
import { ContactListReducer } from "./contacts";
import { ChatStateReducer } from "./chatState";

/**
 * Combine all of the reducers in this application
 */
const rootReducer = combineReducers({
  accounts: AccountListReducer,
  conversations: ConversationListReducer,
  currentConversation: CurrentConversationReducer,
  messages: MessageListReducer,
  contacts: ContactListReducer,
  chatState: ChatStateReducer,
});

export default rootReducer;

/**
 * RootState describes the shape of the global Redux store in this application
 */
export type RootState = Readonly<ReturnType<typeof rootReducer>>;
