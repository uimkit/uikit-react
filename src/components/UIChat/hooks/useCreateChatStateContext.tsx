import { useMemo } from 'react';
import { ChatStateContextValue } from '../../../context';
import { APIClient } from '../../../types';

interface CreateChatStateContextProp extends ChatStateContextValue {
  client?: APIClient,
}

function useCreateChatStateContext(props: CreateChatStateContextProp) {
  const {
    client,
    messageListRef,
    messageConfig,
    cloudCustomData,
    UIMessageInputConfig,
    UIMessageListConfig,
    ...state
  } = props;
  
  const chatStateContext = useMemo(() => ({
    client,
    messageListRef,
    messageConfig,
    cloudCustomData,
    UIMessageInputConfig,
    UIMessageListConfig,
    ...state,
  }), [
    client,
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