import React, { useState, useEffect } from 'react';
import { Group } from '../../types';
import { AvatarProps } from '../Avatar';
import { UIGroupPreviewContent } from './UIGroupPreviewContent';
import { getDisplayImage, getDisplayTitle } from './utils';

export interface UIGroupPreviewComponentProps extends UIGroupPreviewProps {
    /** If the component's Conversation is the active (selected) Conversation */
    active?: boolean;
    /** Image of Conversation to display */
    displayImage?: string;
    /** Title of Conversation to display */
    displayTitle?: string | React.ReactElement;
    /** Time of Conversation to display */
    displayTime?: string;
}

export interface UIGroupPreviewProps {
  group: Group,
  activeGroup?: Group,
  Preview?: React.ComponentType<UIGroupPreviewComponentProps>;
  Avatar?: React.ComponentType<AvatarProps>;
  setActiveGroup?: (group: Group) => void;
  searchValue?: string,
}
export function UIGroupPreview<T extends UIGroupPreviewProps>(
  props: T,
):React.ReactElement {
  const {
    activeGroup,
    setActiveGroup,
    group,
    Preview = UIGroupPreviewContent,
    searchValue,
  } = props;

  const [displayImage, setDisplayImage] = useState(group?.avatar);
  const [displayTitle, setDisplayTitle] = useState(getDisplayTitle(group, searchValue));

  const isActive = activeGroup?.id === group?.id;
  if (!Preview) return null;
  useEffect(() => {
    setDisplayTitle(getDisplayTitle(group, searchValue));
    setDisplayImage(getDisplayImage(group));
  }, [group, searchValue]);

  return (
    <Preview
      {...props}
      active={isActive}
      displayImage={displayImage}
      displayTitle={displayTitle}
      setActiveGroup={setActiveGroup}
    />
  );
}