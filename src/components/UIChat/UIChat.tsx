import React, { PropsWithChildren, useCallback, useReducer, useRef, useMemo } from 'react';
import { UIMessageInput as UIMessageInputElement, UIMessageInputBasicProps } from '../UIMessageInput';

import { MessageListProps, UIMessageList } from '../UIMessageList';
import { ComponentContextValue, ComponentProvider, UnknowPorps } from '../../context/ComponentContext';
import {
  UIMessageProps,
  UIMessage as UIMessageDefault,
  MessageContextProps,
} from '../UIMessage';
import { UIChatHeaderDefaultProps, UIChatHeader as UIChatHeaderElement } from '../UIChatHeader';
import { chatReducer, ChatStateReducer, initialState } from './ChatState';
import useCreateChatStateContext from './hooks/useCreateChatStateContext';
import { ChatActionContextValue, ChatActionProvider, ChatStateContextProvider, useUIKit } from '../../context';
import { useHandleMessage } from './hooks/useHandleMessage';
import { Toast } from '../Toast';
import { Message } from '../../types';
import { useCreateMessage } from '../../hooks/useCreateMesage';
import { EmojiConfig, EmojiContextValue, EmojiProvider } from '../../context/EmojiContext';
import { commonEmoji, defaultMinimalEmojis, emojiSetDef } from './emojiData';
import { EmojiMartData } from '@emoji-mart/data';
import defaultEmojiData from '@emoji-mart/data';
import './styles/index.scss';

export interface UIChatProps {
  EmptyPlaceholder?: React.ReactElement;
  UIMessage?: React.ComponentType<UIMessageProps | UnknowPorps>;
  UIChatHeader?: React.ComponentType<UIChatHeaderDefaultProps>;
  MessageContext?: React.ComponentType<MessageContextProps>;
  UIMessageInput?: React.ComponentType<UnknowPorps>;
  InputPlugins?: React.ComponentType<UnknowPorps>;
  InputQuote?: React.ComponentType<UnknowPorps>;
  MessagePlugins?: React.ComponentType<UnknowPorps>;
  messageConfig?: UIMessageProps;
  cloudCustomData?: string;
  UIMessageInputConfig?: UIMessageInputBasicProps;
  UIMessageListConfig?: MessageListProps;
  
  /** 自定义的表情数据集，可以覆盖默认来自 `emoji-mart` 的 `facebook.json` 表情数据集 */
  emojiData?: EmojiMartData;
  /** 自定义 表情选择 UI组件, 覆盖默认来自 `emoji-mart` 的 Picker */
  EmojiPicker?: EmojiContextValue['EmojiPicker'];

  /** 自定义 表情 UI 组件, 遵循 `emoji-mart` 的接口规范 */
  Emoji?: EmojiContextValue['Emoji'];
} 

export function UIChat<T extends UIChatProps>(props: PropsWithChildren<T>): React.ReactElement {
  const {
    UIMessage,
    InputPlugins,
    MessagePlugins,
    UIChatHeader,
    UIMessageInput,
    InputQuote,
    messageConfig,
    UIMessageInputConfig,
    UIMessageListConfig,
    MessageContext,
    cloudCustomData,
    emojiData = defaultEmojiData as EmojiMartData,
    children,
  } = props;


  const [state, dispatch] = useReducer<ChatStateReducer>(
    chatReducer,
    { ...initialState },
  );

  const { client } = useUIKit();

  const messageListRef = useRef(null);
  const chatStateContextValue = useCreateChatStateContext({
    client,
    messageListRef,
    messageConfig,
    UIMessageInputConfig,
    UIMessageListConfig,
    ...state,
  });

  const {
    operateMessage,
    setAudioSource,
    setVideoSource,
    setHighlightedMessageId,
  } = useHandleMessage({
    state, dispatch,
  });


  const { activeConversation} = useUIKit();

  const {
    createTextMessage,
    createFaceMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
    // createForwardMessage,
    createCustomMessage,
    createAudioMessage,
    createTextAtMessage,
    createLocationMessage,
    createMergerMessage,
  } = useCreateMessage({ client, activeConversation, cloudCustomData });

  const sendMessage = useCallback(async (message: Message, options?: any) => {
    // updateMessage([message]);
    try {
      // TODO sendMessage
      // editLocalmessage(message);
    } catch (error) {
      Toast({ text: (error as Error).message, type: 'error' });
      // editLocalmessage(message);
      throw error;
    }
  }, []);

  
  const chatActionContextValue = useMemo<ChatActionContextValue>(() => ({
    sendMessage,
    createTextMessage,
    createFaceMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
    // createForwardMessage,
    createCustomMessage,
    createAudioMessage,
    createTextAtMessage,
    createLocationMessage,
    createMergerMessage,
    operateMessage,
  }), [
    sendMessage,
    createTextMessage,
    createFaceMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
    // createForwardMessage,
    createCustomMessage,
    createAudioMessage,
    createTextAtMessage,
    createLocationMessage,
    createMergerMessage,
    operateMessage,
  ]);

  const componentContextValue: ComponentContextValue = useMemo(
    () => ({
      UIMessage: UIMessage || UIMessageDefault,
      MessageContext,
      InputPlugins,
      MessagePlugins,
      UIChatHeader,
      UIMessageInput,
      InputQuote,
    }),
    [],
  );


  const emojiConfig: EmojiConfig = {
    commonEmoji,
    defaultMinimalEmojis,
    emojiData,
    emojiSetDef,
  };

  const emojiContextValue: EmojiContextValue = useMemo(
    () => ({
      Emoji: props.Emoji,
      emojiConfig,
      // EmojiIndex: props.EmojiIndex,
      EmojiPicker: props.EmojiPicker,
    }),
    [],
  );

  return (
    <div className={`chat`}>
      <ChatStateContextProvider value={chatStateContextValue}>
        <ChatActionProvider value={chatActionContextValue}>
          <EmojiProvider value={emojiContextValue}>
            <ComponentProvider value={componentContextValue}>
              {children || (
                <>
                  <UIChatHeaderElement />
                  <UIMessageList />
                  <UIMessageInputElement />
                </>
              )}
            </ComponentProvider>
          </EmojiProvider>          
        </ChatActionProvider>
      </ChatStateContextProvider>
    </div>
  );
}