import {
  format, isToday, isYesterday, formatDistance, isThisYear, isThisWeek,
} from 'date-fns';
import React from 'react';
import { Conversation, ConversationType, Group, Profile } from '../../types';
// import { defaultGroupAvatarWork, defaultUserAvatar } from '../Avatar';
import { formatEmojiString } from '../UIMessage/utils/emojiMap';

export const getDisplayTitle = (
  conversation: Conversation,
  searchValue?: string,
  highlightColor = '#147AFF',
): string | React.ReactElement => {
  /*
  const {
    name, nick, groupID, userID,
  } = getMessageProfile(conversation);
  */
  const { name } = conversation;

  const { type } = conversation;
  let title = '';
  switch (type) {
    case ConversationType.Private:
      // title = nick || userID;
      title = name;

      break;
    case ConversationType.Group:
      // title = name || groupID;
      title = name;

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
  // const { avatar } = getMessageProfile(conversation);
  const { avatar } = conversation;

  let displayImage = avatar;
  if (!avatar) {
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
    fromAccount, nick, nameCard, isRevoked,
  } = last_message;
  

  let from = '';
  switch (type) {
    case ConversationType.Group:
      from = last_message?.fromAccount === myProfile?.id ? 'You: ' : `${nameCard || nick || fromAccount}: `;
      break;
    case ConversationType.Private:
      from = isRevoked ? 'you ' : '';
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
      <span>{last_message.isRevoked ? 'recalled a message' : formatEmojiString(
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
      <span>{from}</span>
      <span>{conversation.last_message?.isRevoked ? 'recalled a message' : formatEmojiString(conversation.last_message?.text, 1)}</span>
    </div>
  );
};

interface TProfile extends Profile, Group {}

export const getMessageProfile = (conversation: Conversation): TProfile => {
  if (!conversation) return null;
  let result = {};
  // const { type, groupProfile, userProfile } = conversation;
  const groupProfile = {};
  const userProfile = {};

  switch (type) {
    case ConversationType.Private:
      result = userProfile;
      break;
    case ConversationType.Group:
      result = groupProfile;
      break;
    case ConversationType.System:
    default:
  }
  return result as TProfile;
};

export const getDisplayTime = (conversation: Conversation) => {
  const { last_message } = conversation;
  return getTimeStamp(last_message?.sent_at);
};

export const getTimeStamp = (time: number) => {
  if (!time) {
    return '';
  }

  if (!isThisYear(time)) {
    return format(time, 'yyyy MMM dd');
  }

  if (isToday(time)) {
    return format(time, 'p');
  }

  if (isYesterday(time)) {
    return formatDistance(time, new Date());
  }

  if (isThisWeek(time)) {
    return format(time, 'eeee');
  }

  return format(time, 'MMM dd');
};