import { Dispatch, MutableRefObject, Reducer, useCallback, useReducer } from 'react';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { UIMessageInputProps } from '../UIMessageInput';
import { useEmojiPicker } from './useEmojiPicker';
import { useMessageInputText } from './useMessageInputText';
import { useUploadPicker } from './useUploadPicker';
import { useEmojiIndex } from './useEmojiIndex';
import { Profile } from '../../../types';
import { MessageInputContextValue } from '../../../context';
import { useSubmitHandler } from './useSubmitHandler';

export interface IbaseStateProps {
  state: MessageInputState,
  dispatch: Dispatch<MessageInputReducerAction>,
}

export interface MessageInputState {
  text?: string;
  mentioned_users?: Profile[];
  setText?: (text: string) => void;
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
  insertText: (textToInsert: string) => void;
  handleChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: (event: React.BaseSyntheticEvent) => void;
  onPaste: (event: React.ClipboardEvent | any) => void;
  onSelectEmoji: (emoji: any) => void;
  /*
  closeEmojiPicker: React.MouseEventHandler<HTMLElement>;
  emojiPickerRef: React.MutableRefObject<HTMLDivElement | null>;
  handleEmojiKeyDown: React.KeyboardEventHandler<HTMLSpanElement>;
  isUploadEnabled: boolean;
  maxFilesLeft: number;
  numberOfUploads: number;
  */
  onSelectUser: (item: Profile) => void;
  /*
  openEmojiPicker: React.MouseEventHandler<HTMLSpanElement>;
  removeFile: (id: string) => void;
  removeImage: (id: string) => void;
  uploadFile: (id: string) => void;
  uploadImage: (id: string) => void;
  uploadNewFiles: (files: FileList | File[]) => void;
  */
  textareaRef?: MutableRefObject<HTMLTextAreaElement | null | undefined>;
};


type AddMentionedUserAction = {
  type: CONSTANT_DISPATCH_TYPE.ADD_MENTIONED_USER;
  user: Profile;
};

type ClearAction = {
  type: 'clear';
};

export type MessageInputReducerAction =
  | SetTextAction
  | ClearAction
  | AddMentionedUserAction;


const makeEmptyMessageInputState = (): MessageInputState => ({
  mentioned_users: [],
  setText: () => null,
  text: '',
});

/**
 * Initializes the state. Empty if the message prop is falsy.
 */
const initState = (
  state?: MessageInputState,
): MessageInputState => {
  if (!state) {
    return makeEmptyMessageInputState();
  }

  return {
    mentioned_users: state.mentioned_users ?? [],
    text: state.text ?? '',
    setText: () => null,
  };
}


const messageInputReducer = (
  state: MessageInputState, 
  action: MessageInputReducerAction,
) => {
  switch (action.type) {
    case CONSTANT_DISPATCH_TYPE.SET_TEXT:
      return { ...state, text: action?.getNewText(state.text) };
    case CONSTANT_DISPATCH_TYPE.CLEAR:
      return makeEmptyMessageInputState();
    case CONSTANT_DISPATCH_TYPE.ADD_MENTIONED_USER:
      return {
        ...state,
        mentioned_users: state.mentioned_users.concat(action.user),
      };
    default: return state;
  }
};

export const useMessageInputState = (props: UIMessageInputProps): MessageInputState & MessageInputHookProps & MessageInputContextValue => {
  const { focus, additionalTextareaProps, message } = props;

  const defaultValue = additionalTextareaProps?.defaultValue;

  const initialStateValue: MessageInputState = message ? 
    {
      text: message.text,
      mentioned_users: message.mentioned_users,
    } :
    ((Array.isArray(defaultValue)
      ? { text: defaultValue.join('') }
      : { text: defaultValue?.toString() }));

  const [state, dispatch] = useReducer(
    messageInputReducer as Reducer<
      MessageInputState,
      MessageInputReducerAction
    >, 
    initialStateValue, 
    initState,
  );

  const {
    sendUploadMessage,
  } = useUploadPicker({
    state,
    dispatch,
  });

  const {
    textareaRef,
    handleChange,
    handlePaste,
    insertText,
    setText,
  } = useMessageInputText({
    ...props,
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

  const { handleSubmit } = useSubmitHandler(
    props,
    state,
    dispatch,
  );

  const onSelectUser = useCallback((item: Profile) => {
    dispatch({ type: CONSTANT_DISPATCH_TYPE.ADD_MENTIONED_USER, user: item });
  }, []);

  return {
    ...state,
    handleChange,
    handleSubmit,
    onSelectUser,
    onPaste: handlePaste,
    onSelectEmoji,
    sendFaceMessage,
    sendUploadMessage,
    textareaRef,
    insertText,
    setText,
    focus,
  };
};