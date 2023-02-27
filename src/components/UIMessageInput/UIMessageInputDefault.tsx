import React, { useEffect, useState } from 'react';
import { formatEmojiString } from '../UIMessage/utils/emojiMap';
import { useMessageInputContext } from '../../context';
import { MESSAGE_OPERATE } from '../../constants';
import { useChatStateContext } from '../../context';

export function UIMessageInputDefault(): React.ReactElement {
  const {
    text,
    disabled,
    handleChange,
    handleKeyDown,
    handlePasete,
    textareaRef,
    focus,
    setText,
  } = useMessageInputContext('UIMessageInputDefault');
  
  const {
    operateData,
  } = useChatStateContext();

  // operateData
  useEffect(() => {
    if (operateData[MESSAGE_OPERATE.REVOKE]) {
      setText(formatEmojiString(operateData[MESSAGE_OPERATE.REVOKE].text, 1));
    }
  }, [operateData]);

  // Focus
  useEffect(() => {
    if (focus && textareaRef.current) {
      textareaRef.current.autofocus = true;
      textareaRef?.current?.focus();
      textareaRef?.current?.addEventListener('paste', handlePasete);
    }
    return () => {
      textareaRef?.current?.removeEventListener('paste', handlePasete);
    };
  }, [focus]);

  const [focused, setFocused] = useState<boolean>(false);

  const handleFocus = (e) => {
    setFocused(true);
  };
  const handleBlur = (e) => {
    /*setCursorPos({
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    });*/
    setFocused(false);
  };

  return (
    <div className={`input-box ${disabled ? 'disabled' : ''} ${focused ? 'uim-kit-input-box--focus' : 'uim-kit-input-box--blur'}`}>
      {
        !disabled
        && (
        <textarea
          placeholder="请输入消息"
          value={text}
          ref={textareaRef}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        )
      }
    </div>
  );
}