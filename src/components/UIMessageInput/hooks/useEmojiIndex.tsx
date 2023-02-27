import { useEffect } from 'react';
import { init, SearchIndex } from 'emoji-mart'

import { useEmojiContext } from '../../../context/EmojiContext';

export const useEmojiIndex = () => {
  const { emojiConfig } = useEmojiContext('useEmojiIndex');

  const { emojiData } = emojiConfig || {};

  useEffect(() => {
    console.log('初始化表情数据集');
    init(emojiData);
  }, [emojiData]);

  return SearchIndex;
};