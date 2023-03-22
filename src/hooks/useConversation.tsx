import { useUIKit } from '../context';
import { CreateGroupConversationParams } from '../types';

export const useConversation = () => {
  const { client } = useUIKit('useConversation');

  const createConversation = async (
    params: string | CreateGroupConversationParams,
  ) => {
    // 私聊
    if (typeof params === 'string') {
      return await client.getContactConversation(params);
    }

    // TODO 群聊

    return undefined;
  };

  return {
    createConversation,
  }
}