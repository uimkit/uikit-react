import React from 'react';
import { Group } from '../../types';
import { defaultGroupAvatarPublic } from '../Avatar';

export const getDisplayTitle = (
  group: Group,
  searchValue?: string,
  highlightColor = '#147AFF',
): string | React.ReactElement => {
  const title = group.name;

  const handleTitle = (str:string) => {
    const tempStr = str.toLocaleLowerCase();
    const pos = tempStr.indexOf(searchValue.toLocaleLowerCase());
    return (
      <div>
        <span>{str.slice(0, pos)}</span>
        <span style={{ color: highlightColor }}>{str.slice(pos, pos + searchValue.length)}</span>
        <span>{str.slice(pos + searchValue.length)}</span>
      </div>
    );
  };
  return !searchValue ? title : handleTitle(title);
};

export const getDisplayImage = (group: Group) => {
  return group.avatar ?? defaultGroupAvatarPublic;
};