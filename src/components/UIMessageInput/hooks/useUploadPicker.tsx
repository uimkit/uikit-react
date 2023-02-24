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
    updataUploadPenddingMessageList,
  } = useChatActionContext();

  const creatUploadMessage = {
    [MessageType.Image]: createImageMessage,
    [MessageType.Video]: createVideoMessage,
    [MessageType.File]: createFileMessage,
  };

  const sendUploadMessage = useCallback((file: filesData, type: MessageType) => {
    const message = creatUploadMessage[type]({
      payload: file,
      onProgress(num:number) {
        message.progress = num;
        updataUploadPenddingMessageList(message);
      },
    });
    sendMessage(message);
  }, [sendMessage]);

  return {
    sendUploadMessage,
  };
}