'use client'
import { useEffect, useState } from 'react';
// import { APIClient, IMAccount, UIChat, UIConversationList, UIKit } from '@uimkit/uikit-react/dist/esm/index';
import { APIClient, IMAccount, UIChat, UIConversationList, UIKit } from '@uimkit/uikit-react';
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
  const [accounts, setAccounts] = useState<IMAccount[]>();
  useEffect(() => {
    if (client) {
      (async function() {
        const r = await client?.listIMAccounts({});
        setAccounts(r.data);
      })();
    }
  }, [client]);

  const handleChangeAccount = (account: IMAccount) => {
    setActiveAccount(account);
  }


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
      <AccountList accounts={accounts} onSelect={handleChangeAccount} />
      <UIConversationList />
      <UIChat/>
    </UIKit>
  ) : null;
}