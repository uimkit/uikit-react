import { useCallback, useEffect, useState } from 'react';
import { Conversation, ConversationType, Message } from '../types';
import { useUIKit } from '../context';

export interface CreateMessageProps {
  conversation?: Conversation,
  to?: string,
  type?: ConversationType,
  cloudCustomData?: string,
}
export interface BasicCreateMessageProps {
  needReadReceipt?: boolean,
  onProgress?: (num:number) => void,
  cloudCustomData?: string;
  receiverList?: Array<string>;
}

export interface CreateTextMessageProps extends BasicCreateMessageProps{
  payload: {
    text: string
  }
}

export interface CreateFaceMessageProps extends BasicCreateMessageProps{
  payload: {
    index: number,
    data: string,
  }
}

export interface CreateUploadMessageProps extends BasicCreateMessageProps{
  payload: {
    file: HTMLInputElement | File,
  }
}

export interface CreateForwardMessageProps extends BasicCreateMessageProps{
  conversation: Conversation,
  message: Message
}

export interface CreateCustomMessageProps extends BasicCreateMessageProps{
  payload: {
    data: string,
    description: string,
    extension: string,
  }
}

export interface CreateTextAtMessageProps extends BasicCreateMessageProps{
  payload: {
    text: string,
    atUserList: Array<string>,
  }
}

export interface CreateLocationMessageProps extends BasicCreateMessageProps{
  payload: {
    description: string,
    longitude: number,
    latitude: number,
  }
}

export interface CreateMergerMessageProps extends BasicCreateMessageProps{
  payload: {
    messageList: Array<Message>,
    title: string,
    abstractList: string,
    compatibleText: string,
  }
}

export function useCreateMessage<T extends CreateMessageProps>(props:T) {
  const {
    conversation,
    to = '',
    type: propType,
    cloudCustomData,
  } = props;

  const { client } = useUIKit();

  const { type: conversationType } = conversation ?? {};

  const type = propType || conversationType;

  const [basicConfig, setBasicConfig] = useState({
    to: to || (type === ConversationType.Private ? conversation?.id : conversation?.id),
    conversationType: type,
    cloudCustomData,
  });

  useEffect(() => {
    basicConfig.cloudCustomData = cloudCustomData;
    setBasicConfig(basicConfig);
  }, [cloudCustomData]);

  const createTextMessage = useCallback((params: CreateTextMessageProps) => client.createTextMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createFaceMessage = useCallback((params: CreateFaceMessageProps) => client.createFaceMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createImageMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => client.createImageMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createVideoMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => client.createVideoMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createFileMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => client.createFileMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  /*
  const createForwardMessage = useCallback((
    params: CreateForwardMessageProps,
  ) => {
    const { conversation: forwardConversation, message, ...other } = params;
    const {
      type: forwardType,
      userProfile: forwardUserProfile,
      groupProfile: forwardGroupProfile,
    } = forwardConversation;

    const forwardTo = forwardType === ConversationType.Private
      ? forwardUserProfile?.userID : forwardGroupProfile?.groupID;
  
    return client.createForwardMessage({
      to: forwardTo,
      conversationType: forwardType,
      payload: message,
      ...other,
    });
  }, [client]);
  */

  const createCustomMessage = useCallback((
    params: CreateCustomMessageProps,
    // ChatSDK < V2.26.0 createCustomMessage ts declaration error
  ) => client.createCustomMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createAudioMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => client.createAudioMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createTextAtMessage = useCallback((
    params: CreateTextAtMessageProps,
  ) => client.createTextAtMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createLocationMessage = useCallback((
    params: CreateLocationMessageProps,
  ) => client.createLocationMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  const createMergerMessage = useCallback((
    params: CreateMergerMessageProps,
  ) => client.createMergerMessage({
    ...basicConfig,
    ...params,
  }), [client]);

  return {
    createTextMessage,
    createFaceMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
    // createForwardMessage,
    createCustomMessage,
    createAudioMessage,
    createTextAtMessage,
    createLocationMessage,
    createMergerMessage,
  };
}