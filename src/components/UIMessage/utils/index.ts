import { Conversation, ConversationType, GroupTipOperationType, Message, MessageType } from '../../../types';
import { decodeText } from './decodeText';
import { MESSAGE_STATUS } from '../../../constants';
import { JSONStringToParse } from '../../utils';
import { TFunction } from 'i18next';

// Handling avatars
export function handleAvatar(item: any) {
  let avatar = '';
  switch (item.type) {
    case ConversationType.Private:
      avatar = isUrl(item?.userProfile?.avatar)
        ? item?.userProfile?.avatar
        : 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png';
      break;
    case ConversationType.Group:
      avatar = isUrl(item?.groupProfile?.avatar)
        ? item?.groupProfile?.avatar
        : 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/im/demo/TUIkit/web/img/constomer.svg';
      break;
    default:
      avatar = isUrl(item?.groupProfile?.avatar)
        ? item?.groupProfile?.avatar
        : 'https://web.sdk.qcloud.com/component/TUIKit/assets/group_avatar.png';
      break;
  }
  return avatar;
}

// Handling names
export function handleName(item: Conversation) {
  let name = '';
  switch (item.type) {
    case ConversationType.Private:
      name = item?.name;; // item?.userProfile.nick || item?.userProfile?.userID || '';
      break;
    case ConversationType.Group:
      name = item?.name; // item.groupProfile.name || item?.groupProfile?.groupID || '';
      break;
    default:
      name = '系统通知';
      break;
  }
  return name;
}
// Handle whether there is someone@
export function handleAt(item: any) {
  const List = [
    `['UIConversation.有人@我']`,
    `['UIConversation.@所有人']`,
    `['UIConversation.@所有人']['UIConversation.有人@我']`,
  ];
  let showAtType = '';
  for (let index = 0; index < item.groupAtInfoList.length; index += 1) {
    if (item.groupAtInfoList[index].atTypeArray[0] && item.unreadCount > 0) {
      showAtType = List[item.groupAtInfoList[index].atTypeArray[0] - 1];
    }
  }
  return showAtType;
}
// Internal display of processing message box
export function handleShowLastMessage(t: TFunction, item: Conversation) {
  const { last_message } = item;
  const conversation = item;
  let showNick = '';
  let lastMessagePayload = '';
  // Judge the number of unread messages and display them only
  // when the message is enabled without interruption.
  const showUnreadCount = conversation.unread > 0
    /* TODO && conversation.messageRemindType === TIM.TYPES.MSG_REMIND_ACPT_NOT_NOTE*/
    ? t(`[${conversation.unread > 99 ? '99+' : conversation.unread}条]`)
    : '';
  // Determine the lastmessage sender of the group.
  // Namecard / Nick / userid is displayed by priority
  if (conversation.type === ConversationType.Group) {
    if (last_message.fromAccount === conversation.account /* conversation.groupProfile.selfInfo.userID*/) {
      showNick = t('UIConversation.我');
    } else {
      showNick = last_message.nameCard || last_message.nick || last_message.fromAccount;
    }
  }
  // Display content of lastmessage message body
  if (last_message.type === MessageType.Text) {
    lastMessagePayload = last_message.text;
  } else {
    // TODO lastMessagePayload = last_message.messageForShow;
  }

  if (last_message.revoked) {
    lastMessagePayload = t('UIChat.撤回了一条消息');
  }

  if (conversation.type === ConversationType.Group && last_message.type === MessageType.GroupTip) {
    return lastMessagePayload;
  }

  // Specific display content of message box
  return `${showUnreadCount}${showNick ? `${showNick}:` : ''}${lastMessagePayload}`;
}

