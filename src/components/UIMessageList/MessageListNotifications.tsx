import React from 'react';
import { useTranslationContext } from '../../context/TranslationContext';
import { MessageNotificationProps } from './MessageNotification';


export type MessageListNotificationsProps = {
  hasNewMessages: boolean;
  isMessageListScrolledToBottom: boolean;
  isNotAtLatestMessageSet: boolean;
  MessageNotification: React.ComponentType<MessageNotificationProps>;
  scrollToBottom: () => void;
  threadList?: boolean;
};

export const MessageListNotifications = (props: MessageListNotificationsProps) => {
  const {
    hasNewMessages,
    isMessageListScrolledToBottom,
    isNotAtLatestMessageSet,
    MessageNotification,
    scrollToBottom,
    threadList,
  } = props;

  const { t } = useTranslationContext('MessageListNotifications');

  return (
    <div className='uim__list-notifications'>
      <MessageNotification
        isMessageListScrolledToBottom={isMessageListScrolledToBottom}
        onClick={scrollToBottom}
        showNotification={hasNewMessages || isNotAtLatestMessageSet}
        threadList={threadList}
      >
        {isNotAtLatestMessageSet ? t<string>('最新消息') : t<string>('新消息!')}
      </MessageNotification>
    </div>
  );
};