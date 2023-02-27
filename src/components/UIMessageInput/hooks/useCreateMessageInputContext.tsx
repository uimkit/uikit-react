import { useMemo } from 'react';
import { MessageInputContextValue } from '../../../context';

export const useCreateMessageInputContext = (value: MessageInputContextValue) => {
  const {
    textareaRef,
    handleChange,
    handleSubmit,
    handleKeyDown,
    onSelectEmoji,
    sendFaceMessage,
    disabled,
    focus,
    // operateData,
    pluginConfig,
  } = value;

  const messageInputContext = useMemo(
    () => ({
      textareaRef,
      handleChange,
      handleSubmit,
      handleKeyDown,
      onSelectEmoji,
      sendFaceMessage,
      disabled,
      focus,
      // operateData,
      pluginConfig,
      ...value,
    }),
    [
      textareaRef,
      handleChange,
      handleSubmit,
      handleKeyDown,
      onSelectEmoji,
      sendFaceMessage,
      disabled,
      focus,
      // operateData,
      pluginConfig,
    ],
  );

  return messageInputContext;
};