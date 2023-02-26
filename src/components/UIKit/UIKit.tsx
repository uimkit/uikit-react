import React, { useCallback, useMemo, useEffect, useState, PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import { UIChat } from "../UIChat";

import { createAppStore } from "../../store";
import { AppThunkContext } from "../../store/types";
import { createListeners } from "../../store/listener";
import { useDispatch } from "../../store/useDispatch";
import { ChatActionContextValue, ChatActionProvider, UIKitProvider, useUIKit } from "../../context";
<<<<<<< HEAD
import { APIClient, Conversation, Message } from '../../types';
=======
import { notification } from 'antd';
import { Profile, APIClient, Conversation, Message } from '../../types';
>>>>>>> 13cca9f667139855067204b99a3bce20ede93cdd
import { fetchConversationsByAccount } from '../../store/conversations';
import { UIAccountList } from '../UIAccountList';
import { UIConversationList } from '../UIConversationList';
import { useCreateMessage } from '../../hooks/useCreateMesage';
<<<<<<< HEAD
import { Toast } from '../Toast';
=======
import './styles/index.scss';
>>>>>>> 13cca9f667139855067204b99a3bce20ede93cdd

import './styles/index.scss';


const appThunkContext: AppThunkContext = {
	// 全局的错误处理
	onError: (e: any, title?: string) => {
    Toast({ text: e.message, type: 'error' });
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
      Toast({ text: error, type: 'error' });

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
  activeProfile?: Profile;
  activeConversation?: Conversation;
  cloudCustomData?: string;
}

export function UIKit<T extends UIKitProps>(props: PropsWithChildren<T>) {
  const {
    client,
    activeProfile,
    activeConversation: propActiveConversation,
    children,
  } = props;
  const [activeConversation, setActiveConversation] = useState<Conversation | undefined>();

  useEffect(() => {
    setActiveConversation(propActiveConversation);
  }, [propActiveConversation]);

  const providerContextValue = useMemo(() => ({
    client,
    activeProfile,
    activeConversation,
    setActiveConversation,
  }), [client, activeProfile, activeConversation, setActiveConversation]);

  return (
    <UIKitProvider value={providerContextValue}>
      <ReduxProvider store={store} children={<UIKitInner {...props}>{children}</UIKitInner>} />
    </UIKitProvider>
  );
}
