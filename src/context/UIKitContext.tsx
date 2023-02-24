import React, { PropsWithChildren, useState, useMemo, useContext } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { IMAccount, Conversation } from "../types";

import { APIClient } from '../types';


export interface UIKitContextProps {
  client: APIClient;
  activeAccount: IMAccount;
  setActiveAccount: (account: IMAccount) => void;
  activeConversation: Conversation;
  setActiveConversation: (conversation: Conversation) => void;
}

const UIKitContext = React.createContext<UIKitContextProps>({});

export interface UIKitProviderOptions {
  client: APIClient;
};

export function UIKitProvider({ value, children }: PropsWithChildren<{ options: UIKitProviderOptions }>) {
  const { client } = value;
  const [activeAccount, setActiveAccount] = useState<IMAccount | undefined>();
  const [activeConversation, setActiveConversation] = useState<Conversation | undefined>();

  const contextValue = useMemo(() => ({
    client,
    activeAccount,
    setActiveAccount,
    activeConversation,
    setActiveConversation,
  }), [value, activeAccount, setActiveAccount, activeConversation, setActiveConversation]);

  return (
    <UIKitContext.Provider value={contextValue}>
      {children}
    </UIKitContext.Provider>
  );
}

export const useUIKit = (componentName?: string): UIKitContextProps =>
  useContext(UIKitContext) as UIKitContextProps;