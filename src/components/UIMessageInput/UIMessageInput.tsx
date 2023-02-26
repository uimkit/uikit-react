import React, { MutableRefObject, PropsWithChildren } from 'react';
import { UIMessageInputContextProvider, UnknowPorps, useChatStateContext, useComponentContext, useUIKit } from '../../context';
import { useCreateMessageInputContext } from './hooks/useCreateMessageInputContext';
import { useMessageInputState } from './hooks/useMessageInputState';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { InputQuoteDefault } from './InputQuoteDefault';
import { UIMessageInputDefault } from './UIMessageInputDefault';
import { InputPluginsDefault } from './InputPluginsDefault';
import { ConversationType } from '../../types';
import clsx from 'clsx';
import './styles/index.scss';




export interface PluginConfigProps {
  plugins?: Array<React.ReactElement>,
  showNumber?: number,
  MoreIcon?: React.ReactElement,
  isEmojiPicker?: boolean,
  isImagePicker?: boolean,
  isVideoPicker?: boolean,
  isFilePicker?: boolean,
}

export interface UIMessageInputBasicProps {
  disabled?: boolean,
  focus?: boolean,
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  isTransmitter?: boolean,
  className?: string,
  pluginConfig?: PluginConfigProps,
}


export interface UIMessageInputProps extends UIMessageInputBasicProps {
  UIMessageInput?: React.ComponentType,
  InputPlugins?: React.ComponentType<UnknowPorps>,
  InputQuote?: React.ComponentType<UnknowPorps>,
}




function UIMessageInputProvider<T extends UIMessageInputProps>(props: PropsWithChildren<T>):React.ReactElement {
  const {
    children,
    disabled: propsDisabled,
    focus: propsFoces,
    pluginConfig,
    textareaRef: propsTextareaRef,
  } = props;
  const messageInputState = useMessageInputState(props);
  const { activeConversation } = useUIKit();

  const contextDisabled = activeConversation?.type === ConversationType.System;

  const { textareaRef, UIMessageInputConfig } = useChatStateContext();

  const focus = propsFoces || UIMessageInputConfig?.focus;

  const messageInputContextValue = useCreateMessageInputContext({
    ...messageInputState,
    ...props,
    textareaRef: propsTextareaRef || UIMessageInputConfig?.textareaRef || textareaRef,
    disabled: propsDisabled || UIMessageInputConfig?.disabled || contextDisabled,
    focus: typeof (focus) === 'boolean' ? focus : true,
    pluginConfig,
  });

  return (
    <UIMessageInputContextProvider value={messageInputContextValue}>
      { children }
    </UIMessageInputContextProvider>
  );
}





export function UIMessageInput<T extends UIMessageInputProps>(props: PropsWithChildren<T>) {
  const {
    UIMessageInput: propsUIMessageInput,
    InputPlugins: propsInputPlugins,
    InputQuote: propsInputQuote,
    isTransmitter: propsIsTransmitter,
    className: propsClassName,
  } = props;

  const { UIMessageInputConfig } = useChatStateContext();

  const className = propsClassName || UIMessageInputConfig?.className;
  const isTransmitter = propsIsTransmitter || UIMessageInputConfig?.isTransmitter || false;

  const {
    UIMessageInput: ContextInput,
    InputPlugins: ContextInputPlugins,
    InputQuote: ContextInputQuote,
  } = useComponentContext('UIMessageInput');

  const Input = propsUIMessageInput || ContextInput || UIMessageInputDefault;
  const InputPlugins = propsInputPlugins
  || ContextInputPlugins || InputPluginsDefault || EmptyStateIndicator;
  const InputQuote = propsInputQuote || ContextInputQuote || InputQuoteDefault;

  return (
    <div className={clsx(`uim-message-input`, className)}>
      <UIMessageInputProvider {...props}>
        {/*<UIForward />*/}
        <InputQuote />
        <div className="uim-message-input-main">
          <div className="uim-message-input-box">
            <InputPlugins />
            <Input />
          </div>
          {/*isTransmitter && <Transmitter />*/}
        </div>
      </UIMessageInputProvider>
    </div>
  );
}
