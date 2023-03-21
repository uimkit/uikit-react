'use client'
import { useEffect, useState } from 'react';
import { 
  useUIKit, 
  Profile,
  APIClient, 
  IMAccount, 
  UIChat, 
  UIGroupList, 
  UIContactList, 
  UIConversationList, 
  UIGroupMemberList, 
  UIKit,
  UIChatHeader,
  VirtualizedMessageList,
  UIMessageInput,
  UIMomentList,
  Contact,
  Icon,
  IconTypes,
} from '@uimkit/uikit-react';
import { AccountList } from './AccountList';
import '@uimkit/uikit-react/dist/cjs/index.css';
import { ConversationType } from '@uimkit/uim-js';
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'


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

      const client = new UIMClient(accessToken, {
        subscribeKey: process.env.NEXT_PUBLIC_SUBSCRIBE_KEY,
        publishKey: process.env.NEXT_PUBLIC_PUBLISH_KEY,
        secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
      });
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
  const { client, activeConversation } = useUIKit();

  const [accounts, setAccounts] = useState<IMAccount[]>();
  const [activeContact, setActiveContact] = useState<Contact[]>();

  useEffect(() => {
    if (client) {
      (async function() {
        const r = await client?.getAccountList({
          subscribe: true,
        });
        setAccounts(r.data);
      })();
    }
  }, [client]);

  const handleChangeAccount = (account: IMAccount) => {
    setActiveAccount(account);
  }
  
  const [activeMomentProfile, setActiveMomentProfile] = useState<Profile | undefined>(undefined);

  return (
    <>
      <Flex>
        <AccountList accounts={accounts} onSelect={handleChangeAccount} />
      </Flex>
      <Flex>
        <Tabs>
          <TabList>
            <Tab>会话</Tab>
            <Tab>联系人</Tab>
            <Tab>群</Tab>
          </TabList>
          <TabPanels h='100vh'>
            <TabPanel>
              <UIConversationList />
            </TabPanel>
            <TabPanel>
              <UIContactList activeContact={activeContact} setActiveContact={setActiveContact}/>
            </TabPanel>
            <TabPanel>
              <UIGroupList activeProfile={activeAccount} />
            </TabPanel>
          </TabPanels>  
        </Tabs>
      </Flex>
      
      {activeConversation && (
        <UIChat>
          <UIChatHeader
            pluginComponentList={[
              <div key="moment" className="input-plugin-item" onClick={() => setActiveMomentProfile(activeConversation?.contact)}>
                <Icon width={20} height={20} type={IconTypes.VIDEO} />
              </div>
            ]}
          />
          <VirtualizedMessageList />
          <UIMessageInput />
        </UIChat>
      )}
      {activeConversation && activeConversation.type === ConversationType.Group && <UIGroupMemberList />}
      {!!activeMomentProfile && <UIMomentList profile={activeMomentProfile} />}
    </>
  );
}