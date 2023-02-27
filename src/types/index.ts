export * from './models';
export * from './api';


export type UnknownType = Record<string, unknown>;

export type CustomTrigger = {
  [key: string]: {
    componentProps: UnknownType;
    data: UnknownType;
  };
};

export type DefaultStreamChatGenerics = /* ExtendableGenerics & */ {
  // attachmentType: DefaultAttachmentType;
  // channelType: DefaultChannelType;
  // commandType: LiteralStringForUnion;
  // eventType: UnknownType;
  // messageType: DefaultMessageType;
  // reactionType: UnknownType;
  // userType: DefaultUserType;
};