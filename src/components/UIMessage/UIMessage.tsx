import React from 'react';
import { Message } from "../../types";
import { TextMessage } from "./TextMessage";
import { ImageMessage } from "./ImageMessage";
import { VideoMessage } from "./VideoMessage";
import { MessageBubble } from "./MessageBubble";
import clsx from 'clsx';
import { Avatar } from 'antd'



export type UIMessageProps = {
  message: Message;
  position?: 'left' | 'right' | 'center';
}

const UnknownMessage: React.FC<UIMessageProps> = ({ message }) => <>未知消息类型. id: {message.id}, type: {message.type}</>;

const components: Record<string, React.ComponentType<UIMessageProps>> = {
  text: TextMessage,
  image: ImageMessage,
  video: VideoMessage,
};

export function UIMessage({
  message,
  position = 'left',
}: UIMessageProps) {
  const UIMessageComponent = components[message.type] ?? UnknownMessage;

  console.log('message: ', message);

  const isRL = position === 'right' || position === 'left';

  return (
    <div className={clsx('Message', position)}>
      {message.sent_at && (
        <div className="Message-meta">
          {message.sent_at.toString()}
        </div>
      )}
      <div className="Message-main">
        {isRL && message && message.avatar && <Avatar src={message.avatar} alt={message.name} />}
        <div className="Message-inner">
          {isRL && message.name && <div className="Message-author">{message.name}</div>}
          <div className="Message-content" role="alert" aria-live="assertive" aria-atomic="false">
            {(
              <MessageBubble message={message}>
                <UIMessageComponent message={message} />
              </MessageBubble>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
