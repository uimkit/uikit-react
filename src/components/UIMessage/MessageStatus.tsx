import React, { PropsWithChildren } from 'react';
import { Message } from '../../types';
import { useTranslationContext, useUIMessageContext } from '../../context';
import { getDateString } from '../../i18n/utils';

export interface MessageContextProps {
  message?: Message,
}

function MessageStatustWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const { tDateTimeParser } = useTranslationContext('DateSeparator');

  const {
    isShowTime,
  } = useUIMessageContext('MessageStatustWithContext');

  const formattedDate = getDateString({ 
    tDateTimeParser,
    messageCreatedAt: message?.sent_at,
  });

  const timeElement = (!!isShowTime) && <div className="time">{formattedDate}</div>;

  return (
    <div className="message-status">
      {timeElement}
    </div>
  );
}

const MemoizedMessageStatus = React.memo(MessageStatustWithContext) as
typeof MessageStatustWithContext;

export function MessageStatus(props: MessageContextProps): React.ReactElement {
  return (
    <MemoizedMessageStatus
      {...props}
    />
  );
}