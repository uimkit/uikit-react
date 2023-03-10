import { useCallback } from 'react';
import { Message } from '../../../types';
import { MESSAGE_FLOW, MESSAGE_OPERATE } from '../../../constants';
import { Toast } from '../../Toast';
import { useChatActionContext, useUIKit } from '../../../context';
import { useDispatch } from '../../../store/useDispatch';
import { deleteMessageLocal } from '../../../store/messages';

interface MessageHandlerProps {
  handleError?: (error) => void,
  message?: Message,
}

export const useMessageHandler = (props?: MessageHandlerProps) => {
  const {
    message,
    handleError,
  } = props;

  const dispatch = useDispatch();

  const {
    editLocalmessage,
    operateMessage,
    revokeMessage,
  } = useChatActionContext('useDeleteHandler');
  const { client } = useUIKit('useDeleteHandler');

  const handleDelMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.id || !client) {
      return;
    }

    try {
      console.log('删除消息');
      await client.deleteMessage({ id: message.id });
      dispatch(deleteMessageLocal(message));
    } catch (error) {
      if (handleError) {
        handleError({
          functionName: 'deleteMessage',
          error,
        });
      } else {
        Toast({ text: 'Error deleting message', type: 'error' });
        throw error;
      }
    }
  }, [message]);

  const handleRevokeMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.id || !client || !editLocalmessage) {
      return;
    }

    try {
      if (revokeMessage) {
        await revokeMessage(message);
      } else {
        await client.revokeMessage(message);
      }
      editLocalmessage(message);
    } catch (error) {
      if (handleError) {
        handleError({
          functionName: 'revokeMessage',
          error,
        });
      } else {
        const text = message.flow === MESSAGE_FLOW.OUT ? 'The message recall exceeded the time limit (default 2 minutes)' : 'Error revoke Message';
        Toast({ text, type: 'error' });
        throw error;
      }
    }
  }, [message]);

  const handleReplyMessage = useCallback((event?) => {
    event.preventDefault();
    if (!message?.id || !client || !operateMessage) {
      return;
    }
    operateMessage({
      [MESSAGE_OPERATE.QUOTE]: message,
    });
  }, [message]);

  const handleCopyMessage = useCallback((event?) => {
    event.preventDefault();
    if (navigator.clipboard) {
      // clipboard api
      navigator.clipboard.writeText(message.text);
    } else {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      // hide textarea
      textarea.style.position = 'fixed';
      textarea.style.clip = 'rect(0 0 0 0)';
      textarea.style.top = '10px';
      textarea.value = message.text;
      // select
      textarea.select();
      // copy
      document.execCommand('copy', true);
      // remove textarea
      document.body.removeChild(textarea);
    }
  }, [message]);

  const handleResendMessage = useCallback(async (event?) => {
    try {
      const res = await client.resendMessage(message);
      editLocalmessage(res?.data?.message);
    } catch (error) {
      if (handleError) {
        handleError({
          functionName: 'resendMessage',
          error,
        });
      } else {
        Toast({ text: (error as Error).message, type: 'error' });
        throw error;
      }
    }
  }, [message]);

  const handleForWardMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.id || !client || !operateMessage) {
      return;
    }
    operateMessage({
      [MESSAGE_OPERATE.FORWARD]: message,
    });
  }, [message]);

  return {
    handleDelMessage,
    handleRevokeMessage,
    handleReplyMessage,
    handleCopyMessage,
    handleResendMessage,
    handleForWardMessage,
  };
};
