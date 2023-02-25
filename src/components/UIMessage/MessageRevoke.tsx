import React, { PropsWithChildren, useCallback } from 'react';
import { MESSAGE_FLOW, MESSAGE_OPERATE } from '../../constants';
import type { MessageContextProps } from './MessageText';
import { useChatActionContext } from '../../context';
import { MessageType } from '../../types';

function MessageRevokeWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const { operateMessage } = useChatActionContext('MessageRevokeWithContext');

  const handleRevoke = useCallback(() => {
    operateMessage({
      [MESSAGE_OPERATE.REVOKE]: message,
    });
  }, [operateMessage]);

  return (
    <div className="bubble message-system message-revoke">
      {
        message?.flow === MESSAGE_FLOW.IN && <span>{message?.nick || message?.from}</span>
      }
      {
        message?.flow !== MESSAGE_FLOW.IN && <span>you </span>
      }
      <span> recalled a message</span>
      {
        message?.flow === MESSAGE_FLOW.OUT
        && message?.type === MessageType.Text
        && <span className="edit" role="button" tabIndex={0} onClick={handleRevoke}> Re-edit</span>
      }
    </div>
  );
}

const MemoizedMessageRevoke = React.memo(MessageRevokeWithContext) as
typeof MessageRevokeWithContext;

export function MessageRevoke(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageRevoke {...props} />
  );
}
