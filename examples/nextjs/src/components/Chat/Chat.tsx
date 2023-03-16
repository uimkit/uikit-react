'use client'
import { useEffect, useState } from 'react';
import { useUIKit, APIClient, IMAccount, UIChat, UIConversationList, UIKit, MomentList } from '@uimkit/uikit-react';
import { AccountList } from './AccountList';
import '@uimkit/uikit-react/dist/cjs/index.css';

export type ChatProps = {
  accessToken: string;
}

export function Chat({ 
  accessToken
}: ChatProps) {
  const [client, setClient] = useState<APIClient | undefined>();
  const [activeAccount, setActiveAccount] = useState<IMAccount | undefined>(undefined);

  useEffect(() => {
    (async function() {
      const UIMClient = (await import('@uimkit/uim-js')).default;
      console.log('UIMClient: ', UIMClient);

      const client = new UIMClient(accessToken);
      setClient(client as unknown as APIClient);
    })();
  }, [accessToken]);

  return client ? (
    <UIKit client={client} activeProfile={activeAccount}>
      <ChatContainer activeAccount={activeAccount} setActiveAccount={setActiveAccount} />
    </UIKit>
  ) : null;
}

export type ChatContainerProps = {
  activeAccount?: IMAccount;
  setActiveAccount: (account: IMAccount) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  activeAccount,
  setActiveAccount,
}) => {
  const { client, activeConversation, activeMomentUserId } = useUIKit();

  const [accounts, setAccounts] = useState<IMAccount[]>();
  useEffect(() => {
    if (client) {
      (async function() {
        const r = await client?.getAccountList({});
        setAccounts(r.data);
      })();
    }
  }, [client]);

  const handleChangeAccount = (account: IMAccount) => {
    setActiveAccount(account);
  }
  
  return (
    <>
      <AccountList accounts={accounts} onSelect={handleChangeAccount} />
      {activeAccount && <UIConversationList />}
      {activeConversation && <UIChat/>}
      {!!activeMomentUserId && <MomentList userId={activeMomentUserId}/>}
    </>
  );
}