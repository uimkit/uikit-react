import type { Reducer } from 'react';
import { Message } from '../../types';
import { CONSTANT_DISPATCH_TYPE } from '../../constants';
import type { ChatStateContextValue } from '../../context';
// import { OperateMessageParams } from './hooks/useHandleMessage';
import {
  handleUploadPendingMessage,
} from './utils';
import { OperateMessageParams } from './hooks/useHandleMessage';

export type ChatStateReducerAction =
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_UPDATE_MESSAGE,
      value?: Array<Message>,
      index?: number
    }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE,
    value?: Message,
    index?: number,
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_REMOVE_MESSAGE,
    value?: Message
  }
  | {
      type: CONSTANT_DISPATCH_TYPE.RESET;
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID,
      value?: string,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE,
      value?: OperateMessageParams,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_AUDIO_SOURCE,
      value?: HTMLAudioElement | null,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_VIDEO_SOURCE,
      value?: HTMLVideoElement | null,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.UPDATE_UPLOAD_PENDDING_MESSAGE_LIST,
      value?: Message,
    }
  | 
    {
      type:  CONSTANT_DISPATCH_TYPE.JUMP_TO_LATEST_MESSAGE,
    };

export type ChatStateReducer = Reducer<ChatStateContextValue, ChatStateReducerAction>;

export const chatReducer = (
  state: ChatStateContextValue,
  action: ChatStateReducerAction,
) => {
  switch (action?.type) {
    case CONSTANT_DISPATCH_TYPE.RESET:
      return { ...initialState };
    case CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID:
      return { ...state, highlightedMessageId: action.value };
    case CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE:
      return { ...state, operateData: { ...action.value } };
    case CONSTANT_DISPATCH_TYPE.SET_AUDIO_SOURCE:
      return { ...state, audioSource: action.value };
    case CONSTANT_DISPATCH_TYPE.SET_VIDEO_SOURCE:
      return { ...state, videoSource: action.value };
    case CONSTANT_DISPATCH_TYPE.UPDATE_UPLOAD_PENDDING_MESSAGE_LIST:
      return {
        ...state,
        uploadPenddingMessageList: [
          ...handleUploadPendingMessage(state.uploadPenddingMessageList, action.value),
        ],
      };
    case CONSTANT_DISPATCH_TYPE.JUMP_TO_LATEST_MESSAGE: {
      return {
        ...state,
        // hasMoreNewer: false,
        highlightedMessageId: undefined,
        suppressAutoscroll: false,
      };
    }
    default: return state;
  }
};

export const initialState: ChatStateContextValue = {
  hasMore: true,
  hasMoreNewer: false,
  loadingMore: false,
  loadingMoreNewer: false,
  messages: [],
  highlightedMessageId: '',
  lastMessageID: '',
  suppressAutoscroll: false,
  init: false,
  isSameLastMessageID: false,
  operateData: {},
  audioSource: null,
  vidoeSource: null,
  uploadPenddingMessageList: [],
};