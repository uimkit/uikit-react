import React from 'react'
import { IMAccount } from '@uimkit/uikit-react';

export type AccountListProps = {
  accounts?: IMAccount[];
  onSelect?: (account: IMAccount) => void;
}

export function AccountList({ 
  accounts, 
  onSelect,
}: AccountListProps) {

  return (
    <ul>
      {accounts?.map(account => (
        <li key={account.id} onClick={() => onSelect?.(account)}>
          {account.name}
        </li>))}
    </ul>
  );
}