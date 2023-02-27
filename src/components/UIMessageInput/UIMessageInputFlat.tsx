import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { usePopper } from 'react-popper';
import { useDropzone } from 'react-dropzone';

import { UIChatAutoComplete } from '../UIChatAutoComplete';
// import { Tooltip } from '../Tooltip/Tooltip';

import { useTranslationContext } from '../../context/TranslationContext';
import { useMessageInputContext } from '../../context/MessageInputContext';
import { useComponentContext } from '../../context/ComponentContext';
import { DefaultStreamChatGenerics } from '../../types';

export const UIMessageInputFlat = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>() => {
  const { t } = useTranslationContext('MessageInputV2');

  const {
    handleSubmit,
    text,
  } = useMessageInputContext('UIMessageInputFlat');


  return (
    <>
      <UIChatAutoComplete />
    </>
  );
};