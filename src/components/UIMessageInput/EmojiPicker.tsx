import React, { useEffect, useState } from 'react';
import { useMessageInputContext, useTranslationContext } from '../../context';
import { Icon, IconTypes } from '../Icon';
import { Popup } from '../Popup';
import data, { Emoji } from '@emoji-mart/data'
import { useEmojiContext } from '../../context/EmojiContext';


import zh from '@emoji-mart/data/i18n/zh.json';
import en from '@emoji-mart/data/i18n/en.json';
const i18ns = {
  zh,
  en,
}

export type EmojiPickerProps = {

};

export function EmojiPicker(props: EmojiPickerProps): React.ReactElement {
  const { t, userLanguage } = useTranslationContext('EmojiPicker');
  const { emojiConfig, EmojiPicker: EmojiPickerComponent } = useEmojiContext();

  const [i18n, setI18n] = useState();

  useEffect(() => {
    (async function() {
      const i18n = i18ns[userLanguage];
      if (i18n) {
        setI18n(i18n);
        console.log('设置表情 i18n: ', i18n);
      }
    })();
  }, [userLanguage]);


  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [className, setClassName] = useState('');

  const handleShow = () => {
    setShow(!show);
  };

  const {
    onSelectEmoji,
    sendFaceMessage,
  } = useMessageInputContext('UIMessageInputDefault');

  const handleSelectEmoji = (emoji: Emoji) => {
    if (index === 0) {
      onSelectEmoji(emoji);
    } else {
      sendFaceMessage(emoji);
    }
    handleShow();
  };

  const handleVisible = (data) => {
    setClassName(`${!data.top && 'emoji-plugin-top'} ${!data.left && 'emoji-plugin-right'}`);
  };

  const { emojiData } = emojiConfig ?? {};
  if (!emojiData) return null;

  return (
    <div className="emoji-picker input-plugin-popup">
      <Icon width={20} height={20} type={IconTypes.EMOJI} onClick={handleShow} />
      <Popup
        className={`input-plugin-popup-box ${className}`}
        show={show}
        close={handleShow}
        handleVisible={handleVisible}
      >
        <EmojiPickerComponent 
          i18n={i18n}
          data={data} 
          onEmojiSelect={handleSelectEmoji}
        />
      </Popup>
    </div>
  );
}