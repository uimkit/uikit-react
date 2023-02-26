import React, { useMemo, useEffect, useState, PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import { UIChat } from "../UIChat";

import { createAppStore } from "../../store";
import { AppThunkContext } from "../../store/types";
import { createListeners } from "../../store/listener";
import { useDispatch } from "../../store/useDispatch";
import { UIKitProvider, useUIKit } from "../../context";
import { Profile, APIClient, Conversation, Contact } from '../../types';
import { UIAccountList } from '../UIAccountList';
import { UIConversationList } from '../UIConversationList';
import { Toast } from '../Toast';

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
  const { children } = props;

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

  return storeInited && (
    <div className="uim-kit">
      {children || (
        <>
          <UIAccountList />
          <UIConversationList />
          <UIChat />
        </>
      )}
    </div>
  );
};

export interface UIKitProps {
  client: APIClient;
  activeProfile?: Profile;
  activeConversation?: Conversation;
}

export function UIKit<T extends UIKitProps>(props: PropsWithChildren<T>) {
  const {
    client,
    activeProfile,
    activeConversation: propActiveConversation,
    activeContact: propActiveContact,
    children,
  } = props;
  const [activeConversation, setActiveConversation] = useState<Conversation | undefined>();
  const [activeContact, setActiveContact] = useState<Contact | undefined>();

  useEffect(() => {
    setActiveConversation(propActiveConversation);
  }, [propActiveConversation]);

  useEffect(() => {
    setActiveContact(propActiveContact);
  }, [propActiveContact]);

  const providerContextValue = useMemo(() => ({
    client,
    activeProfile,
    activeConversation,
    setActiveConversation,
    activeContact,
    setActiveContact,
  }), [client, activeProfile, activeConversation, setActiveConversation, activeContact, setActiveContact]);

  return (
    <UIKitProvider value={providerContextValue}>
      <ReduxProvider store={store} children={<UIKitInner {...props}>{children}</UIKitInner>} />
    </UIKitProvider>
  );
}
