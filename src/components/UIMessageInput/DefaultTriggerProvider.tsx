import React, { PropsWithChildren } from 'react';

// import { useCommandTrigger } from './hooks/useCommandTrigger';
import { useEmojiTrigger } from './hooks/useEmojiTrigger';
// import { useUserTrigger } from './hooks/useUserTrigger';

import {
  MessageInputContextProvider,
  useMessageInputContext,
} from '../../context/MessageInputContext';

import type { SuggestionCommand, SuggestionUser } from '../UIChatAutoComplete';
import type { UICommandItemProps } from '../UICommandItem';
import type { EmoticonItemProps } from '../EmoticonItem';
import type { UIUserItemProps } from '../UIUserItem';

import type { CustomTrigger, DefaultStreamChatGenerics, UnknownType } from '../../types';
import { Emoji } from '../../context/EmojiContext';
import { useCommandTrigger } from './hooks/useCommandTrigger';

export type AutocompleteMinimalData = {
  id?: string;
  name?: string;
} & ({ id: string } | { name: string });

export type CommandTriggerSetting<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = TriggerSetting<UICommandItemProps, SuggestionCommand<StreamChatGenerics>>;

export type EmojiTriggerSetting = TriggerSetting<EmoticonItemProps, Emoji & any>;

export type UserTriggerSetting<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = TriggerSetting<UIUserItemProps, SuggestionUser<StreamChatGenerics>>;

export type TriggerSetting<T extends UnknownType = UnknownType, U = UnknownType> = {
  component: string | React.ComponentType<T>;
  dataProvider: (
    query: string,
    text: string,
    onReady: (data: (U & AutocompleteMinimalData)[], token: string) => void,
  ) => U[] | Promise<void> | void;
  output: (
    entity: U,
  ) =>
    | {
        caretPosition: 'start' | 'end' | 'next' | number;
        text: string;
        key?: string;
      }
    | string
    | null;
  callback?: (item: U) => void;
};

export type TriggerSettings<
  V extends CustomTrigger = CustomTrigger
> =
  | {
      [key in keyof V]: TriggerSetting<V[key]['componentProps'], V[key]['data']>;
    }
  | {
      '/': CommandTriggerSetting;
      ':': EmojiTriggerSetting;
      // '@': UserTriggerSetting<StreamChatGenerics>;
    };

export const DefaultTriggerProvider = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  const currentValue = useMessageInputContext('DefaultTriggerProvider');
  
  const defaultAutocompleteTriggers: TriggerSettings<StreamChatGenerics> = {
    '/': useCommandTrigger(),
    ':': useEmojiTrigger(),
    /*'@': useUserTrigger<StreamChatGenerics>({
      disableMentions: currentValue.disableMentions,
      mentionAllAppUsers: currentValue.mentionAllAppUsers,
      mentionQueryParams: currentValue.mentionQueryParams,
      onSelectUser: currentValue.onSelectUser,
      useMentionsTransliteration: currentValue.useMentionsTransliteration,
    }),
    */
  };

  const newValue = {
    ...currentValue,
    autocompleteTriggers: defaultAutocompleteTriggers,
  };

  return <MessageInputContextProvider value={newValue}>{children}</MessageInputContextProvider>;
};