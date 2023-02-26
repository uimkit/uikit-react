import React, { useRef, useState } from 'react';
import { UIContactPreviewComponentProps } from './UIContactPreview';
import { Avatar as DefaultAvatar } from '../Avatar/index';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { Plugins } from '../Plugins';
import { useChatActionContext, useUIKit } from '../../context';
import { useDeleteContact } from '../../hooks/useDeleteContact';

export function unMemoContactPreviewContent<T extends UIContactPreviewComponentProps>(
  props: T,
):React.ReactElement {
  const {
    contact,
    Avatar = DefaultAvatar,
    displayImage,
    displayTitle,
    active,
    setActiveContact,
  } = props;

  const contactPreviewButton = useRef<HTMLButtonElement | null>(null);
  const activeClass = active ? 'conversation-preview-content--active' : '';
  const [isHover, setIsHover] = useState(false);
  const onSelectContact = () => {
    if (setActiveContact) {
      setActiveContact(contact);
    }
    if (contactPreviewButton?.current) {
      contactPreviewButton.current.blur();
    }
  };
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  const { activeContact } = useUIKit('UIContactPreviewContent');
  const { mutate: deleteContact } = useDeleteContact();

  const moreHandle = (type: string) => {
    switch (type) {
      case 'delete':
        deleteContact(contact.id);
        if (contact === activeContact) {
          setActiveContact(null);
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
      className={`contact-preview-container ${activeClass}`}
      onClick={onSelectContact}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={contactPreviewButton}
    >
      <div className="avatar">
        <Avatar image={displayImage} name={displayTitle} size={40} />
      </div>
      <div className="content">
        <div className="title">
          {displayTitle}
        </div>
      </div>
      <div className="external">
        {!isHover
          ? (<></>)
          : (
            <div className={`${isHover ? 'more--hover' : 'more'}`}>
              <Plugins
                customClass="more-handle-box"
                plugins={[
                  <div
                    className="more-handle-item"
                    style={{ color: '#FF584C' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      moreHandle('delete');
                    }}
                    role="presentation"
                  >
                    Delete
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

export const UIContactPreviewContent = React.memo(unMemoContactPreviewContent) as
  typeof unMemoContactPreviewContent;