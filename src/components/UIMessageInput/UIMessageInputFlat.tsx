import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { usePopper } from 'react-popper';
import { useDropzone } from 'react-dropzone';

import { UIChatAutoComplete } from '../UIChatAutoComplete';

import { useTranslationContext } from '../../context/TranslationContext';
import { useMessageInputContext } from '../../context/MessageInputContext';

export const UIMessageInputFlat = () => {
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