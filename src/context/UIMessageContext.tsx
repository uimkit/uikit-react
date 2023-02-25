import React, { PropsWithChildren, ReactEventHandler, useContext } from 'react';
import { Message } from '../types';
import { MessagePluginsProps } from '../components';

export enum messageShowType {
   IN = 'in',
   OUT = 'out',
   ALL = 'all',
   NONE = 'none',
}

export interface UIMessageContextValue {
  message?: Message,
  handleDelete?: ReactEventHandler,
  CustemElement?: React.ComponentType<{message: Message}>,
  TextElement?: React.ComponentType<{message: Message}>,
  ImageElement?: React.ComponentType<{message: Message}>,
  VideoElement?: React.ComponentType<{message: Message}>,
  AudioElement?: React.ComponentType<{message: Message}>,
  FileElement?: React.ComponentType<{message: Message}>,
  MergerElement?: React.ComponentType<{message: Message}>,
  LocationElement?: React.ComponentType<{message: Message}>,
  FaceElement?: React.ComponentType<{message: Message}>,
  filter?: (data:Message) => void,
  isShowTime?: boolean,
  isShowRead?: boolean,
  plugin?: MessagePluginsProps,
  prefix?: React.ReactElement | string,
  suffix?: React.ReactElement | string,
  customName?: React.ReactElement,
  showAvatar?: messageShowType,
  showName?: messageShowType,
  customAvatar?: React.ReactElement,
  isShowProgress?: boolean,
  Progress?: React.ComponentType<{message: Message}>,
}

export const UIMessageContext = React.createContext<UIMessageContextValue>(undefined);
export function UIMessageContextProvider({ children, value }:PropsWithChildren<{
    value: UIMessageContextValue
}>):React.ReactElement {
  return (
    <UIMessageContext.Provider value={value}>
      {children}
    </UIMessageContext.Provider>
  );
}

export function useUIMessageContext(componentName?:string): UIMessageContextValue {
  const contextValue = useContext(UIMessageContext);
  if (!contextValue && componentName) {
    return {} as UIMessageContextValue;
  }
  return (contextValue as unknown) as UIMessageContextValue;
}
