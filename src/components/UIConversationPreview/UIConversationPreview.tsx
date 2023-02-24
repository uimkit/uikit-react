import React, { useState, useEffect } from 'react';
import { UIKitContextProps, useUIKit } from '../../context';
import { UIConversationPreviewContent } from '../UIConversationPreview/UIConversationPreviewContent';
import { Conversation } from '../../types';
import { getDisplayImage, getDisplayMessage, getDisplayTime, getDisplayTitle } from './utils';
import { useIMAccount } from '../../hooks/useIMAccount';
import { AvatarProps } from '../Avatar';


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
  const [displayTime, setDisplayTime] = useState(getDisplayTime(conversation));
  const [unread, setUnread] = useState(conversation.unread);
  const isActive = activeConversation?.id === conversation?.id;
  if (!Preview) return null;
  useEffect(() => {
    setDisplayTitle(getDisplayTitle(conversation, searchValue));
    setDisplayMessage(getDisplayMessage(conversation, imAccount));
    setDisplayImage(getDisplayImage(conversation));
    setDisplayTime(getDisplayTime(conversation));
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