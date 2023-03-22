import React from 'react'
import { IMAccount } from '@uimkit/uikit-react';
import { HStack, Button, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';

export type AccountSelectProps = {
  activeAccount?: IMAccount;
  accounts?: IMAccount[];
  onSelect?: (account: IMAccount) => void;
}

export const AccountSelect: React.FC<AccountSelectProps> = ({ 
  activeAccount,
  accounts,
  onSelect,
}) => {
  return (
    <Menu onSelect={onSelect}>
      <MenuButton as={Button}>
        { activeAccount ? (
          <HStack spacing="12px">
            <Avatar boxSize="2rem" name={activeAccount.nickname} src={activeAccount.avatar}/>
            <span>{activeAccount.nickname}</span>
          </HStack>
        ) : '全部账号'}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => onSelect?.(undefined)}>
          <HStack spacing="12px">
            <span>全部账号</span>
          </HStack>
        </MenuItem>
        {accounts?.map(account => (
          <MenuItem key={account.id} onClick={() => onSelect?.(account)}>
            <HStack spacing="12px">
              <Avatar boxSize="2rem" name={account.nickname} src={account.avatar}/>
              <span>{account.nickname}</span>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>    
  );
}