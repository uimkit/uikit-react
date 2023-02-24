import { Ref } from 'react';
import { UIMessageInputBasicProps } from '../../components';
import { ChatStateActionType, ChatStateActions } from './actions';

export interface ChatState {
  textareaRef?: any;
  messageListRef?: Ref;
  messageInputConfig?: UIMessageInputBasicProps;
  operateData?: any;
  highlightedMessageId?: string;
  UIMessageInputConfig?: any; // TODO
}

const createInitialState = (): ChatState => ({
  operateData: {},
})

export const createChatStateReducer = () => (
	state: ChatState = createInitialState(),
	action: ChatStateActions
): ChatState => {
	switch (action.type) {
		case ChatStateActionType.Change: {
			return handleChange(state, action.payload);
		}
		default:
			return state;
	}
}

const handleChange = (
	state: ChatState,
	newState: ChatState,
): ChatState => {
	return {
		...state,
		...newState,
	};
}

const ChatStateReducer = createChatStateReducer()

export { ChatStateReducer }