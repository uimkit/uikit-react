import React, { PropsWithChildren, useCallback } from 'react';
import './styles/index.scss';

import { Message } from '../../types';
import { useChatActionContext } from '../../context';
import { Icon, IconTypes } from '../Icon';
import { MESSAGE_OPERATE } from '../../constants';
import { useHandleQuoteMessage } from './hooks/useHandleQuoteMessage';
import { formatEmojiString } from '../UIMessage/utils/emojiMap';

interface InputQuoteProps {
  message?: Message
}

export function InputQuoteDefault <T extends InputQuoteProps>(
  props:PropsWithChildren<T>,
):React.ReactElement {
  const {
    message: propsMessage,
  } = props;

  const { operateMessage } = useChatActionContext('MessageRevokeWithContext');
  const { cloudCustomData, message } = useHandleQuoteMessage(propsMessage);

  const handleClose = useCallback(() => {
    operateMessage({
      [MESSAGE_OPERATE.QUOTE]: null,
    });
  }, [operateMessage]);

  const context = cloudCustomData?.messageReply;

  return context && (
    <div className="input-quote">
      <div className="input-quote-content">
        <label htmlFor="input-quote-content">{message?.nick || message?.from}</label>
        <span>{formatEmojiString(context?.messageAbstract, 1)}</span>
      </div>
      <Icon className="icon" width={12} height={12} type={IconTypes.CLOSE} onClick={handleClose} />
    </div>
  );
}