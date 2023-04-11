import { useMemo } from 'react';
import { ChatStateContextValue } from '../../../context';
import { APIClient } from '../../../types';

interface CreateChatStateContextProp extends ChatStateContextValue {
  client?: APIClient,
}

function useCreateChatStateContext(props: CreateChatStateContextProp) {
  const {
    client,
    conversation,
    chatConfig,
    messageListRef,
    messageConfig,
    cloudCustomData,
    UIMessageInputConfig,
    UIMessageListConfig,
    ...state
  } = props;
  
  const chatStateContext = useMemo(() => ({
    client,
    conversation,
    chatConfig,
    messageListRef,
    messageConfig,
    cloudCustomData,
    UIMessageInputConfig,
    UIMessageListConfig,
    ...state,
  }), [
    client,
    conversation,
    chatConfig,
    messageListRef,
    messageConfig,
    cloudCustomData,
    UIMessageInputConfig,
    UIMessageListConfig,
    state,
  ]);

  return chatStateContext;
}

export default useCreateChatStateContext;