import { useCallback } from 'react';
import { Message } from '../../../types';
import { MESSAGE_FLOW, MESSAGE_OPERATE } from '../../../constants';
import { Toast } from '../../Toast';
import { useChatActionContext, useUIKit } from '../../../context';

interface MessageHandlerProps {
  handleError?: (error) => void,
  message?: Message,
}

export const useMessageHandler = (props?: MessageHandlerProps) => {
  const {
    message,
    handleError,
  } = props;

  const {
    deleteMessage,
    operateMessage,
    revokeMessage,
    resendMessage,
  } = useChatActionContext('useDeleteHandler');

  const handleDelMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.id) {
      return;
    }

    try {
      deleteMessage(message);
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
    if (!message?.id) {
      return;
    }

    try {
      await revokeMessage(message);
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
    if (!message?.id || !operateMessage) {
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
      await resendMessage(message);
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
    if (!message?.id || !operateMessage) {
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
