import { UIMessageInputProps } from "../UIMessageInput";
import { MessageInputReducerAction, MessageInputState } from "./useMessageInputState";
import { useEffect, useRef } from "react";
import { useChatActionContext, useTranslationContext, useUIKit } from "../../../context";
import { CONSTANT_DISPATCH_TYPE } from "../../../constants";

export const useSubmitHandler = (
  props: UIMessageInputProps,
  state: MessageInputState,
  dispatch: React.Dispatch<MessageInputReducerAction>,
) => {
  const { clearEditingState, message, overrideSubmitHandler } = props;

  const {
    mentioned_users,
    text,
  } = state;

  const { activeConversation } = useUIKit('useSubmitHandler');
  const { editMessage, sendMessage, createTextMessage } = useChatActionContext(
    'useSubmitHandler',
  );
  const { t } = useTranslationContext('useSubmitHandler');

  const textReference = useRef({ hasChanged: false, initialText: text });

  useEffect(() => {
    if (!textReference.current.initialText.length) {
      textReference.current.initialText = text;
      return;
    }

    textReference.current.hasChanged = text !== textReference.current.initialText;
  }, [text]);

  // const { cloudCustomData } = useHandleQuoteMessage();

  const handleSubmit = async (
    event?: React.BaseSyntheticEvent,
  ) => {
    event?.preventDefault();

    if (!state.text) {
      return;
    }

    const trimmedMessage = text.trim();
    const isEmptyMessage =
      trimmedMessage === '';
    if (isEmptyMessage) return;

    
    // Instead of checking if a user is still mentioned every time the text changes,
    // just filter out non-mentioned users before submit, which is cheaper
    // and allows users to easily undo any accidental deletion
    const actualMentionedUsers = Array.from(
      new Set(
        mentioned_users.filter(
          ({ id, name }) => text.includes(`@${id}`) || text.includes(`@${name}`),
        ),
      ),
    );

    const updatedMessage = {
      mentioned_users: actualMentionedUsers,
      text,
    } as any;

    /*
    if (cloudCustomData.messageReply) {
      updatedMessage.cloudCustomData = JSON.stringify(cloudCustomData);
    }*/

    if (message) {
      try {
        await editMessage(message);

        clearEditingState?.();
        dispatch({ type: CONSTANT_DISPATCH_TYPE.CLEAR });
      } catch (err) {
        // TODO addNotification(t('Edit message request failed'), 'error');
      }
    } else {
      try {
        dispatch({ type: CONSTANT_DISPATCH_TYPE.CLEAR });

        if (overrideSubmitHandler) {
          await overrideSubmitHandler(updatedMessage, activeConversation.id);
        } else {
          const message = createTextMessage({ 
            ...updatedMessage,
          });

          await sendMessage(message);
        }
      } catch (err) {
        dispatch({
          type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
          getNewText: () => text,
        });

        actualMentionedUsers?.forEach((user) => {
          dispatch({ type: CONSTANT_DISPATCH_TYPE.ADD_MENTIONED_USER, user });
        });

        // TODO addNotification(t('Send message request failed'), 'error');
      }
    }

    /*
    operateMessage({
      [MESSAGE_OPERATE.QUOTE]: null,
    });
    */
  };

  return { handleSubmit };
};
