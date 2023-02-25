import React, { PropsWithChildren, useState } from 'react';
import { Modal } from '../Modal';
import type { MessageContextProps } from './MessageText';
import { ConversationType } from '../../types';

function MessageImageWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  const [show, setShow] = useState(false);

  // const bigImageInfo = message?.payload?.imageInfoArray?.filter((item) => item.type === 0);
  const bigImageInfo = message?.image?.url;

  return (
    <div className="message-image">
      <div role="button" tabIndex={0} onClick={() => { setShow(true); }}>
        <img className={`img bubble-${message.flow} ${message?.conversationType === ConversationType.Group ? 'group' : ''}`} src={context.url} alt="" />
      </div>
      {children}
      {
        show && (
        <Modal onClick={() => { setShow(false); }}>
          <img className="big-image" src={bigImageInfo[0]?.url} alt="" />
        </Modal>
        )
      }
    </div>
  );
}

const MemoizedMessageImage = React.memo(MessageImageWithContext) as
typeof MessageImageWithContext;

export function MessageImage(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageImage {...props} />
  );
}