// Handling system tip message display
export function handleTipMessageShowContext(t: TFunction, message: Message) {
  const options = {
    message,
    text: '',
  };
  let userName = message.nick || message?.tip?.userIDList.join(',');
  if (message?.tip?.memberList?.length > 0) {
    userName = '';
    message?.tip?.memberList?.map((user: any) => {
      userName += `${user?.nick || user?.userID},`;
      return user;
    });
    userName = userName.slice(0, -1);
  }
  switch (message.tip.operationType) {
    case GroupTipOperationType.MemberJoin:
      options.text = `${userName} ${t('message.tip.Join in group')}`;
      break;
    case GroupTipOperationType.MemberQuit:
      options.text = `${t('message.tip.member')}：${userName} ${t('message.tip.quit group')}`;
      break;
    case GroupTipOperationType.MemberKickedOut:
      options.text = `${t('message.tip.member')}：${userName} ${t('message.tip.by')}${message.tip.operatorID}${t(
        'message.tip.kicked out of group',
      )}`;
      break;
    case GroupTipOperationType.MemberSetAdmin:
      options.text = `${t('message.tip.member')}：${userName} ${t('message.tip.become admin')}`;
      break;
    case GroupTipOperationType.MemberCanceledAdmin:
      options.text = `${t('message.tip.member')}：${userName} ${t('message.tip.by revoked administrator')}`;
      break;
    case GroupTipOperationType.GroupProfileUpdated:
      // options.text =  `${userName} 修改群组资料`;
      options.text = handleTipGrpUpdated(t, message);
      break;
    case GroupTipOperationType.MemberProfileUpdated:
      message.tip.memberList.map((member:any) => {
        if (member.muteTime > 0) {
          options.text = `${t('message.tip.member')}：${member.userID}${t('message.tip.muted')}`;
        } else {
          options.text = `${t('message.tip.member')}：${member.userID}${t('message.tip.unmuted')}`;
        }
        return member;
      });
      break;
    default:
      options.text = `[${t('message.tip.reminder message')}]`;
      break;
  }
  return options;
}

function handleTipGrpUpdated(t: TFunction, message: Message) {
  const { tip } = message;
  const { newGroupProfile } = tip;
  const { operatorID } = tip;
  let text = '';
  const name = Object.keys(newGroupProfile)[0];
  switch (name) {
    case 'muteAllMembers':
      if (newGroupProfile[name]) {
        text = `${t('message.tip.admin')} ${operatorID} ${t('message.tip.enable all staff mute')}`;
      } else {
        text = `${t('message.tip.admin')} ${operatorID} ${t('message.tip.unmute everyone')}`;
      }
      break;
    case 'ownerID':
      text = `${newGroupProfile[name]} ${t('message.tip.become the new owner')}`;
      break;
    case 'groupName':
      text = `${operatorID} ${t('message.tip.modify group name')} ${newGroupProfile[name]}`;
      break;
    case 'notification':
      text = `${operatorID} ${t('message.tip.post a new announcement')}`;
      break;
    default:
      break;
  }
  return text;
}

// Parsing and handling text message display
export function handleTextMessageShowContext(item: any) {
  const options = {
    text: decodeText(item.text),
  };
  return options;
}

// Parsing and handling face message display
export function handleFaceMessageShowContext(item: any) {
  const face = {
    message: item,
    name: '',
    url: '',
  };
  face.name = item.payload.data;
  if (item.payload.data.indexOf('@2x') < 0) {
    face.name = `${face.name}@2x`;
  }
  face.url = `https://web.sdk.qcloud.com/im/assets/face-elem/${face.name}.png`;
  return face;
}

// Parsing and handling location message display
export function handleLocationMessageShowContext(item: any) {
  const location: any = {
    lon: '',
    lat: '',
    href: '',
    url: '',
    description: '',
    message: item,
  };
  location.lon = item.payload.longitude.toFixed(6);
  location.lat = item.payload.latitude.toFixed(6);
  location.href = 'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&'
    + `pointx=${location.lon}&pointy=${location.lat}&name=${item.payload.description}`;
  location.url = 'https://apis.map.qq.com/ws/staticmap/v2/?'
    + `center=${location.lat},${location.lon}&zoom=10&size=300*150&maptype=roadmap&`
    + `markers=size:large|color:0xFFCCFF|label:k|${location.lat},${location.lon}&`
    + 'key=UBNBZ-PTP3P-TE7DB-LHRTI-Y4YLE-VWBBD';
  location.description = item.payload.description;
  return location;
}

// Parsing and handling image message display
export function handleImageMessageShowContext(item: any) {
  if (item.file) item.file.url = URL.createObjectURL(item.file);

  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item.progress,
    url: (item.image && item.image.infos && item.image.infos.length > 0) ? item.image.infos[1].url : '', // TODO default
    message: item,
  };
}

