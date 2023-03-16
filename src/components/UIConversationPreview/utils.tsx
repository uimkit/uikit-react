import React from 'react';
import { Conversation, ConversationType, Group, MessageType, Profile } from '../../types';
// import { defaultGroupAvatarWork, defaultUserAvatar } from '../Avatar';
import { formatEmojiString } from '../UIMessage/utils/emojiMap';

export const getDisplayTitle = (
  conversation: Conversation,
  searchValue?: string,
  highlightColor = '#147AFF',
): string | React.ReactElement => {
  const {
    nickname
  } = getMessageProfile(conversation);
  
  const { contact } = conversation;

  const { type } = conversation;
  let title = '';
  switch (type) {
    case ConversationType.Private:
      // title = nick || userID;
      title = nickname;

      break;
    case ConversationType.Group:
      // title = name || groupID;
      title = nickname;

      break;
    default:
      title = '';
  }

  const handleTitle = (str:string) => {
    const tempStr = str.toLocaleLowerCase();
    const pos = tempStr.indexOf(searchValue.toLocaleLowerCase());
    return (
      <div>
        <span>{str.slice(0, pos)}</span>
        <span style={{ color: highlightColor }}>{str.slice(pos, pos + searchValue.length)}</span>
        <span>{str.slice(pos + searchValue.length)}</span>
      </div>
    );
  };
  return !searchValue ? title : handleTitle(title);
};

export const getDisplayImage = (conversation: Conversation) => {
  const { type } = conversation;
  const { avatar } = getMessageProfile(conversation);

  let displayImage = avatar;
  if (!displayImage) {
    switch (type) {
      case ConversationType.Private:
        // displayImage = defaultUserAvatar;
        displayImage = '';

        break;
      case ConversationType.Group:
        // displayImage = defaultGroupAvatarWork;
        displayImage = '';

        break;
      default:
        // displayImage = defaultGroupAvatarWork;
        displayImage = '';
      }
  }

  return displayImage;
};

export const getDisplayMessage = (conversation: Conversation, myProfile: Profile) => {
  /*
  const { last_message, type } = conversation;
  const {
    fromAccount, nick, nameCard, revoked,
  } = last_message;
  

  let from = '';
  switch (type) {
    case ConversationType.Group:
      from = last_message?.fromAccount === myProfile?.id ? 'You: ' : `${nameCard || nick || fromAccount}: `;
      break;
    case ConversationType.Private:
      from = revoked ? 'you ' : '';
      break;
    default:
  }

  return (
    <div style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    >
      <span>{from}</span>
      <span>{last_message.revoked ? 'recalled a message' : formatEmojiString(
        //last_message.messageForShow
        last_message.text, 1)}</span>
    </div>
  );
  */

  const from = conversation.name;

  return (
    <div style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    >
      <span>{conversation.last_message && (
        conversation.last_message?.revoked ? '撤回了一条消息' : (
        <>
          {conversation.last_message.type === MessageType.Text && formatEmojiString(conversation.last_message?.text, 1) }
          {conversation.last_message.type === MessageType.Image && '[图片]' }
          {conversation.last_message.type === MessageType.Video && '[视频]' }
          {conversation.last_message.type === MessageType.File && '[文件]' }
          {conversation.last_message.type === MessageType.Voice && '[语音]' }
          {conversation.last_message.type === MessageType.Location && '[位置]' }
        </>
      ))}</span>
    </div>
  );
};

type TProfile = Profile | Group;

export const getMessageProfile = (conversation: Conversation): TProfile => {
  if (!conversation) return null;
  let result;
  const { type } = conversation;
  const groupProfile = {};
  const userProfile = conversation.contact;
  switch (type) {
    case ConversationType.Private:
      result = userProfile ?? {};
      break;
    case ConversationType.Group:
      result = groupProfile ?? {};
      break;
    case ConversationType.System:
    default:
  }

  return result as TProfile;
};