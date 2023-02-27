import { EmoticonItem } from '../../EmoticonItem';
import { SearchIndex } from 'emoji-mart'

import type { EmojiTriggerSetting } from '../DefaultTriggerProvider';


export const useEmojiTrigger = (): EmojiTriggerSetting => {
  return {
    component: EmoticonItem,
    dataProvider: async (query, _, onReady) => {
      if (query.length === 0 || query.charAt(0).match(/[^a-zA-Z0-9+-]/)) {
        return [];
      }
      const emojis = await SearchIndex?.search(query) || [];
      console.log('emojis: ', emojis, query);
      // emojiIndex.search sometimes returns undefined values, so filter those out first
      const result = emojis.filter(Boolean).slice(0, /* TODO themeVersion === '2' ? 7 : */10);
      if (onReady) onReady(result, query);

      return result;
    },
    output: (entity) => ({
      caretPosition: 'next',
      key: entity.id,
      text: `${'native' in entity ? entity.native : `${entity.name}`}`,
    }),
  };
};
