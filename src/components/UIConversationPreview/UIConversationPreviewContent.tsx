import React, { useRef, useState } from 'react';
import { UIConversationPreviewComponentProps } from './UIConversationPreview';
import { Avatar as DefaultAvatar } from '../Avatar';
import { Icon, IconTypes } from '../Icon';
import { Plugins } from '../Plugins';
import { useUIKit } from '../../context';
import { usePinConversation } from '../../hooks/usePinConversation';
import { useDeleteConversation } from '../../hooks/useDeleteConversation';

export function UIConversationPreviewContent<T extends UIConversationPreviewComponentProps>(
  props: T,
):React.ReactElement {
  const {
    conversation,
    Avatar = DefaultAvatar,
    displayImage,
    displayTitle,
    displayMessage,
    displayTime,
    unread,
    active,
    setActiveConversation,
  } = props;

  const conversationPreviewButton = useRef<HTMLButtonElement | null>(null);
  const activeClass = active ? 'conversation-preview-content--active' : '';
  const unreadClass = unread && unread >= 1 ? 'conversation-preview-content--unread' : '';
  const pinClass = conversation.pinned ? 'conversation-preview-content--pin' : '';
  const [isHover, setIsHover] = useState(false);
  const onSelectConversation = () => {
    if (setActiveConversation) {
      setActiveConversation(conversation);
    }
    if (conversationPreviewButton?.current) {
      conversationPreviewButton.current.blur();
    }
  };
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const { activeConversation } = useUIKit('UIConversationPreviewContent');
  const { mutate: pinConversation } = usePinConversation();
  const { mutate: deleteConversation } = useDeleteConversation();

  const moreHandle = (type: string) => {
    const { id, pinned } = conversation;
    switch (type) {
      case 'pin':
        pinConversation(id, !pinned);
        break;
      case 'delete':
        deleteConversation(id);
        if (conversation.id === activeConversation.id) {
          setActiveConversation(null);
        }
        break;
      default:
    }
  };
  return (
    <button
      type="button"
      aria-selected={active}
      role="option"
      className={`conversation-preview-container ${activeClass} ${unreadClass} ${pinClass}`}
      onClick={onSelectConversation}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={conversationPreviewButton}
    >
      <div className="avatar">
        <Avatar image={displayImage} name={conversation.name} size={40} />
      </div>
      <div className="content">
        <div className="title">
          {displayTitle}
        </div>
        <div className="message">
          {displayMessage}
        </div>
      </div>
      <div className="external">
        {unread ? (<div className="unread">{unread <= 99 ? unread : '99+'}</div>) : (<div className="unread" />)}
        {!isHover
          ? (
            <div className="time">
              {displayTime}
            </div>
          )
          : (
            <div className={`${isHover ? 'more--hover' : 'more'}`}>
              <Plugins
                customClass="more-handle-box"
                plugins={[
                  <div
                    role="presentation"
                    className="more-handle-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      moreHandle('pin');
                    }}
                  >
                    {!conversation.pinned ? '置顶' : '取消置顶'}
                  </div>,
                  <div
                    className="more-handle-item"
                    style={{ color: '#FF584C' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      moreHandle('delete');
                    }}
                    role="presentation"
                  >
                    删除
                  </div>,
                ]}
                showNumber={0}
                MoreIcon={(
                  <Icon
                    className="icon-more"
                    width={16}
                    height={16}
                    type={IconTypes.MORE}
                  />
              )}
              />
            </div>
          )}
      </div>
    </button>
  );
}