import React, { MutableRefObject, PropsWithChildren } from 'react';
import { MessageInputContextProvider, UnknowPorps, useChatStateContext, useComponentContext, useUIKit } from '../../context';
import { useCreateMessageInputContext } from './hooks/useCreateMessageInputContext';
import { useMessageInputState } from './hooks/useMessageInputState';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { InputQuoteDefault } from './InputQuoteDefault';
import { InputPluginsDefault } from './InputPluginsDefault';
import { ConversationType, Message } from '../../types';
import { DefaultTriggerProvider } from './DefaultTriggerProvider';

import clsx from 'clsx';
import { UIMessageInputFlat } from './UIMessageInputFlat';

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
  disabled?: boolean;
  focus?: boolean;
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>;
  isTransmitter?: boolean;
  className?: string;
  pluginConfig?: PluginConfigProps;
  /** 如果提供, 则会基于此消息进行编辑并提交 */
  message?: Message;
  overrideSubmitHandler?: (
    message: Message,
    conversationId: string,
  ) => Promise<void> | void;

  /** If true, will use an optional dependency to support transliteration in the input for mentions, default is false. See: https://github.com/getstream/transliterate */
  /**
   * Currently, `Enter` is the default submission key and  `Shift`+`Enter` is the default combination for the new line.
   * If specified, this function overrides the default behavior specified previously.
   *
   * Example of default behaviour:
   * ```tsx
   * const defaultShouldSubmit = (event) => event.key === "Enter" && !event.shiftKey;
   * ```
   */
   shouldSubmit?: (event: KeyboardEvent) => boolean;
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
    // textareaRef: propsTextareaRef,
  } = props;
  const { UIMessageInputConfig } = useChatStateContext();

  const messageInputState = useMessageInputState(props);
  const { activeConversation } = useUIKit();

  const contextDisabled = activeConversation?.type === ConversationType.System;


  const focus = propsFoces || UIMessageInputConfig?.focus;

  const messageInputContextValue = useCreateMessageInputContext({
    ...messageInputState,
    ...props,
    // textareaRef: propsTextareaRef || UIMessageInputConfig?.textareaRef || textareaRef,
    disabled: propsDisabled || UIMessageInputConfig?.disabled || contextDisabled,
    focus: typeof (focus) === 'boolean' ? focus : true,
    pluginConfig,
  });

  return (
    <MessageInputContextProvider value={messageInputContextValue}>
      { children }
    </MessageInputContextProvider>
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
    TriggerProvider = DefaultTriggerProvider,
  } = useComponentContext('UIMessageInput');

  const Input = propsUIMessageInput || ContextInput || /*UIMessageInputDefault*/UIMessageInputFlat;
  const InputPlugins = propsInputPlugins
  || ContextInputPlugins || InputPluginsDefault || EmptyStateIndicator;
  const InputQuote = propsInputQuote || ContextInputQuote || InputQuoteDefault;

  return (
    <div className={clsx(`uim-message-input`, className)}>
      <UIMessageInputProvider {...props}>
        {/*<UIForward />*/}
        <InputQuote />
        <InputPlugins />
        <div className="uim-message-input-main">
          <div className="uim-message-input-box">
            <TriggerProvider>
              <Input />
            </TriggerProvider>
          </div>
          {/*isTransmitter && <Transmitter />*/}
        </div>
      </UIMessageInputProvider>
    </div>
  );
}
