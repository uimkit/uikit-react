import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  WrapItem,
  Flex,
  Avatar,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  Provider,
  useUIKit,
} from '@uimkit/uikit-react';
import { useMemo } from 'react';
import UIMClient from '@uimkit/uim-js';



type CreateAccountModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { client } = useUIKit('CreateAccountModal');

  const providers = useMemo(() => [
    {
      icon: 'wechat',
      name: '微信',
      identifier: 'wechat',
    },
    {
      icon: 'wework',
      name: '企业微信',
      identifier: 'wework',
    }
  ], []);

  const toast = useToast()

  const handleAddAccount = (provider: Provider) => {
    const c = (client as UIMClient);
    c.authorize(provider.identifier, (id) => {
      toast({
        title: '账号添加成功.',
        description: "账号添加成功.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>添加账号</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {providers.map(provider => (
            <Flex key={provider.identifier} align="center" py=".8rem" p="4" minWidth="100%" flexWrap="nowrap">
              <Avatar name={provider.name} src={provider.icon}/>
              <Text>{provider.name}</Text> 
              <Button colorScheme='whatsapp' onClick={() => handleAddAccount(provider)}>添加账号</Button>
            </Flex>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};