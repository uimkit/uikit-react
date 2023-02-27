import { Dispatch, useReducer } from 'react';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { UIMessageInputProps } from '../UIMessageInput';
import { useEmojiPicker } from './useEmojiPicker';
import { useMessageInputText } from './useMessageInputText';
import { useUploadPicker } from './useUploadPicker';
import { useEmojiIndex } from './useEmojiIndex';
import { Message } from '../../../types';
import { ConsoleSqlOutlined } from '@ant-design/icons';

export interface IbaseStateProps {
  state: MessageInputState,
  dispatch: Dispatch<MessageInputReducerAction>,
}

export interface MessageInputState {
  text?: string;
  cursorPos?: ICursorPos;
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
  | SetTextAction
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_CURSOR_POS;
    value: ICursorPos
  }

const initialStateValue: MessageInputState = {
  text: '',
  cursorPos: {
    start: 0,
    end: 0,
  },
};


/**
 * Initializes the state. Empty if the message prop is falsy.
 */
const initState = (
  message?: Message,
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
    case CONSTANT_DISPATCH_TYPE.SET_CURSOR_POS:
      return { ...state, cursorPos: action?.value };
    default: return state;
  }
};

export const useMessageInputState = (props: UIMessageInputProps) => {
  const [state, dispatch] = useReducer(messageInputReducer, initialStateValue, initState);
  const { focus, textareaRef } = props;

  const {
    sendUploadMessage,
  } = useUploadPicker({
    state,
    dispatch,
  });

  const {
    handleChange,
    handleSubmit,
    handleKeyDown,
    handlePasete,
    insertText,
    setText,
    setCursorPos,
  } = useMessageInputText({
    state,
    dispatch,
    textareaRef,
    focus,
    sendUploadMessage,
  });

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
    handlePasete,
    onSelectEmoji,
    sendFaceMessage,
    sendUploadMessage,
    textareaRef,
    insertText,
    setText,
    focus,
    setCursorPos,
  };
};