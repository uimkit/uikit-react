import React, { PropsWithChildren, ReactEventHandler } from 'react';
import { Message } from '../../types';

import { UnknowPorps, useComponentContext } from '../../context';

import { messageShowType, UIMessageContextProvider } from '../../context/UIMessageContext';
import { useMessageHandler } from './hooks';

import './styles/index.scss';
import { UIMessageDefault } from './UIMessageDefault';
import { MessagePlugins as MessagePluginsDefault, MessagePluginsProps } from './MessagePlugins';
import { MessageContext as MessageContextDefault } from './MessageContext';
import { useChatState } from '../../hooks';

interface UIMessageBasicProps {
  className?: string,
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

export interface UIMessageProps extends UIMessageBasicProps {
  message?: Message,
  className?: string,
  UIMessage?: React.ComponentType,
  MessageContext?: React.ComponentType<UnknowPorps>,
  MessagePlugins?: React.ComponentType<UnknowPorps>,
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
}
function UIMessageWithContext <T extends UIMessageProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message: propsMessage,
    UIMessage: propUIMessage,
    MessagePlugins: propMessagePlugins,
    MessageContext: propMessageContext,
    handleDelete,
    CustemElement,
    TextElement,
    ImageElement,
    VideoElement,
    AudioElement,
    FileElement,
    MergerElement,
    LocationElement,
    FaceElement,
    className,
    filter: propsFilter,
    isShowTime,
    isShowRead,
    plugin,
    prefix,
    suffix,
    customName,
    showAvatar,
    showName,
    customAvatar,
    isShowProgress,
    Progress,
  } = props;

  const {
    MessagePlugins: ContextMessagePlugins,
    MessageContext: ContextMessageContext,
  } = useComponentContext('UIMessage');

  const {
    messageConfig,
  } = useChatState();

  const UIMessageUIComponent = propUIMessage || UIMessageDefault;
  const MessagePlugins = propMessagePlugins || ContextMessagePlugins || MessagePluginsDefault;
  const MessageContext = propMessageContext || ContextMessageContext || MessageContextDefault;

  const filter = propsFilter || messageConfig?.filter;
  const message = propsMessage || messageConfig?.message;
  if (filter) {
    filter(message);
  }

  const messageContextValue = {
    message,
    handleDelete: handleDelete || messageConfig?.handleDelete,
    CustemElement: CustemElement || messageConfig?.CustemElement,
    TextElement: TextElement || messageConfig?.TextElement,
    ImageElement: ImageElement || messageConfig?.ImageElement,
    VideoElement: VideoElement || messageConfig?.VideoElement,
    AudioElement: AudioElement || messageConfig?.AudioElement,
    FileElement: FileElement || messageConfig?.FileElement,
    MergerElement: MergerElement || messageConfig?.MergerElement,
    LocationElement: LocationElement || messageConfig?.LocationElement,
    FaceElement: FaceElement || messageConfig?.FaceElement,
    isShowTime: isShowTime || messageConfig?.isShowTime,
    isShowRead: isShowRead || messageConfig?.isShowRead,
    plugin: plugin || messageConfig?.plugin,
    prefix: prefix || messageConfig?.prefix,
    suffix: suffix || messageConfig?.suffix,
    customName: customName || messageConfig?.customName,
    showAvatar: showAvatar || messageConfig?.showAvatar,
    showName: showName || messageConfig?.showName,
    customAvatar: customAvatar || messageConfig?.customAvatar,
    isShowProgress: isShowProgress || messageConfig?.isShowProgress,
    Progress: Progress || messageConfig?.Progress,
  };

  return (
    <UIMessageContextProvider value={messageContextValue}>
      <UIMessageUIComponent
        message={message}
        MessageContext={MessageContext}
        MessagePlugins={MessagePlugins}
        className={className || messageConfig?.className}
      />
    </UIMessageContextProvider>
  );
}

const MemoizedUIMessage = React.memo(UIMessageWithContext) as
typeof UIMessageWithContext;

export function UIMessage(props: UIMessageProps): React.ReactElement {
  const {
    message,
  } = props;
  const { handleDelMessage } = useMessageHandler({ message });

  return (
    <MemoizedUIMessage
      handleDelete={handleDelMessage}
      {...props}
    />
  );
}