import React, { useRef, useState } from 'react';
import { UIGroupPreviewComponentProps } from './UIGroupPreview';
import { Avatar as DefaultAvatar } from '../Avatar';
import { Icon, IconTypes } from '../Icon';
import { Plugins } from '../Plugins';

export function UIGroupPreviewContent<T extends UIGroupPreviewComponentProps>(
  props: T,
):React.ReactElement {
  const {
    group,
    Avatar = DefaultAvatar,
    displayImage,
    displayTitle,
    active,
    activeGroup,
    setActiveGroup,
  } = props;

  const groupPreviewButton = useRef<HTMLButtonElement | null>(null);
  const activeClass = active ? 'group-preview-content--active' : '';
  const [isHover, setIsHover] = useState(false);
  const onSelectGroup = () => {
    if (setActiveGroup) {
      setActiveGroup(group);
    }
    if (groupPreviewButton?.current) {
      groupPreviewButton.current.blur();
    }
  };
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // TODO
  const deleteGroup = (id: string) => {};

  const moreHandle = (type: string) => {
    const { id } = group;
    switch (type) {
      case 'delete':
        deleteGroup(id);
        if (group.id === activeGroup.id) {
          setActiveGroup(null);
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
      className={`group-preview-container ${activeClass}`}
      onClick={onSelectGroup}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={groupPreviewButton}
    >
      <div className="avatar">
        <Avatar image={displayImage} name={group.name} size={40} />
      </div>
      <div className="content">
        <div className="title">
          {displayTitle}
        </div>
      </div>
      <div className="external">
        {!isHover
          ? (
            <></>
          )
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