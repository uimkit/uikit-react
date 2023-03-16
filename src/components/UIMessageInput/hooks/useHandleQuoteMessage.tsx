import { useEffect, useState } from 'react';
import { MESSAGE_OPERATE } from '../../../constants';
import { MessageType, Message } from '../../../types';
import { useChatStateContext } from '../../../context';

const quoteConfigType = {
  [MessageType.Text]: 1,
  [MessageType.Custom]: 2,
  [MessageType.Image]: 3,
  [MessageType.Audio]: 4,
  [MessageType.Video]: 5,
  [MessageType.File]: 6,
  [MessageType.Face]: 8,
};

const quoteConfigForShow = {
  [MessageType.Custom]: '[custom]',
  [MessageType.Image]: '[image]',
  [MessageType.Audio]: '[audio]',
  [MessageType.Video]: '[video]',
  [MessageType.File]: '[file]',
  [MessageType.Face]: '[face]',
};

export function useHandleQuoteMessage(msg?: Message) {
  const { operateData } = useChatStateContext();

  const [cloudCustomData, setCloudCustomData] = useState({ messageReply: null });

  const handleQuoteMessage = (message: Message) => {
    const messageType = quoteConfigType[message?.type];
    const messageAbstract = message?.type === MessageType.Text
      ? message?.text
      : quoteConfigForShow[message?.type];

    return {
      messageAbstract,
      messageSender: message?.nick || message?.from,
      messageID: message?.id,
      messageType,
      version: 1,
    };
  };

  useEffect(
    () => {
      const message = msg || operateData[MESSAGE_OPERATE.QUOTE];
      setCloudCustomData(
        {
          messageReply: message ? handleQuoteMessage(message) : null,
        },
      );
    },
    [operateData, msg],
  );

  return {
    cloudCustomData,
    handleQuoteMessage,
    message: msg || operateData[MESSAGE_OPERATE.QUOTE],
  };
}