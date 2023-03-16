import {
  PropsWithChildren,
  useCallback,
} from 'react';
import type { IbaseStateProps } from './useMessageInputState';
import { useChatActionContext } from '../../../context';
import { MessageType } from '../../../types';

export interface filesData {
  file: HTMLInputElement | File
}

export function useUploadPicker<T extends IbaseStateProps>(props:PropsWithChildren<T>) {
  const {
    sendMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
    editLocalMessage,
  } = useChatActionContext();

  const createUploadMessage = {
    [MessageType.Image]: createImageMessage,
    [MessageType.Video]: createVideoMessage,
    [MessageType.File]: createFileMessage,
  };

  const sendUploadMessage = useCallback((data: filesData, type: MessageType) => {
    const { file } = data;
    const message = createUploadMessage[type]({
      file,
      onProgress(num: number) {
        console.log('onProgress: ', num);
        message.progress = num;
        editLocalMessage(message);
      },
    });
    sendMessage(message);
  }, [sendMessage]);

  return {
    sendUploadMessage,
  };
}