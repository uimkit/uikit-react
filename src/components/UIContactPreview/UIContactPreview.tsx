import React, { useState, useEffect } from 'react';
import { Contact } from '../../types';
import { UIContactPreviewContent } from './UIContactPreviewContent';
import { AvatarProps } from '../Avatar';
import { UIKitContextProps, useUIKit } from '../../context';
import { getDisplayTitle } from './utils';

import './styles/index.scss';


export interface UIContactPreviewComponentProps extends UIContactPreviewProps{
  /** If the component's Contact is the active (selected) Contact */
  active?: boolean,
  /** Image of Contact to display */
  displayImage?: string,
  /** Title of Contact to display */
  displayTitle?: string | React.ReactElement,
}

export interface UIContactPreviewProps {
  contact: Contact,
  activeContact?: Contact,
  Preview?: React.ComponentType<UIContactPreviewComponentProps>,
  Avatar?: React.ComponentType<AvatarProps>
  setActiveContact?: UIKitContextProps['setActiveContact'],
  searchValue?: string,
}

export function UIContactPreview<T extends UIContactPreviewProps>(
  props: T,
):React.ReactElement {
  const {
    activeContact,
    contact,
    Preview = UIContactPreviewContent,
    searchValue,
  } = props;
  const {
    setActiveContact,
  } = useUIKit('UIConversationPreview');

  const [displayImage, setDisplayImage] = useState(contact.avatar);
  const [displayTitle, setDisplayTitle] = useState(getDisplayTitle(contact, searchValue));
  const isActive = activeContact?.id === contact?.id;
  if (!Preview) return null;

  useEffect(() => {
    setDisplayImage(contact.avatar);
    setDisplayTitle(getDisplayTitle(contact, searchValue));
  }, [contact, searchValue]);

  return (
    <Preview
      {...props}
      active={isActive}
      displayImage={displayImage}
      displayTitle={displayTitle}
      setActiveContact={setActiveContact}
    />
  );
}
