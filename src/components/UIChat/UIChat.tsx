import React, { PropsWithChildren, useMemo } from 'react';
import { UIMessageInput as UIMessageInputElement, UIMessageInputBasicProps } from '../UIMessageInput';

import { UIMessageList } from '../UIMessageList';
import { ComponentContextValue, ComponentProvider, UnknowPorps } from '../../context/ComponentContext';
import {
  UIMessageProps,
  UIMessage as UIMessageDefault,
} from '../UIMessage';
import { UIChatHeaderDefaultProps, UIChatHeader as UIChatHeaderElement } from '../UIChatHeader';
import './styles/index.scss';
import { useCreateMessage } from '../../hooks/useCreateMesage';



export interface UIChatProps {
  EmptyPlaceholder?: React.ReactElement,
  UIMessage?: React.ComponentType<UIMessageProps | UnknowPorps>,
  UIChatHeader?: React.ComponentType<UIChatHeaderDefaultProps>,
  // MessageContext?: React.ComponentType<MessageContextProps>,
  UIMessageInput?: React.ComponentType<UnknowPorps>,
  InputPlugins?: React.ComponentType<UnknowPorps>,
  InputQuote?: React.ComponentType<UnknowPorps>,
  MessagePlugins?: React.ComponentType<UnknowPorps>,
} 

export function UIChat<T extends UIChatProps>(props: PropsWithChildren<T>): React.ReactElement {
  const {
    UIMessage,
    InputPlugins,
    MessagePlugins,
    UIChatHeader,
    UIMessageInput,
    InputQuote,
    children,
  } = props;

  const componentContextValue: ComponentContextValue = useMemo(
    () => ({
      UIMessage: UIMessage || UIMessageDefault,
      // MessageContext,
      InputPlugins,
      MessagePlugins,
      UIChatHeader,
      UIMessageInput,
      InputQuote,
    }),
    [],
  );

  return (
    <div className={`chat`}>
      <ComponentProvider value={componentContextValue}>
        {children || (
          <>
            <UIChatHeaderElement />
            <UIMessageList />
            <UIMessageInputElement />
          </>
        )}
      </ComponentProvider>
    </div>
  );
}