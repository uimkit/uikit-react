import React from 'react';
import { Contact } from "../../types";

export const getDisplayTitle = (
  contact: Contact,
  searchValue?: string,
  highlightColor = '#147AFF',
): string | React.ReactElement => {
  /*
  const {
    name, nick, groupID, userID,
  } = getMessageProfile(conversation);
  */
  const { name } = contact;

  let title = name;

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