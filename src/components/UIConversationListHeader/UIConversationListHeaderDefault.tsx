import React from 'react';
import { useState } from 'react';
import { Icon, IconTypes } from '../Icon';

export interface UIConversationListHeaderDefaultProps {}


export function UIConversationListHeaderDefault<T extends UIConversationListHeaderDefaultProps>(props: T) {
  const [conversationCreated, setConversationCreated] = useState(false);

  const handleConversationCreate = () => {
    setConversationCreated(true);
  };

  return (
    <div className="uim-conversation-header">
      {/*<ConversationSearchInput
        value={searchValue}
        clearable
        onChange={handleSearchValueChange}
      />*/}
      <div className="uim-conversation-create-icon">
        aaa3
        <Icon
          onClick={handleConversationCreate}
          type={IconTypes.CREATE}
          height={24}
          width={24}
        />
      </div>
    </div>
  );
}