import { ChatState } from '../../store/chatState';
import { Message, MessageType } from '../../types';

export const handleMessage = (messageList: Array<Message>): Array<Message> => {
  let customPayloadData = null;
  return messageList.filter((item) => {
    if (item.type === MessageType.Custom) {
      customPayloadData = JSON.parse(item?.data);
    }

    return true;
  });
};

export const handleMessageList = (
  list:Array<Message>,
  lastMessageID: string,
) => {
  const data = {
    messageList: [],
    lastMessageID: '',
    isSameLastMessageID: false,
  };
  data.messageList = list;
  if (data.messageList.length >= 1) {
    data.lastMessageID = data?.messageList[data.messageList.length - 1]?.id;
  }
  data.messageList = data.messageList.filter((item) => !item?.isDeleted);
  data.isSameLastMessageID = data?.lastMessageID === lastMessageID;

  return data;
};

export const handleEditMessage = (
  messageList: Array<Message>,
  message: Message,
) => {
  const list = [...messageList];
  const index = list.findIndex((item) => item?.id === message?.id);
  list[index] = message;

  return list;
};

export const handleRemoveMessage = (
  messageList: Array<Message>,
  message: Message,
) => {
  const list = [...messageList];
  const index = list.findIndex((item) => item?.id === message?.id);
  list.splice(index, 1);

  return list;
};

export const handleUploadPendingMessage = (
  messageList: Array<Message>,
  message: Message,
) => {
  const list = [...messageList];
  if (!list.some((item: Message) => item.id === message.id)) {
    list.push(message);
  }
  const index = list.findIndex((item) => item?.id === message?.id);
  list[index] = message;

  return list;
};