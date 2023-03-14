import { Dispatch, Reducer, useReducer } from 'react';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { UIMessageInputProps } from '../UIMessageInput';
import { useEmojiPicker } from './useEmojiPicker';
import { useMessageInputText } from './useMessageInputText';
import { useUploadPicker } from './useUploadPicker';
import { useEmojiIndex } from './useEmojiIndex';

export interface IbaseStateProps {
  state: MessageInputState,
  dispatch: Dispatch<MessageInputReducerAction>,
}

export interface MessageInputState {
  text?: string;
}

export interface ICursorPos {
  start?: number,
  end?: number,
}

type SetTextAction = {
  getNewText: (currentStateText: string) => string;
  type: CONSTANT_DISPATCH_TYPE.SET_TEXT;
};

export type MessageInputReducerAction =
  | SetTextAction;


/**
 * Initializes the state. Empty if the message prop is falsy.
 */
const initState = (
  message?: MessageInputState,
): MessageInputState => {
  return {
    // mentioned_users,
    text: message.text ?? '',
  };
}


const messageInputReducer = (
  state: MessageInputState, 
  action: MessageInputReducerAction,
) => {
  switch (action.type) {
    case CONSTANT_DISPATCH_TYPE.SET_TEXT:
      return { ...state, text: action?.getNewText(state.text) };
    default: return state;
  }
};

export const useMessageInputState = (props: UIMessageInputProps) => {
  const initialStateValue: MessageInputState = {
    text: '',
  };
  
  const [state, dispatch] = useReducer(
    messageInputReducer as Reducer<
      MessageInputState,
      MessageInputReducerAction
    >, 
    initialStateValue, 
    initState,
  );
  const { focus } = props;

  const {
    sendUploadMessage,
  } = useUploadPicker({
    state,
    dispatch,
  });

  const {
    textareaRef,
    handleChange,
    handleSubmit,
    handleKeyDown,
    handlePaste,
    insertText,
    setText,
  } = useMessageInputText({
    focus,
    sendUploadMessage,
  }, state, dispatch);

  const {
    onSelectEmoji,
    sendFaceMessage,
  } = useEmojiPicker({
    state,
    dispatch,
    textareaRef,
    insertText,
  });

  useEmojiIndex();


  return {
    ...state,
    handleChange,
    handleSubmit,
    handleKeyDown,
    handlePaste,
    onSelectEmoji,
    sendFaceMessage,
    sendUploadMessage,
    textareaRef,
    insertText,
    setText,
    focus,
  };
};