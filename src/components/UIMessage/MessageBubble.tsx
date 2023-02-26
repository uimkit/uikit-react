import React, {
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import { Message } from "../../types";
import { MESSAGE_STATUS } from '../../constants';
import Icon from '@ant-design/icons/lib/components/Icon';
import { LoadingOutlined } from '@ant-design/icons';
// import { Icon, IconTypes } from '../Icon';
// import { useMessageReply } from './hooks/useMessageReply';
// import { MessageProgress } from './MessageProgress';

export interface MessageBubbleProps {
  message?: Message,
  className?: string,
  children?: ReactNode,
  Context?: React.ComponentType<any>,
  Plugins?: React.ComponentType<any> | undefined,
}

export function MessageBubble<T extends MessageBubbleProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    children,
    Context,
    Plugins,
  } = props;

  const [PluginsShow, setPluginsShow] = useState(false);

  /*
  const {
    messageReply,
    replyMessage,
    sender,
  } = useMessageReply({ message });
  */
 const { messageReply } = { messageReply: false };

  // const { setHighlightedMessageId } = useChatActionContext();

  /*
  const handleLoading = () => !!((
    message?.type === TIM.TYPES.MSG_IMAGE
    || message?.type === TIM.TYPES.MSG_VIDEO
    || message?.type === TIM.TYPES.MSG_FILE
  ) && message?.status === MESSAGE_STATUS.UNSEND);
  */
  const handleLoading = () => false;

  const handleMouseEnter = () => {
    setPluginsShow(true);
  };
  const handleMouseLeave = () => {
    setPluginsShow(false);
  };

  const handleReplyMessage = () => {
    // setHighlightedMessageId(replyMessage?.id);
  };

  return (
    <div className="message-bubble">
      <div
        className={`meesage-bubble-context ${message?.flow}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={
            `message-context
            ${messageReply ? `meesage-bubble-reply meesage-bubble-reply-${message?.flow}` : ''}
            ${handleLoading() ? 'loading' : ''}`
          }
        >
          {/*
            messageReply && (
            <div
              className="meesage-bubble-reply-main"
              role="menuitem"
              tabIndex={0}
              onClick={handleReplyMessage}
            >
              <header className="title">{sender}</header>
              {Context && <Context message={replyMessage} />}
            </div>
            )
          */}
          {children}
          {/*<MessageProgress message={message} />*/}
        </div>
        {
          Plugins && (
          <div className="message-plugin">
            {PluginsShow && <Plugins />}
          </div>
          )
        }
      </div>
      <div className="message-bubble-status icon">
        {
          message?.status === MESSAGE_STATUS.FAIL
          && <i className="icon-fail" />
        }
        {
          message?.status === MESSAGE_STATUS.UNSEND
          && <Icon width={10} height={10} component={LoadingOutlined} />
        }
      </div>
    </div>
  );
}