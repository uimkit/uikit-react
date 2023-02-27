import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
} from 'react';
import type { IbaseStateProps } from './useMessageInputState';
import { useChatActionContext } from '../../../context';
import { Emoji } from '@emoji-mart/data';

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

  const onSelectEmoji = useCallback((emoji: any) => {
    insertText(emoji.native);
    textareaRef?.current?.focus();
  }, [insertText]);

  const sendFaceMessage = useCallback((emoji: Emoji) => {
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