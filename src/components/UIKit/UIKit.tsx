import React, { useMemo, useEffect, useState, PropsWithChildren, useCallback } from 'react';
import { Provider as ReduxProvider } from "react-redux";
import { UIChat } from "../UIChat";

import { createAppStore } from "../../store";
import { AppState, AppThunkContext } from "../../store/types";
import { useDispatch } from "../../store/useDispatch";
import { SupportedTranslations, TranslationProvider, UIKitContextProps, UIKitProvider, useUIKit } from "../../context";
import { Profile, APIClient, Conversation, EventType, ConversationUpdatedEvent, ConversationCreatedEvent } from '../../types';
import { UIConversationList } from '../UIConversationList';
import { Toast } from '../Toast';
import { useTranslators } from './hooks/useTranslators';
import { Uimi18n } from '../../i18n';
import { ConversationListActionType, updateConversation } from '../../store/conversations';
import './styles/index.scss';
import { useSelector } from 'react-redux';
import { initAPIClient } from '../../store/common/actions';
import { ConversationActionType } from '../../store/messages';


const appThunkContext: AppThunkContext = {
	// 全局的错误处理
	onError: (e: any, title?: string) => {
    Toast({ text: e.message, type: 'error' });
	}
}
const store = createAppStore(appThunkContext)


const UIKitInner: React.FC<PropsWithChildren<UIKitProps>> = (props) => {
  const {
    client,
    activeProfile,
    activeConversation: propActiveConversation,
    defaultLanguage,
    i18nInstance,
    children,
  } = props;

  const dispatch = useDispatch();

  const clientInited = useSelector((state: AppState) => state.common.client);
  dispatch(initAPIClient(client));

  const [activeConversation, _setActiveConversation] = useState<Conversation | undefined>();
  const setActiveConversation = useCallback((activeConversation?: Conversation) => {
    if (activeConversation) {
      if (activeConversation.unread > 0) {
        client?.setConversationRead(activeConversation.id);
      }

      dispatch(updateConversation({
        account: activeConversation.account,
        id: activeConversation.id,
        unread: 0,
      }));
    }

    _setActiveConversation(activeConversation);
  }, [client]);

  useEffect(() => {
    if (clientInited) {
      setActiveConversation(propActiveConversation);
    }
  }, [propActiveConversation, clientInited]);

  useEffect(() => {
    const onMessageReceived = (e: MessageEvent) => {
      dispatch({
        type: ConversationActionType.MESSAGE_RECEIVED,
        payload: e.data,
      });
    };

    const onMessageUpdated = (e: MessageEvent) => {
      dispatch({
        type: ConversationActionType.MESSAGE_UPDATE,
        payload: e.data,
      });
    };

    const onConversationUpdated = (e: ConversationCreatedEvent) => {
      dispatch({
        type: ConversationListActionType.CONVERSATION_RECEIVED,
        payload: e.data,
      });
    };

    client?.on?.(EventType.MESSAGE_RECEIVED, onMessageReceived); // 收到新消息
    // client?.on(EventType.MESSAGE_UPDATED, onMessageUpdated); // 更新消息
    client?.on?.(EventType.CONVERSATION_UPDATED, onConversationUpdated); // 会话更新 或 新会话

    return () => {
      // client?.off(EventType.MESSAGE_RECEIVED, onMessageReceived);
      // client?.off(EventType.MESSAGE_UPDATED, onMessageUpdated);
      // client?.off(EventType.CONVERSATION_CREATED, onConversationNew);
    }
  }, [client, dispatch]);

  useEffect(() => {
    const onConversationUpdated = async (e: ConversationUpdatedEvent) => {
      const conversation = e.data
      if (!conversation) return;

      if (conversation.id === activeConversation?.id) {
        // 当前会话清除未读
        if (conversation.unread > 0) {
          await client.setConversationRead(conversation.id);
          conversation.unread = 0;
        }
      }
      dispatch({
        type: ConversationListActionType.CONVERSATION_RECEIVED,
        payload: e.data,
      });
    };

    client?.on?.(EventType.CONVERSATION_UPDATED, onConversationUpdated); // 会话更新

    return () => {
      // client?.off(EventType.CONVERSATION_UPDATED, onConversationUpdated);
    }
  }, [client, dispatch, activeConversation]);



  const providerContextValue: UIKitContextProps = useMemo(() => ({
    client,
    activeProfile,
    activeConversation,
    setActiveConversation,
  }), [client, activeProfile, activeConversation, setActiveConversation]);

  const { translators } = useTranslators({
    defaultLanguage,
    i18nInstance,
  });

  return (
    <UIKitProvider value={providerContextValue}>
      <TranslationProvider value={translators}>
        {!!clientInited && (
          <div className="uim-kit">
            {children || (
              <>
                <UIConversationList />
                <UIChat />
                {!!activeMomentUserId && <MomentList userId={activeMomentUserId}/>}
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
