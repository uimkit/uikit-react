import React, { useMemo, useEffect, useState, PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import { UIChat } from "../UIChat";

import { createAppStore } from "../../store";
import { AppThunkContext } from "../../store/types";
import { createListeners } from "../../store/listener";
import { useDispatch } from "../../store/useDispatch";
import { SupportedTranslations, TranslationProvider, UIKitProvider, useUIKit } from "../../context";
import { Profile, APIClient, Conversation, Contact } from '../../types';
import { UIConversationList } from '../UIConversationList';
import { Toast } from '../Toast';

import './styles/index.scss';
import { useTranslators } from './hooks/useTranslators';
import { Uimi18n } from '../../i18n';


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
  activeContact?: Contact;
  /** Sets the default fallback language for UI component translation, defaults to 'en' for English */
  defaultLanguage?: SupportedTranslations;
  /** Instance of Stream i18n */
  i18nInstance?: Uimi18n;
}

export function UIKit<T extends UIKitProps>(props: PropsWithChildren<T>) {
  const {
    client,
    activeProfile,
    activeConversation: propActiveConversation,
    activeContact: propActiveContact,
    defaultLanguage,
    i18nInstance,
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

  const { translators } = useTranslators({
    defaultLanguage,
    i18nInstance,
  });

  return (
    <UIKitProvider value={providerContextValue}>
      <TranslationProvider value={translators}>
        <ReduxProvider store={store} children={<UIKitInner {...props}>{children}</UIKitInner>} />
      </TranslationProvider>
    </UIKitProvider>
  );
}
