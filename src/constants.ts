export enum MESSAGE_STATUS {
  UNSEND = 'unSend',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export enum MESSAGE_OPERATE {
  REVOKE = 'revoke',
  QUOTE = 'quote',
  FORWARD = 'forward',
}

export enum CONSTANT_DISPATCH_TYPE {
  RESET = 'reset',
  SET_CONVERSATION_PRPFILE = 'setConversationProfile',
  SET_MESSAGELIST = 'setMessageList',
  SET_UPDATE_MESSAGE = 'setUpdateMessage',
  SET_EDIT_MESSAGE = 'setEditMessage',
  SET_REMOVE_MESSAGE = 'setRemoveMessage',
  SET_HISTORY_MESSAGELIST = 'setHistoryMessageList',
  SET_NEXT_REQ_MESSAGE_ID = 'setNextReqMessageID',
  SET_IS_COMPLETE = 'setIsComplete',
  SET_TEXT = 'setText',
  SET_HIGH_LIGHTED_MESSAGE_ID ='setHightLightedMessageID',
  OPERATE_MESSAGE = 'operateMessage',
  SET_NO_MORE = 'setNoMore',
  SET_CURSOR_POS = 'setCursorPos',
  SET_AUDIO_SOURCE = 'setAudioSource',
  SET_VIDEO_SOURCE = 'setVideoSource',
  UPDATE_UPLOAD_PENDDING_MESSAGE_LIST = 'updateUploadPenddingMessageList'
}