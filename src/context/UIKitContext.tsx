import React, { PropsWithChildren, useState, useMemo, useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { Profile, Conversation } from "../types";

import { APIClient } from '../types';


export interface UIKitContextProps {
  client: APIClient;
  activeProfile: Profile;
  activeConversation: Conversation;
  setActiveConversation: (conversation: Conversation) => void;
}

const UIKitContext = React.createContext<UIKitContextProps | undefined>(undefined);

export interface UIKitProviderOptions {
  client: APIClient;
};

export function UIKitProvider({ value, children }: PropsWithChildren<{ value: UIKitProviderOptions }>) {
  return (
    <UIKitContext.Provider value={value}>
      {children}
    </UIKitContext.Provider>
  );
}

export const useUIKit = (componentName?: string): UIKitContextProps =>
  useContext(UIKitContext) as UIKitContextProps;
