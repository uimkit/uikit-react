import React, { PropsWithChildren } from 'react';
import type { MessageContextProps } from './MessageText';
import { ConversationType } from '../../types';

function MessageMergerWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  return (
    <div className={`bubble message-merger bubble-${message.flow} ${message?.conversation_type === ConversationType.Group ? 'group' : ''}`}>
      <h3>{context.title}</h3>
      <ul className="message-merger-list">
        {
          context?.abstractList.length > 0
          && context.abstractList.map((item:string, index:number) => {
            const key = item + index;
            return (<li className="message-merger-item" key={key}>{item}</li>);
          })
        }
      </ul>
      {children}
    </div>
  );
}

const MemoizedMessageMerger = React.memo(MessageMergerWithContext) as
typeof MessageMergerWithContext;

export function MessageMerger(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageMerger {...props} />
  );
}