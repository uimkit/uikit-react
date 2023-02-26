import React, { PropsWithChildren } from 'react';
import { Message, MessageType } from '../../types';

import { MessageAudio } from './MessageAudio';
import { MessageCustom } from './MessageCustom';
import { MessageFace } from './MessageFace';
import { MessageFile } from './MessageFile';
import { MessageImage } from './MessageImage';
import { MessageLocation } from './MessageLocation';
import { MessageMerger } from './MessageMerger';
import { MessageText } from './MessageText';
import { MessageVideo } from './MessageVideo';

import { useMessageContextHandler } from './hooks';
import { MessageStatus } from './MessageStatus';
import { useUIMessageContext } from '../../context';

const components = {
  [MessageType.Text]: MessageText,
  [MessageType.Face]: MessageFace,
  [MessageType.Image]: MessageImage,
  [MessageType.Voice]: MessageAudio,
  [MessageType.Video]: MessageVideo,
  [MessageType.File]: MessageFile,
  [MessageType.Custom]: MessageCustom,
  [MessageType.Merger]: MessageMerger,
  [MessageType.Location]: MessageLocation,
};

export interface MessageContextProps {
  message?: Message,
}

function MessageContextWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const { context } = useMessageContextHandler({ message });
  const {
    CustemElement,
    TextElement,
    FaceElement,
    ImageElement,
    AudioElement,
    VideoElement,
    FileElement,
    MergerElement,
    LocationElement,
  } = useUIMessageContext('MessageCustom');

  const CustemComponents = {
    [MessageType.Text]: TextElement,
    [MessageType.Face]: FaceElement,
    [MessageType.Image]: ImageElement,
    [MessageType.Voice]: AudioElement,
    [MessageType.Video]: VideoElement,
    [MessageType.File]: FileElement,
    [MessageType.Custom]: CustemElement,
    [MessageType.Merger]: MergerElement,
    [MessageType.Location]: LocationElement,
  };

  const Component = CustemComponents[message?.type] ?? components[message?.type];
  return Component && (
    <Component context={context} message={message}>
      <MessageStatus message={message} />
    </Component>
  );
}

const MemoizedMessageContext = React.memo(MessageContextWithContext) as
typeof MessageContextWithContext;

export function MessageContext(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageContext
      {...props}
    />
  );
}