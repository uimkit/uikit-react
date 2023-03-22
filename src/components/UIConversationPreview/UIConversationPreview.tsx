import React, { useState, useEffect } from 'react';
import { UIKitContextProps, useTranslationContext, useUIKit } from '../../context';
import { UIConversationPreviewContent } from '../UIConversationPreview/UIConversationPreviewContent';
import { Conversation } from '../../types';
import { getDisplayImage, getDisplayMessage, getDisplayTitle } from './utils';
import { useIMAccount } from '../../hooks/useIMAccount';
import { AvatarProps } from '../Avatar';

import './styles/index.scss';
import { getDateString } from '../../i18n/utils';

export interface UIConversationPreviewComponentProps extends UIConversationPreviewProps {
  /** If the component's Conversation is the active (selected) Conversation */
  active?: boolean,
  /** Image of Conversation to display */
  displayImage?: string,
  /** Title of Conversation to display */
  displayTitle?: string | React.ReactElement,
  /** Message of Conversation to display */
  displayMessage?: string | React.ReactElement,
  /** Time of Conversation to display */
  displayTime?: string,
  /** Number of unread Messages */
  unread?: number,
}

export interface UIConversationPreviewProps {
  conversation: Conversation,
  activeConversation?: Conversation,
  Preview?: React.ComponentType<UIConversationPreviewComponentProps>,
  Avatar?: React.ComponentType<AvatarProps>
  setActiveConversation?: UIKitContextProps['setActiveConversation'],
  searchValue?: string,
  conversationUpdateCount?: number
}
export function UIConversationPreview<T extends UIConversationPreviewProps>(
  props: T,
):React.ReactElement {
  const {
    activeConversation,
    conversation,
    Preview = UIConversationPreviewContent,
    searchValue,
    conversationUpdateCount,
  } = props;
  
  const {
    setActiveConversation,
  } = useUIKit('ConversationPreview');

  const imAccount = useIMAccount(activeConversation?.accountId);

  const [displayImage, setDisplayImage] = useState(getDisplayImage(conversation));
  const [displayTitle, setDisplayTitle] = useState(getDisplayTitle(conversation, searchValue));
  const [displayMessage, setDisplayMessage] = useState(getDisplayMessage(conversation, imAccount));

  const { tDateTimeParser } = useTranslationContext();

  const { last_message } = conversation;
  const formattedDate = getDateString({
    tDateTimeParser: tDateTimeParser,
    messageCreatedAt: last_message?.sent_at ? new Date(last_message?.sent_at) : null,
  });

  const [displayTime, setDisplayTime] = useState(formattedDate);


  const [unread, setUnread] = useState(conversation.unread);
  const isActive = activeConversation?.id === conversation?.id;
  if (!Preview) return null;
  useEffect(() => {
    const { last_message } = conversation;
    const formattedDate = getDateString({
      tDateTimeParser,
      messageCreatedAt: last_message?.sent_at ? new Date(last_message?.sent_at) : null,
    });

    setDisplayTitle(getDisplayTitle(conversation, searchValue));
    setDisplayMessage(getDisplayMessage(conversation, imAccount));
    setDisplayImage(getDisplayImage(conversation));
    setDisplayTime(formattedDate);
    setUnread(conversation.unread);
  }, [conversation, searchValue, conversationUpdateCount]);

  return (
    <Preview
      {...props}
      active={isActive}
      displayImage={displayImage}
      displayTitle={displayTitle}
      displayMessage={displayMessage}
      displayTime={displayTime}
      unread={unread}
      setActiveConversation={setActiveConversation}
    />
  );
}