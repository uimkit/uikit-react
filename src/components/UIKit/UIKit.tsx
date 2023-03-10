import React, { useMemo, useEffect, useState, PropsWithChildren, useCallback } from 'react';
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
import { useTranslators } from './hooks/useTranslators';
import { Uimi18n } from '../../i18n';
import { updateConversation } from '../../store/conversations';
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
  const {
    client,
    activeProfile,
    activeConversation: propActiveConversation,
    activeContact: propActiveContact,
    defaultLanguage,
    i18nInstance,
    children,
  } = props;

  const dispatch = useDispatch();
  const [storeInited, setStoreInited] = useState(false);

  useEffect(() => {
    if (client) {
      appThunkContext.client = client;
      setStoreInited(true);

      createListeners(client, dispatch, getState);
    }
  }, [client]);

  const [activeConversation, _setActiveConversation] = useState<Conversation | undefined>();
  const [activeContact, setActiveContact] = useState<Contact | undefined>();

  const setActiveConversation = useCallback((activeConversation?: Conversation) => {
    if (activeConversation) {
      client?.setConversationRead(activeConversation.id);

      dispatch(updateConversation({
        account: activeConversation.account,
        id: activeConversation.id,
        unread: 0,
      }));
    }

    _setActiveConversation(activeConversation);
  }, [client]);

  useEffect(() => {
    if (storeInited) {
      setActiveConversation(propActiveConversation);
    }
  }, [propActiveConversation, storeInited]);

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
        {storeInited && (
          <div className="uim-kit">
            {children || (
              <>
                <UIConversationList />
                <UIChat />
              </>
            )}
          </div>
        )}
      </TranslationProvider>
    </UIKitProvider>
  );
};

export interface UIKitProps {
  client: APIClient;
  // 当前活跃账户
  activeProfile?: Profile;
  // 当前活跃会话
  activeConversation?: Conversation;
  activeContact?: Contact;
  /** Sets the default fallback language for UI component translation, defaults to 'en' for English */
  defaultLanguage?: SupportedTranslations;
  /** Instance of Stream i18n */
  i18nInstance?: Uimi18n;
}

export function UIKit<T extends UIKitProps>({ children, ...rest }: PropsWithChildren<T>) {
  return (
    <ReduxProvider store={store}>
      <UIKitInner {...rest}>{children}</UIKitInner>
    </ReduxProvider>
  );
}
