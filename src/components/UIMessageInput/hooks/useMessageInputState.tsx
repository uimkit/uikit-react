import { Dispatch, Reducer, useCallback, useReducer } from 'react';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { UIMessageInputProps } from '../UIMessageInput';
import { useEmojiPicker } from './useEmojiPicker';
import { useMessageInputText } from './useMessageInputText';
import { useUploadPicker } from './useUploadPicker';
import { useEmojiIndex } from './useEmojiIndex';
import { Profile } from '../../../types';
import { MessageInputContextValue } from '../../../context';

export interface IbaseStateProps {
  state: MessageInputState,
  dispatch: Dispatch<MessageInputReducerAction>,
}

export interface MessageInputState {
  text?: string;
  mentioned_users: Profile[];
  setText: (text: string) => void;
}

export interface ICursorPos {
  start?: number,
  end?: number,
}

type SetTextAction = {
  getNewText: (currentStateText: string) => string;
  type: CONSTANT_DISPATCH_TYPE.SET_TEXT;
};



export type MessageInputHookProps = {
  /*
  handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: (
    event: React.BaseSyntheticEvent,
  ) => void;*/
  // onPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onSelectEmoji: (emoji: any) => void;

  /*
  closeEmojiPicker: React.MouseEventHandler<HTMLElement>;
  emojiPickerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleEmojiKeyDown: React.KeyboardEventHandler<HTMLSpanElement>;
  insertText: (textToInsert: string) => void;
  isUploadEnabled: boolean;
  maxFilesLeft: number;
  numberOfUploads: number;
  */
  onSelectUser: (item: Profile) => void;
  /*
  openEmojiPicker: React.MouseEventHandler<HTMLSpanElement>;
  removeFile: (id: string) => void;
  removeImage: (id: string) => void;
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | null | undefined>;
  uploadFile: (id: string) => void;
  uploadImage: (id: string) => void;
  uploadNewFiles: (files: FileList | File[]) => void;
  */
};


type AddMentionedUserAction = {
  type: 'addMentionedUser';
  user: Profile;
};


export type MessageInputReducerAction =
  | SetTextAction
  | AddMentionedUserAction;


/**
 * Initializes the state. Empty if the message prop is falsy.
 */
const initState = (
  message?: MessageInputState,
): MessageInputState => {
  return {
    mentioned_users: [],
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
    case 'addMentionedUser':
      return {
        ...state,
        mentioned_users: state.mentioned_users.concat(action.user),
      };
    default: return state;
  }
};

export const useMessageInputState = (props: UIMessageInputProps): MessageInputState & MessageInputHookProps & MessageInputContextValue => {
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

  const onSelectUser = useCallback((item: Profile) => {
    dispatch({ type: 'addMentionedUser', user: item });
  }, []);

  return {
    ...state,
    handleChange,
    handleSubmit,
    onSelectUser,
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