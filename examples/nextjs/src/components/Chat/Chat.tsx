'use client'
import { useEffect, useState } from 'react';
import { 
  Provider,
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
  useConversation,
  ConversationType,
} from '@uimkit/uikit-react';
import { AccountSelect } from './AccountSelect';
import '@uimkit/uikit-react/dist/cjs/index.css';
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  VStack,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { SettingsIcon } from "@chakra-ui/icons"
import { ContactDetails } from './ContactDetails';
import { ProviderList } from './ProviderList';
import { SettingsPopover } from './SettingsPopover';


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
  const { client, activeConversation, setActiveConversation } = useUIKit();

  const [accounts, setAccounts] = useState<IMAccount[]>();
  const [activeContact, setActiveContact] = useState<Contact>();

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact);
    setActiveConversation(undefined);
  };

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

  const [tabIndex, setTabIndex] = useState(0);

  const { 
    createConversation
  } = useConversation();

  const handleStartConversation = async () => {
    if (!activeContact) return;

    // TODO 查找会话, 没有就创建
    // 设置会话
    const conversation = await createConversation(activeContact.id);
    setActiveConversation(conversation);
    setActiveContact(undefined);
    setTabIndex(0);
  }

  const [activeProvider, setActiveProvider] = useState<Provider | undefined>(undefined);

  const handleSelectProvider = (provider: Provider) => {
    setActiveProvider(provider);
  }

  return (
    <Flex
      w="100%"
      h="full"
    >
      <Flex w="72px" direction="column">
        <ProviderList onSelect={handleSelectProvider}/>
        <Flex direction="column" flex={1} justifyContent="end">
          <VStack spacing='12px'>
            <SettingsPopover />
          </VStack>
        </Flex>
      </Flex>
      <VStack spacing="12px" w="300px" alignItems='flex-start'>
        <AccountSelect activeAccount={activeAccount} accounts={accounts} onSelect={handleChangeAccount} />
        <Tabs variant='soft-rounded' colorScheme='green' onChange={(index) => setTabIndex(index)} index={tabIndex}>
          <TabList>
            <Tab>会话</Tab>
            <Tab>联系人</Tab>
            <Tab>群</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p="0" h='80vh'>
              <UIConversationList />
            </TabPanel>
            <TabPanel p="0" h='80vh'>
              <UIContactList activeContact={activeContact} setActiveContact={handleSelectContact}/>
            </TabPanel>
            <TabPanel p="0" h='80vh'>
              <UIGroupList activeProfile={activeAccount} />
            </TabPanel>
          </TabPanels>  
        </Tabs>
      </VStack>
      <Box flex='1'>
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
        {activeContact && !activeConversation && (
          <ContactDetails contact={activeContact} onStartConversation={handleStartConversation} />
        )}

        <Drawer
          isOpen={!!activeMomentProfile}
          onClose={() => setActiveMomentProfile(undefined)}
          placement='right'
        >
          <DrawerOverlay />
          <DrawerContent>
            <UIMomentList profile={activeMomentProfile} />
          </DrawerContent>
        </Drawer>
      </Box>
    </Flex>
  );
}