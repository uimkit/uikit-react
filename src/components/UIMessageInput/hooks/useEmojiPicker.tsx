import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
} from 'react';
import { emojiEnKey } from '../../UIMessage/utils/emojiMap';
import type { IbaseStateProps } from './useMessageInputState';
import { useChatActionContext } from '../../../context';

export interface EmojiData {
  index: number,
  data: string,
}

interface useEmojiPickerProps extends IbaseStateProps {
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  insertText?: (textToInsert: string) => void
}

export function useEmojiPicker<T extends useEmojiPickerProps>(props:PropsWithChildren<T>) {
  const {
    textareaRef,
    insertText,
  } = props;

  const { sendMessage, createFaceMessage } = useChatActionContext('useEmojiPicker');

  const onSelectEmoji = (emoji:EmojiData) => {
    insertText(emojiEnKey[emoji.data]);
  };

  const sendFaceMessage = useCallback((emoji:EmojiData) => {
    const message = createFaceMessage({
      payload: emoji,
    });
    sendMessage(message);
  }, []);

  return {
    onSelectEmoji,
    sendFaceMessage,
  };
}