// Parsing and handling video message display
export function handleVideoMessageShowContext(item: any) {
  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item?.progress,
    url: item?.video?.url,
    snapshot: item?.video?.snapshot,
    message: item,
  };
}

// Parsing and handling audio message display
export function handleAudioMessageShowContext(item: any) {
  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item.progress,
    url: item.audio.url,
    message: item,
    second: item.audio.duration,
  };
}

// Parsing and handling file message display
export function handleFileMessageShowContext(item: any) {
  let size = '';
  if (item.payload.fileSize >= 1024 * 1024) {
    size = `${(item.payload.fileSize / (1024 * 1024)).toFixed(2)} Mb`;
  } else if (item.payload.fileSize >= 1024) {
    size = `${(item.payload.fileSize / 1024).toFixed(2)} Kb`;
  } else {
    size = `${item.payload.fileSize.toFixed(2)}B`;
  }
  return {
    progress: item?.status === MESSAGE_STATUS.UNSEND && item.progress,
    url: item.payload.fileUrl,
    message: item,
    name: item.payload.fileName,
    size,
  };
}

// Parsing and handling merger message display
export function handleMergerMessageShowContext(item: Message) {
  return { message: item, ...item[item.type] };
}

// Parse audio and video call messages
export function extractCallingInfoFromMessage(t: TFunction,message: Message) {
  let callingmessage:any = {};
  let objectData:any = {};
  try {
    callingmessage = JSONStringToParse(message.calling.data);
  } catch (error) {
    callingmessage = {};
  }
  if (callingmessage.businessID !== 1) {
    return '';
  }
  try {
    objectData = JSONStringToParse(callingmessage.data);
  } catch (error) {
    objectData = {};
  }
  switch (callingmessage.actionType) {
    case 1: {
      if (objectData.call_end >= 0 && !callingmessage.groupID) {
        return `${t('message.custom.talkTime')}：${formatTime(objectData.call_end)}`;
      }
      if (callingmessage.groupID) {
        return `${t('message.custom.groupCallEnd')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToAudio') {
        return `${t('message.custom.switchToAudioCall')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToVideo') {
        return `${t('message.custom.switchToVideoCall')}`;
      }
      return `${t('message.custom.all')}`;
    }
    case 2:
      return `${t('message.custom.cancel')}`;
    case 3:
      if (objectData.data && objectData.data.cmd === 'switchToAudio') {
        return `${t('message.custom.switchToAudioCall')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToVideo') {
        return `${t('message.custom.switchToVideoCall')}`;
      }
      return `${t('message.custom.accepted')}`;
    case 4:
      return `${t('message.custom.rejected')}`;
    case 5:
      if (objectData.data && objectData.data.cmd === 'switchToAudio') {
        return `${t('message.custom.switchToAudioCall')}`;
      }
      if (objectData.data && objectData.data.cmd === 'switchToVideo') {
        return `${t('message.custom.switchToVideoCall')}`;
      }
      return `${t('message.custom.noResp')}`;
    default:
      return '';
  }
}

// Parsing and handling custom message display
export function handleCustomMessageShowContext(t: TFunction, item: Message) {
  return {
    message: item,
    custom: extractCallingInfoFromMessage(t, item) || item?.calling || `[${t('message.custom.custom')}]`,
  };
}

// Parsing and handling system message display
export function translateGroupSystemNotice(t: TFunction, message: Message) {
  const groupName = message.group_system_notice.groupProfile.name || message.group_system_notice.groupProfile.groupID;
  switch (message.group_system_notice.operationType) {
    case 1:
      return `${message.group_system_notice.operatorID} ${t('message.tip.申请加入群组')}：${groupName}`;
    case 2:
      return `${t('message.tip.成功加入群组')}：${groupName}`;
    case 3:
      return `${t('message.tip.申请加入群组')}：${groupName} ${t('message.tip.被拒绝')}`;
    case 4:
      return `${t('message.tip.你被管理员')}${message.group_system_notice.operatorID} ${t('message.tip.踢出群组')}：${groupName}`;
    case 5:
      return `${t('message.tip.群')}：${groupName} ${t('message.tip.被')} ${message.group_system_notice.operatorID} ${t(
        'message.tip.解散',
      )}`;
    case 6:
      return `${message.group_system_notice.operatorID} ${t('message.tip.创建群')}：${groupName}`;
    case 7:
      return `${message.group_system_notice.operatorID} ${t('message.tip.邀请你加群')}：${groupName}`;
    case 8:
      return `${t('message.tip.你退出群组')}：${groupName}`;
    case 9:
      return `${t('message.tip.你被')}${message.group_system_notice.operatorID} ${t('message.tip.设置为群')}：${groupName} ${t(
        'message.tip.的管理员',
      )}`;
    case 10:
      return `${t('message.tip.你被')}${message.group_system_notice.operatorID} ${t('message.tip.撤销群')}：${groupName} ${t(
        'message.tip.的管理员身份',
      )}`;
    case 12:
      return `${message.group_system_notice.operatorID} ${t('message.tip.邀请你加群')}：${groupName}`;
    case 13:
      return `${message.group_system_notice.operatorID} ${t('message.tip.同意加群')}：${groupName}`;
    case 14:
      return `${message.group_system_notice.operatorID} ${t('message.tip.拒接加群')}：${groupName}`;
    case 255:
      return `${t('message.tip.自定义群系统通知')}: ${message.group_system_notice.userDefinedField}`;
    default:
      return '';
  }
}

// Image loading complete
export function getImgLoad(container: Document, className: string, callback: () => void) {
  const images = container?.querySelectorAll(`.${className}`) || [];
  const promiseList = Array.prototype.slice.call(images).map(
    (node: HTMLImageElement) => new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = node.src;
      loadImg.onload = () => {
        resolve(node);
      };
    }),
  );

  Promise.all(promiseList)
    .then(() => {
      callback();
    })
    .catch((e) => {
      console.error('网络异常', e);
    });
}

// Determine whether it is url
export function isUrl(url: string) {
  return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url);
}

// Handling custom message options
export function handleOptions(businessID: string, version: number, other: Message) {
  return {
    businessID,
    version,
    ...other,
  };
}

// Determine if it is a typing message
export function isTypingMessage(item: Message) {
  /* TODO
  if (!item) return false;
  try {
    const { businessID } = JSONStringToParse(item?.payload?.data);
    if (businessID === TYPE_TYPING) return true;
  } catch {
    return false;
  }
  return false;
  */
 return false;
}

export function formatTime(secondTime:number) {
  const time:number = secondTime;
  let newTime; let hour; let minite; let seconds;
  if (time >= 3600) {
    hour = parseInt(`${time / 3600}`, 10) < 10 ? `0${parseInt(`${time / 3600}`, 10)}` : parseInt(`${time / 3600}`, 10);
    minite = parseInt(`${(time % 60) / 60}`, 10) < 10 ? `0${parseInt(`${(time % 60) / 60}`, 10)}` : parseInt(`${(time % 60) / 60}`, 10);
    seconds = time % 3600 < 10 ? `0${time % 3600}` : time % 3600;
    if (seconds > 60) {
      minite = parseInt(`${seconds / 60}`, 10) < 10 ? `0${parseInt(`${seconds / 60}`, 10)}` : parseInt(`${seconds / 60}`, 10);
      seconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
    }
    newTime = `${hour}:${minite}:${seconds}`;
  } else if (time >= 60 && time < 3600) {
    minite = parseInt(`${time / 60}`, 10) < 10 ? `0${parseInt(`${time / 60}`, 10)}` : parseInt(`${time / 60}`, 10);
    seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
    newTime = `00:${minite}:${seconds}`;
  } else if (time < 60) {
    seconds = time < 10 ? `0${time}` : time;
    newTime = `00:00:${seconds}`;
  }
  return newTime;
}







/**
 * Following function validates a function which returns notification message.
 * It validates if the first parameter is function and also if return value of function is string or no.
 */
 export const validateAndGetMessage = <T extends unknown[]>(
  func: (...args: T) => unknown,
  args: T,
) => {
  if (!func || typeof func !== 'function') return null;

  // below is due to tests passing a single argument
  // rather than an array.
  if (!(args instanceof Array)) {
    // @ts-expect-error
    args = [args];
  }

  const returnValue = func(...args);

  if (typeof returnValue !== 'string') return null;

  return returnValue;
};