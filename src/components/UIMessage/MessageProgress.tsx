import React, {
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { MESSAGE_STATUS } from '../../constants';
import { Message, MessageType } from '../../types';
import { useChatStateContext, useUIMessageContext } from '../../context';

export interface MessageProgressProps {
  message?: Message,
  className?: string,
  Progress?: React.ComponentType<{message: Message}>,
  isShow?: boolean,
}

interface MessageProgressItem extends Message {
  progress?: number,
}

function MessageProgressWithContext <T extends MessageProgressProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    children,
    Progress: propsProgress,
    isShow: propsIsShow = true,
  } = props;

  const [progressMessage, setProgressMessage] = useState<Message>();
  const [progress, setProgress] = useState<number>(0);

  const { uploadPenddingMessageList } = useChatStateContext('MessageProgressWithContext');
  const { isShowProgress: contextIsShow = false, Progress: contextProgress } = useUIMessageContext('MessageProgressWithContext');

  const Progress = propsProgress || contextProgress;
  const isShow = propsIsShow || contextIsShow;


  const handleLoading = () => !!((
    message?.type === MessageType.Image
    || message?.type === MessageType.Video
    || message?.type === MessageType.File
  ) && (!message?.status || message?.status === MESSAGE_STATUS.UNSEND));

  useEffect(() => {
    if (uploadPenddingMessageList && uploadPenddingMessageList.length > 0) {
      uploadPenddingMessageList.map((item: MessageProgressItem) => {
        if (item?.id === message?.id) {
          setProgressMessage(item);
          setProgress(item?.progress);
        }
        return item;
      });
    }
  }, [uploadPenddingMessageList]);

  if (!isShow) {
    return null;
  }

  if (Progress) {
    return <Progress message={progressMessage} />;
  }

  return handleLoading() && (
    <div className="progress-box">
      <span
        className="progress"
        style={
        {
          width: `${(message as any).progress * 100}%`,
        }
      }
      />
      {children}
    </div>
  );
}

const MemoizedMessageProgress = React.memo(MessageProgressWithContext) as
typeof MessageProgressWithContext;

export function MessageProgress(props: MessageProgressProps):React.ReactElement {
  return (
    <MemoizedMessageProgress {...props} />
  );
}
