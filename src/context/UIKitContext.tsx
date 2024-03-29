import React, { PropsWithChildren, useContext } from 'react';

import { Profile, Conversation } from "../types";

import { APIClient } from '../types';


export interface UIKitContextProps {
  client: APIClient;
  activeProfile?: Profile;
  activeConversation?: Conversation;
  setActiveConversation: (conversation?: Conversation) => void;
}

const UIKitContext = React.createContext<UIKitContextProps | undefined>(undefined);

export function UIKitProvider({ value, children }: PropsWithChildren<{ value: UIKitContextProps }>) {
  return (
    <UIKitContext.Provider value={value}>
      {children}
    </UIKitContext.Provider>
  );
}

export const useUIKit = (componentName?: string): UIKitContextProps => {
  const context = useContext(UIKitContext) as UIKitContextProps;
  if (!context)  {
    console.warn(
      `The useChatContext hook was called outside of the ChatContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );
    return {} as UIKitContextProps;
  }

  return context as UIKitContextProps;
}
