import React, {
  useCallback,
  ChangeEventHandler,
  useEffect,
  useRef,
} from 'react';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { MessageInputReducerAction } from './useMessageInputState';
import { filesData } from './useUploadPicker';
import { MessageType } from '../../../types';
import { useChatActionContext, useUIKit } from '../../../context';
import { UIMessageInputProps } from '../UIMessageInput';
import { MessageInputState } from './useMessageInputState';

export const useMessageInputText = (
  props: UIMessageInputProps & {
    sendUploadMessage?: (file: filesData, type: MessageType) => void; // XXX 这个不应该在这里吧?
    additionalTextareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>; // 本来应该在 UIMessageInputProps 中  
  },
  state: MessageInputState,
  dispatch: React.Dispatch<MessageInputReducerAction>,
) => {
  const {
    focus,
    sendUploadMessage,
    additionalTextareaProps,
  } = props;

  const { text } = state;

  const textareaRef = useRef<HTMLTextAreaElement>();

  // Focus
  useEffect(() => {
    if (focus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focus]);

  // Text + cursor position
  const newCursorPosition = useRef<number>();

  const insertText = useCallback(
    (textToInsert: string) => {
      const { maxLength } = additionalTextareaProps || {};

      if (!textareaRef.current) {
        dispatch({
          getNewText: (text) => {
            const updatedText = text + textToInsert;
            if (maxLength && updatedText.length > maxLength) {
              return updatedText.slice(0, maxLength);
            }
            return updatedText;
          },
          type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
        });
        return;
      }

      const { selectionEnd, selectionStart } = textareaRef.current;
      newCursorPosition.current = selectionStart + textToInsert.length;

      dispatch({
        getNewText: (prevText) => {
          const updatedText =
            prevText.slice(0, selectionStart) + textToInsert + prevText.slice(selectionEnd);

          if (maxLength && updatedText.length > maxLength) {
            return updatedText.slice(0, maxLength);
          }

          return updatedText;
        },
        type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
      });
    },
    [additionalTextareaProps, newCursorPosition, textareaRef],
  );

  useEffect(() => {
    const textareaElement = textareaRef.current;
    if (textareaElement && newCursorPosition.current !== undefined) {
      textareaElement.selectionStart = newCursorPosition.current;
      textareaElement.selectionEnd = newCursorPosition.current;
      newCursorPosition.current = undefined;
    }
  }, [text, newCursorPosition]);

  const { client } = useUIKit();
  const { sendMessage, createTextMessage, operateMessage } = useChatActionContext('UIMessageInput');


  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (!event || !event.target) {
        return;
      }
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
        getNewText: (text: string) => event.target.value,
      });
    },
    [client],
  );

  /*
  const handleKeyDown = useCallback(
    (event?:React.KeyboardEvent<EventTarget>) => {
      if (!event?.ctrlKey && enterCodeList.indexOf(event?.code) > -1 && event.keyCode === 13) {
        event?.preventDefault();
        handleSubmit(event);
      }
      if (event?.ctrlKey && enterCodeList.indexOf(event?.code) > -1 && event.keyCode === 13) {
        dispatch({
          type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
          getNewText: (text: string) => `${text}\n`,
        });
      }
    },
    [handleSubmit, dispatch],
  );*/

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent | any) => {
      e.preventDefault();
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      const { types, items } = e.clipboardData;
      types.find((type, index) => {
        const item = items[index];
        switch (type) {
          case 'text/plain':
            item.getAsString((str) => {
              dispatch({
                type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
                getNewText: (text:string) => `${text}${str}`,
              });
            });
            return true;
          case 'Files': {
            const file = item.getAsFile();
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
              sendUploadMessage({ file }, MessageType.Image);
            }
            return true;
          }
          default:
            return false;
        }
      });
    },
    [textareaRef],
  );

  const setText = useCallback((textToInsert: string) => {
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
        getNewText: () => `${textToInsert}`,
      });
      textareaRef?.current?.focus();
    },
    [textareaRef],
  );

  return {
    textareaRef,
    handleChange,
    handlePaste,
    insertText,
    setText,
  };
};