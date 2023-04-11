import React, { useCallback } from 'react';

import { AutoCompleteTextarea } from '../AutoCompleteTextarea';
import { LoadingIndicator } from '../Loading/LoadingIndicator';

import { useMessageInputContext } from '../../context/MessageInputContext';
import { useComponentContext } from '../../context/ComponentContext';

import { SearchIndex } from 'emoji-mart';
import type { TriggerSettings } from '../UIMessageInput/DefaultTriggerProvider';

import { useTranslationContext } from '../../context';

type ObjectUnion<T> = T[keyof T];

export type SuggestionCommand = any;

export type SuggestionUser = any;

export type SuggestionItemProps = {
  className: string;
  component: React.ComponentType<{
    entity: any/* Emoji */ | SuggestionUser | SuggestionCommand;
    selected: boolean;
  }>;
  item: any/* Emoji */ | SuggestionUser | SuggestionCommand;
  key: React.Key;
  onClickHandler: (event: React.BaseSyntheticEvent) => void;
  onSelectHandler: (
    item: any/* Emoji */ | SuggestionUser | SuggestionCommand,
  ) => void;
  selected: boolean;
  style: React.CSSProperties;
  value: string;
};

export interface SuggestionHeaderProps {
  currentTrigger: string;
  value: string;
}

export type SuggestionListProps = ObjectUnion<
  {
    [key in keyof TriggerSettings]: {
      component: TriggerSettings[key]['component'];
      currentTrigger: string;
      dropdownScroll: (element: HTMLDivElement) => void;
      getSelectedItem:
        | ((item: Parameters<TriggerSettings[key]['output']>[0]) => void)
        | null;
      getTextToReplace: (
        item: Parameters<TriggerSettings[key]['output']>[0],
      ) => {
        caretPosition: 'start' | 'end' | 'next' | number;
        text: string;
        key?: string;
      };
      Header: React.ComponentType<SuggestionHeaderProps>;
      onSelect: (newToken: {
        caretPosition: 'start' | 'end' | 'next' | number;
        text: string;
      }) => void;
      selectionEnd: number;
      SuggestionItem: React.ComponentType<SuggestionItemProps>;
      values: Parameters<
        Parameters<TriggerSettings[key]['dataProvider']>[2]
      >[0];
      className?: string;
      itemClassName?: string;
      itemStyle?: React.CSSProperties;
      style?: React.CSSProperties;
      value?: string;
    };
  }
>;

export type UIChatAutoCompleteProps = {
  /** Function to override the default submit handler on the underlying `textarea` component */
  handleSubmit?: (event: React.BaseSyntheticEvent) => void;
  /** Function to run on blur of the underlying `textarea` component */
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  /** Function to override the default onChange behavior on the underlying `textarea` component */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  /** Function to run on focus of the underlying `textarea` component */
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  /** Function to override the default onPaste behavior on the underlying `textarea` component */
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  /** Placeholder for the underlying `textarea` component */
  placeholder?: string;
  /** The initial number of rows for the underlying `textarea` component */
  rows?: number;
  /** The text value of the underlying `textarea` component */
  value?: string;
  /** Function to override the default emojiReplace behavior on the `wordReplace` prop of the `textarea` component */
  wordReplace?: (word: string) => string;
};

const UnMemoizedChatAutoComplete = (
  props: UIChatAutoCompleteProps,
) => {
  const {
    AutocompleteSuggestionItem: SuggestionItem,
    AutocompleteSuggestionList: SuggestionList,
  } = useComponentContext('ChatAutoComplete');
  const { t } = useTranslationContext('UIChatAutoComplete');

  const messageInput = useMessageInputContext('ChatAutoComplete');
  const { disabled, textareaRef: innerRef } = messageInput;

  const placeholder = props.placeholder || t('输入消息');

  const emojiReplace = props.wordReplace
    ? (word: string) => props.wordReplace?.(word)
    : async (word: string) => {
        const found = (await SearchIndex.search(word)) ?? [];
        const emoji = found
          .filter(Boolean)
          .slice(0, 10)
          .find(({ emoticons }: any/* Emoji */) => !!emoticons?.includes(word));
        if (!emoji || !('native' in emoji)) return null;
        return emoji.native;
      };

  const updateInnerRef = useCallback(
    (ref: HTMLTextAreaElement | null) => {
      if (innerRef) {
        innerRef.current = ref;
      }
    },
    [innerRef],
  );

  return (
    <AutoCompleteTextarea
      additionalTextareaProps={/*messageInput.additionalTextareaProps*/{}}
      aria-label={placeholder ?? 'placeholder'}
      className='uim-message-textarea'
      closeCommandsList={() => {}/*messageInput.closeCommandsList*/}
      closeMentionsList={() => {}/*messageInput.closeMentionsList*/}
      containerClassName='uim-textarea uim-message-textarea-react-host'
      disabled={disabled}
      disableMentions={false/*messageInput.disableMentions*/}
      dropdownClassName='uim-emojisearch'
      grow={false/*messageInput.grow*/}
      handleSubmit={props.handleSubmit || messageInput.handleSubmit}
      innerRef={updateInnerRef}
      itemClassName='uim-emojisearch__item'
      listClassName='uim-emojisearch__list'
      loadingComponent={LoadingIndicator}
      maxRows={3/*messageInput.maxRows*/}
      minChar={0}
      onBlur={props.onBlur}
      onChange={props.onChange || messageInput.handleChange}
      onFocus={props.onFocus}
      onPaste={props.onPaste/* TODO || messageInput.onPaste*/}
      placeholder={placeholder}
      replaceWord={emojiReplace}
      rows={props.rows || 3}
      shouldSubmit={messageInput.shouldSubmit}
      showCommandsList={false/*messageInput.showCommandsList*/}
      showMentionsList={false/*messageInput.showMentionsList*/}
      SuggestionItem={SuggestionItem}
      SuggestionList={SuggestionList}
      trigger={messageInput.autocompleteTriggers || {}}
      value={props.value || messageInput.text}
    />
  );
};

export const UIChatAutoComplete = React.memo(
  UnMemoizedChatAutoComplete,
) as typeof UnMemoizedChatAutoComplete;