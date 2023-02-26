import { Dispatch, useCallback } from 'react';
import { Conversation, Message } from '../../../types';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { ChatStateContextValue } from '../../../context';
import type { ChatStateReducerAction } from '../ChatState';
import { APIClient } from '../../../types';

export interface HandleMessageProps {
  client?: APIClient,
  conversation?: Conversation,
  state?: ChatStateContextValue,
  dispatch?: Dispatch<ChatStateReducerAction>,
}

export interface OperateMessageParams {
  [propName: string]: Message,
}

export function useHandleMessage<T extends HandleMessageProps>(props:T) {
  const {
    state,
    dispatch,
  } = props;

  const operateMessage = useCallback((data: OperateMessageParams) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE,
      value: data,
    });
  }, [dispatch]);

  const setAudioSource = useCallback((data: HTMLAudioElement | null) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_AUDIO_SOURCE,
      value: data,
    });
  }, [dispatch]);

  const setVideoSource = useCallback((data: HTMLVideoElement | null) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_VIDEO_SOURCE,
      value: data,
    });
  }, [dispatch]);

  const setHighlightedMessageId = useCallback((highlightedMessageId: string) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID,
      value: highlightedMessageId,
    });
  }, [dispatch]);

  return {
    operateMessage,
    setAudioSource,
    setVideoSource,
    setHighlightedMessageId,
  };
}