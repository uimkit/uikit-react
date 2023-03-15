export enum MESSAGE_STATUS {
  UNSEND = 'unSend',
  SUCCESS = 'succeeded',
  FAIL = 'fail',
}

export enum MESSAGE_FLOW {
  IN = 'in',
  OUT = 'out',
}

export enum MESSAGE_OPERATE {
  REVOKE = 'revoke',
  QUOTE = 'quote',
  FORWARD = 'forward',
}

export enum CONSTANT_DISPATCH_TYPE {
  RESET = 'reset',
  SET_UPDATE_MESSAGE = 'setUpdateMessage',
  SET_EDIT_MESSAGE = 'setEditMessage',
  SET_REMOVE_MESSAGE = 'setRemoveMessage',
  SET_TEXT = 'setText',
  SET_HIGH_LIGHTED_MESSAGE_ID ='setHightLightedMessageID',
  OPERATE_MESSAGE = 'operateMessage',
  SET_AUDIO_SOURCE = 'setAudioSource',
  SET_VIDEO_SOURCE = 'setVideoSource',
  UPDATE_UPLOAD_PENDDING_MESSAGE_LIST = 'updateUploadPenddingMessageList',
  JUMP_TO_LATEST_MESSAGE = 'jumpToLatestMessage',
  SET_GROUP_MEMBERS = 'setGroupMembers',
}



export const MAX_QUERY_GROUP_MEMBER_LIMIT = 30;