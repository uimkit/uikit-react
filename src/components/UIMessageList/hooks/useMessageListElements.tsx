import React, {
  PropsWithChildren, useMemo,
} from 'react';
import { Message } from '../../../types';
import { UnknowPorps, useComponentContext } from '../../../context';
import { UIMessageProps } from '../../UIMessage/UIMessage';
import { DateSeparator as DefaultDateSeparator } from '../../DateSeparator';

export interface MessageListElementProps {
  enrichedMessageList: Array<Message>;
  UIMessage?: React.ComponentType<UIMessageProps | UnknowPorps>;
  intervalsTimer?: number;
  onMessageLoadCaptured: (event: React.SyntheticEvent<HTMLLIElement, Event>) => void;
  internalMessageProps: any; // Omit<MessageProps, MessagePropsToOmit>;
}

export function useMessageListElements <T extends MessageListElementProps>(
  props: PropsWithChildren<T>,
) {
  const {
    enrichedMessageList,
    UIMessage,
    intervalsTimer,
    onMessageLoadCaptured,
    internalMessageProps,
  } = props;

  const {
    DateSeparator = DefaultDateSeparator,
  } = useComponentContext('useMessageListElements');

  return useMemo(() => enrichedMessageList?.map((message: Message, index: number) => {
    // console.log('useMessageList');
    const preMessageTimer = index > 0 ? enrichedMessageList[index - 1]?.sent_at: -1;
    const currrentTimer = message?.sent_at ?? 0;
    const isShowIntervalsTimer = preMessageTimer !== -1
      ? (currrentTimer - preMessageTimer) >= intervalsTimer : false;
    return (
      <li key={message.id} className="message-list-item" onLoadCapture={onMessageLoadCaptured}>
        {
          isShowIntervalsTimer && <DateSeparator date={currrentTimer ? new Date(currrentTimer) : null} formatDate={internalMessageProps.formatDate} />
        }
        <UIMessage message={message} {...internalMessageProps} />
      </li>
    );
  }), [
    enrichedMessageList, 
    internalMessageProps,
    UIMessage, 
    intervalsTimer, 
    onMessageLoadCaptured, 
  ]);
}