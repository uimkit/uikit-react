import { validateAndGetMessage } from '../utils';

import { useTranslationContext } from '../../../context/TranslationContext';
import { Message } from '../../../types';
import { ReactEventHandler } from '../types';
import { useChatActionContext } from '../../../context';
import { useUIKit } from '../../../context';


export type DeleteMessageNotifications = {
  getErrorNotification?: (message: Message) => string;
  notify?: (notificationText: string, type: 'success' | 'error') => void;
};


/**
 * TIM 有一个集中的 useMessageHandler, 集合了所有消息操作，是拆分还是集中，后续要权衡下，暂时用的是集中hook
 * @param message 
 * @param notifications 
 * @returns 
 */
export const useDeleteHandler = (
  message?: Message,
  notifications: DeleteMessageNotifications = {},
): ReactEventHandler => {
  const { getErrorNotification, notify } = notifications;

  const { deleteMessage } = useChatActionContext('useDeleteHandler');
  const { client } = useUIKit('useDeleteHandler');
  const { t } = useTranslationContext('useDeleteHandler');

  return async (event) => {
    event.preventDefault();
    if (!message?.id || !client || !deleteMessage) {
      return;
    }

    try {
      const data = await client.deleteMessage(message.id);
      deleteMessage(data.message);
    } catch (e) {
      const errorMessage = getErrorNotification && validateAndGetMessage(getErrorNotification, [message]);

      if (notify) notify(errorMessage || t('Error deleting message'), 'error');
    }
  };
};
