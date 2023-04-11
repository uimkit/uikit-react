export * from './models';
export * from './events';
export * from './api';

export type UnknownType = Record<string, unknown>;

export type CustomTrigger = {
  [key: string]: {
    componentProps: UnknownType;
    data: UnknownType;
  };
};

export type ChatConfigFields = {
}

export type CreatedAtUpdatedAt = {
  created_at: string;
  updated_at: string;
};

export type CommandResponse = Partial<CreatedAtUpdatedAt> & {
  args?: string;
  description?: string;
  name?: string;
  set?: string;
};

export type ChatConfigWithInfo = ChatConfigFields &
  CreatedAtUpdatedAt & {
    commands?: CommandResponse[];
  };