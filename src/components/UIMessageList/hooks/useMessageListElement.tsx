import React, {
  PropsWithChildren, useMemo,
} from 'react';
import { Message } from '../../../types';
import { UnknowPorps } from '../../../context';
import { UIMessageProps } from '../../UIMessage/UIMessage';
import { getTimeStamp } from '../../utils';

interface MessageListElementProps {
  enrichedMessageList: Array<Message>;
  UIMessage?: React.ComponentType<UIMessageProps | UnknowPorps>,
  intervalsTimer?: number
}

function useMessageListElement <T extends MessageListElementProps>(
  props: PropsWithChildren<T>,
) {
  const {
    enrichedMessageList,
    UIMessage,
    intervalsTimer,
  } = props;

  return useMemo(() => enrichedMessageList?.map((item: Message, index:number) => {
    const key = `${JSON.stringify(item)}${index}`;
    const preMessageTImer = index > 0 ? enrichedMessageList[index - 1]?.sent_at: -1;
    const currrentTimer = item?.sent_at || 0;
    const isShowIntervalsTImer = preMessageTImer !== -1
      ? (currrentTimer - preMessageTImer) >= intervalsTimer : false;
    return (
      <>
        {
         isShowIntervalsTImer && <div className="message-list-time" key={`${currrentTimer + index}`}>{currrentTimer ? getTimeStamp(currrentTimer * 1000) : 0}</div>
       }
        <li className="message-list-item" key={key}>
          <UIMessage message={item} />
        </li>

      </>
    );
  }), [enrichedMessageList]);
}

export default useMessageListElement;
