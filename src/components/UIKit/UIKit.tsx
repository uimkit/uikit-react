import React, { useCallback, useMemo, useEffect, useState, PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import { UIChat } from "../UIChat";

import { createAppStore } from "../../store";
import { AppThunkContext } from "../../store/types";
import { createListeners } from "../../store/listener";
import { useDispatch } from "../../store/useDispatch";
import { ChatActionContextValue, ChatActionProvider, UIKitProvider, useUIKit } from "../../context";
import { notification } from 'antd';
import { APIClient, Conversation, Message } from '../../types';
import './styles/index.scss';
import { fetchConversationsByAccount } from '../../store/conversations';
import { UIAccountList } from '../UIAccountList';
import { UIConversationList } from '../UIConversationList';
import { useCreateMessage } from '../../hooks/useCreateMesage';



const appThunkContext: AppThunkContext = {
	// 全局的错误处理
	onError: (e: any, title?: string) => {
		notification.error({
			message: title,
			description: e.message,
			duration: 5
		})
	}
}
const store = createAppStore(appThunkContext)
const getState = store.getState.bind(store)


const UIKitInner: React.FC<PropsWithChildren<UIKitProps>> = (props) => {
  const { children, cloudCustomData } = props;

  const dispatch = useDispatch();
  const { client } = useUIKit();
  const [storeInited, setStoreInited] = useState(false);

  useEffect(() => {
    if (client) {
      appThunkContext.client = client;
      setStoreInited(true);

      createListeners(client, dispatch, getState);
    }
  }, [client]);


  const { activeConversation} = useUIKit();

  const {
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
  } = useCreateMessage({ client, activeConversation, cloudCustomData });




  const loadMoreConversations = useCallback(async (accountId: string) => {
    if (accountId) {
      dispatch(fetchConversationsByAccount(accountId))
    }
  }, []);

  const sendMessage = useCallback(async (message: Message, options?:any) => {
    // updateMessage([message]);
    try {
      // TODO sendMessage
      
      // editLocalmessage(message);
    } catch (error) {
      notification.error({ message: error });
      // editLocalmessage(message);
      throw new Error(error);
    }
  }, []);

  
  const chatActionContextValue = useMemo<ChatActionContextValue>(() => ({
    loadMoreConversations,
    sendMessage,
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
  }), [
    loadMoreConversations,
    sendMessage,
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
  ]);

  return (
    <ChatActionProvider value={chatActionContextValue}>
      {storeInited && (
        <div className="uim-kit">
          {children || (
            <>
              <UIAccountList />
              <UIConversationList />
              <UIChat />
            </>
          )}
        </div>
      )}
    </ChatActionProvider>
  );
};

export interface UIKitProps {
  client: APIClient;
  activeConversation?: Conversation;
  cloudCustomData?: string;
}

export function UIKit<T extends UIKitProps>(props: PropsWithChildren<T>) {
  const {
    client,
    activeConversation,
    children,
  } = props;
  
  const providerContextValue = useMemo(() => ({
    client,
    activeConversation,
  }), [client, activeConversation]);

  return (
    <UIKitProvider value={providerContextValue}>
      <ReduxProvider store={store} children={<UIKitInner {...props}>{children}</UIKitInner>} />
    </UIKitProvider>
  );
}
