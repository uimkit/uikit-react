import { useEffect, useState } from 'react';
import { APIClient, IMAccount, UIChat, UIConversationList, UIKit } from '@uimkit/uikit-react';
import UIClient from '@uimkit/uim-js';
import { useAuthok } from '@authok/authok-react';
import { AccountList } from './components/AccountList';
import '@uimkit/uikit-react/dist/esm/index.css';

export default function Chat() {
  const { getAccessTokenSilently } = useAuthok();

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
      const accessToken = await getAccessTokenSilently();
      const client = new UIClient(accessToken);
      setClient(client as unknown as APIClient);
    })();
  }, [getAccessTokenSilently]);

  return client ? (
    <UIKit client={client} activeProfile={activeAccount}>
      <AccountList accounts={accounts} onSelect={handleChangeAccount} />
      <UIConversationList />
      <UIChat/>
    </UIKit>
  ) : null;
}