import React from 'react'
import { IMAccount } from '@uimkit/uikit-react';
import { Stack, Avatar } from '@chakra-ui/react';

export type AccountListProps = {
  accounts?: IMAccount[];
  onSelect?: (account: IMAccount) => void;
}

export function AccountList({ 
  accounts, 
  onSelect,
}: AccountListProps) {
  return (
    <Stack direction="column" spacing='12px'>
      {accounts?.map(account => (
        <div key={account.id} onClick={() => onSelect?.(account)}>
          <Avatar name={account.nickname} src={account.avatar}/>
        </div>
      ))}
    </Stack>
  );
}