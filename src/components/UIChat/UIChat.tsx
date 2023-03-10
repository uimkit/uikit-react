import React, { PropsWithChildren, useCallback, useReducer, useRef, useMemo } from 'react';
import { UIMessageInput as UIMessageInputElement, UIMessageInputBasicProps } from '../UIMessageInput';

import { UIMessageListProps, UIMessageList } from '../UIMessageList';
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
import { Conversation, Message } from '../../types';
import { useCreateMessage } from '../../hooks/useCreateMessage';
import { EmojiConfig, EmojiContextValue, EmojiProvider } from '../../context/EmojiContext';
import { commonEmoji, defaultMinimalEmojis, emojiSetDef } from './emojiData';
import { EmojiMartData } from '@emoji-mart/data';
import defaultEmojiData from '@emoji-mart/data';
import { updateMessage as reduxUpdateMessage } from '../../store/messages/commands';
import { useDispatch } from '../../store/useDispatch';
import { updateConversation } from '../../store/conversations';
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
  UIMessageListConfig?: UIMessageListProps;
  
  /** The connected and active channel */
  conversation?: Conversation;

  /** ?????? ?????????????????????, ?????????: [DefaultTriggerProvider](https://github.com/uimkit/uikit-react/blob/master/src/components/UIMessageInput/DefaultTriggerProvider.tsx) */
  TriggerProvider?: ComponentContextValue['TriggerProvider'];

  /** ?????????????????????????????????????????????????????? `emoji-mart` ??? `facebook.json` ??????????????? */
  emojiData?: EmojiMartData;
  /** ????????? ???????????? UI??????, ?????????????????? `emoji-mart` ??? Picker */
  EmojiPicker?: EmojiContextValue['EmojiPicker'];

  /** ????????? ?????? UI ??????, ?????? `emoji-mart` ??????????????? */
  Emoji?: EmojiContextValue['Emoji'];
  
  /** ??????????????????????????????????????? `client.sendMessage` */
  doSendMessageRequest?: (
    message: Message,
  ) => ReturnType<any> | void;
} 

export function UIChat<T extends UIChatProps>(props: PropsWithChildren<T>): React.ReactElement {
  const {
    UIMessage,
    InputPlugins,
    MessagePlugins,
    UIChatHeader,
    UIMessageInput,
    InputQuote,
    TriggerProvider,
    messageConfig,
    UIMessageInputConfig,
    UIMessageListConfig,
    MessageContext,
    cloudCustomData,
    emojiData = defaultEmojiData as EmojiMartData,
    doSendMessageRequest,
    conversation: propConversation,
    children,
  } = props;

  const [state, dispatch] = useReducer<ChatStateReducer>(
    chatReducer,
    { ...initialState },
  );

  const { client, activeConversation: contextConversation } = useUIKit('UIChat');
  const conversation = propConversation || contextConversation;


  const jumpToLatestMessage = async () => {
    console.log('jumpToLatestMessage');
    // const hasMoreOlder = channel.state.messages.length >= 25;
    // loadMoreFinished(hasMoreOlder, channel.state.messages);
    dispatch({
      type: 'jumpToLatestMessage',
    });
  };

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

  const reduxDispatch = useDispatch();

  const sendMessage = useCallback(async (_message: Message) => {
    const message = {
      ..._message,
      conversation_id: conversation.id,
    };

    reduxDispatch(reduxUpdateMessage(message));

    try {
      let messageResponse;
      if (doSendMessageRequest) {
        messageResponse = await doSendMessageRequest(message);
      } else {
        messageResponse = await client.sendMessage(message);
      }

      // ????????????
			if (messageResponse.failed) {
				throw new Error(messageResponse.failed_reason);
			}

      reduxDispatch(reduxUpdateMessage(messageResponse));
      // ????????????????????????
      reduxDispatch(updateConversation({
        account: message.account,
        id: message.conversation_id,
        last_message: message,
	      active_at: message.sent_at,
	    }));
    } catch (error) {
      Toast({ text: (error as Error).message, type: 'error' });

      reduxDispatch(reduxUpdateMessage({
        ...message,
        sending: false,
        succeeded: false,
        failed_reason: error.message,
        status: 'failed',
      }));

      throw error;
    }
    console.log('ok ok');
  }, [client, conversation, reduxDispatch]);

  
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
    jumpToLatestMessage,
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
    jumpToLatestMessage,
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
      TriggerProvider,
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