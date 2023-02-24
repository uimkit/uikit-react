import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Conversation, ConversationType, Group } from "../../types";
import { Avatar } from '../Avatar';
import { handleDisplayAvatar } from '../utils';
import { useUIKit } from '../../context';
import { Icon, IconTypes } from '../Icon';



export interface UIChatHeaderDefaultProps {
  title?: string,
  avatar?: React.ReactElement | string,
  isOnline?: boolean,
  conversation?: Conversation,
  pluginComponentList?: Array<React.ComponentType>,

}

export interface UIChatHeaderBasicProps extends UIChatHeaderDefaultProps {
  isLive?: boolean,
  operateIcon?: React.ReactElement | string,
}



export function UIChatHeaderDefault <T extends UIChatHeaderBasicProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    title: propTitle,
    avatar: propAvatar,
    isOnline,
    conversation,
    isLive,
    operateIcon,
  } = props;

  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState<React.ReactElement | string>('');

  useEffect(() => {
    setTitle(propTitle);
    if (propAvatar) {
      setAvatar(propAvatar);
    }

    switch (conversation?.type) {
      case ConversationType.Private:
        handleC2C(/*conversation.userProfile*/conversation, conversation);
        break;
      case ConversationType.Group:
        handleGroup(/*conversation.groupProfile*/conversation, conversation);
        break;
      case ConversationType.System:
        setTitle('System Notice');
        break;
      default:
        setTitle('');
        break;
    }
  }, [conversation]);

  const handleC2C = (conversation: Conversation, userProfile: any) => {
    if (!title) {
      setTitle(userProfile?.name || userProfile?.id);
    }

    if (!propAvatar) {
      setAvatar(<Avatar size={32} image={handleDisplayAvatar(conversation.avatar)} />);
    }
  };

  const handleGroup = (conversation: Conversation, groupProfile: any) => {
    if (!title) {
      setTitle(groupProfile?.name || groupProfile?.id);
    }
    if (!propAvatar) {
      setAvatar(<Avatar
        size={32}
        image={handleDisplayAvatar(conversation.avatar, ConversationType.Group)}
      />);
    }
  };
  
  // const { setUIManageShow } = useUIKit();
  const openUIManage = () => {
    // setUIManageShow(true);
  };

  return (
    <header
      className={`uim-chat-header ${isLive ? 'uim-chat-live-header' : ''}`}
      key={conversation?.id}
    >
      <div
        className={`uim-chat-header-left ${conversation?.type === ConversationType.System ? 'system' : ''}`}
      >
        {conversation?.type !== ConversationType.System && avatar}
      </div>
      <div className="header-content">
        <h3 className="title">{title}</h3>
      </div>
      <div className="uim-chat-header-right">
        <div className="header-handle">
          {
            operateIcon || <Icon className="header-handle-more" onClick={openUIManage} type={IconTypes.ELLIPSE} width={18} height={5} />
          }
        </div>
      </div>
    </header>
  );
}