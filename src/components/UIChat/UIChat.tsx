import React, { PropsWithChildren, useCallback, useReducer, useRef, useMemo, useLayoutEffect } from 'react';
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
import { deleteLocalMessage as reduxDeleteLocalMessage, updateLocalMessage as reduxUpdateLocalMessage } from '../../store/messages/commands';
import { useDispatch } from '../../store/useDispatch';
import { updateConversation } from '../../store/conversations';
import './styles/index.scss';
import { CONSTANT_DISPATCH_TYPE } from '../../constants';
import { ConversationActionType } from '../../store/messages';
import { useConversationState } from '../../hooks';



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

  /** 可选 自动补全触发器, 默认为: [DefaultTriggerProvider](https://github.com/uimkit/uikit-react/blob/master/src/components/UIMessageInput/DefaultTriggerProvider.tsx) */
  TriggerProvider?: ComponentContextValue['TriggerProvider'];

  /** 自定义的表情数据集，可以覆盖默认来自 `emoji-mart` 的 `facebook.json` 表情数据集 */
  emojiData?: EmojiMartData;
  /** 自定义 表情选择 UI组件, 覆盖默认来自 `emoji-mart` 的 Picker */
  EmojiPicker?: EmojiContextValue['EmojiPicker'];

  /** 自定义 表情 UI 组件, 遵循 `emoji-mart` 的接口规范 */
  Emoji?: EmojiContextValue['Emoji'];
  
  /** 自定义消息发送方法，默认为 `client.sendMessage` */
  doSendMessageRequest?: (
    message: Message,
  ) => ReturnType<any> | void;
} 

const UIChatInner: React.FC<PropsWithChildren<UIChatProps>> = (props) => {
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
    conversation,
    children,
  } = props;

  const { client } = useUIKit('UIChat');

  const [_state, dispatch] = useReducer<ChatStateReducer>(
    chatReducer,
    { ...initialState },
  );
  const reduxDispatch = useDispatch();

  const { 
    loadMore, 
    loadMoreNewer, 
    jumpToMessage, 
    ...conversationState 
  } = useConversationState(conversation.id);

  const state = useMemo(() => {
    const { 
      hasMore,
      hasMoreNewer,
      loadingMore,
      loadingMoreNewer,
      messages,
      highlightedMessageId,
      suppressAutoscroll,    
    } = conversationState;

    return {
      ..._state,
      hasMore,
      hasMoreNewer,
      loadingMore,
      loadingMoreNewer,
      messages,
      highlightedMessageId,
      suppressAutoscroll,
    };
  }, [_state, conversationState])

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
  } = useCreateMessage({ client, conversation, cloudCustomData });

  useLayoutEffect(() => {
    // 监听 conversation 内部事件

    return () => {
    // 解除监听 conversation 内部事件

    };
  }, [conversation.id]);

  const jumpToLatestMessage = async () => {
    // 不使用 redux
    if (false) {
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.JUMP_TO_LATEST_MESSAGE,
      });  
    } else {
      // 使用 redux
      reduxDispatch({
        type: ConversationActionType.JumpToLatestMessage,
        conversation,
      });
    }
  };


  const sendMessage = useCallback(async (_message: Message) => {
    const message = {
      ..._message,
      conversation_id: conversation.id,
    };

    reduxDispatch(reduxUpdateLocalMessage(message));

    try {
      let messageResponse;
      if (doSendMessageRequest) {
        messageResponse = await doSendMessageRequest(message);
      } else {
        messageResponse = await client.sendMessage(message);
      }

      // 错误提示
			if (messageResponse.failed) {
				throw new Error(messageResponse.failed_reason);
			}

      reduxDispatch(reduxUpdateLocalMessage(messageResponse));
      // 更新本地会话显示
      reduxDispatch(updateConversation({
        account: message.account,
        id: message.conversation_id,
        last_message: message,
	      active_at: message.sent_at,
	    }));
    } catch (error) {
      Toast({ text: (error as Error).message, type: 'error' });

      reduxDispatch(reduxUpdateLocalMessage({
        ...message,
        sending: false,
        succeeded: false,
        failed_reason: error.message,
        status: 'failed',
      }));

      throw error;
    }
  }, [client, conversation, reduxDispatch]);

  const deleteMessage = useCallback(async (message: Message) => {
    try {
      await client.deleteMessage(message.id);
      reduxDispatch(reduxDeleteLocalMessage(message));
    } catch(e) {
      throw new Error(e);
    }
  }, [reduxDispatch]);

  const editLocalMessage = useCallback((message: Message) => {
    reduxDispatch(reduxUpdateLocalMessage(message));
  }, [reduxDispatch]);

  const revokeMessage = useCallback(async (message: Message) => {
    try {
      const r = await client.revokeMessage(message);
      editLocalMessage(r ?? message);
    } catch(e) {
      throw new Error(e);
    };
  }, [reduxDispatch]);

  const resendMessage = useCallback(async (message: Message) => {
    try {
      const r = await client.resendMessage(message);
      editLocalMessage(r ?? message);
    } catch(e) {
      throw new Error(e);
    };
  }, [reduxDispatch]);
    
  const chatActionContextValue = useMemo<ChatActionContextValue>(() => ({
    editLocalMessage,
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
    jumpToMessage,
    jumpToLatestMessage,
    deleteMessage,
    revokeMessage,
    resendMessage,
    setAudioSource,
    loadMore,
    loadMoreNewer,
  }), [
    editLocalMessage,
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
    deleteMessage,
    revokeMessage,
    resendMessage,
    setAudioSource,
    loadMore,
    loadMoreNewer,
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



export const UIChat: React.FC<PropsWithChildren<UIChatProps>> = (props) => {
  const {
    conversation: propConversation,
    EmptyPlaceholder = null,
  } = props;

  const {
    activeConversation: contextConversation
  } = useUIKit('UIChat');
  
  const conversation = propConversation ?? contextConversation;
  const className = 'uim-conversation'; // clsx(chatClass, theme, conversationClass);


  if (!conversation?.id) {
    return <div className={className}>{EmptyPlaceholder}</div>
  }

  return <UIChatInner {...props} conversation={conversation} key={conversation.id} />;
};