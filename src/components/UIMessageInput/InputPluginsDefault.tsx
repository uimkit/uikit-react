import React, { useRef } from 'react';
import { EmojiPicker } from './EmojiPicker';
import { Plugins } from '../Plugins';
import { useUploadElement } from './hooks/useUploadElement';
import { useMessageInputContext, useTranslationContext } from '../../context';
import { Icon, IconTypes } from '../Icon';
import { MessageType } from '../../types';
import { useChatStateContext } from '../../context';

export function InputPluginsDefault():React.ReactElement {
  const {
    sendUploadMessage,
    pluginConfig: propsPluginConfig,
  } = useMessageInputContext('UIMessageInputDefault');

  const { UIMessageInputConfig } = useChatStateContext();

  const propPlugins = propsPluginConfig?.plugins
  || UIMessageInputConfig?.pluginConfig?.plugins || [];
  const showNumber = propsPluginConfig?.showNumber
  || UIMessageInputConfig?.pluginConfig?.showNumber || 10;
  const MoreIcon = propsPluginConfig?.MoreIcon || UIMessageInputConfig?.pluginConfig?.MoreIcon;

  const handlePluginBoolenParams = (
    porpsVal?:boolean | undefined,
    contextVal?:boolean | undefined,
    defaultVal?: boolean,
  ) => {
    if (typeof (porpsVal) === 'boolean') {
      return porpsVal;
    }
    if (typeof (contextVal) === 'boolean') {
      return contextVal;
    }
    return defaultVal;
  };

  const isEmojiPicker = handlePluginBoolenParams(
    propsPluginConfig?.isEmojiPicker,
    UIMessageInputConfig?.pluginConfig?.isEmojiPicker,
    true,
  );
  const isImagePicker = handlePluginBoolenParams(
    propsPluginConfig?.isImagePicker,
    UIMessageInputConfig?.pluginConfig?.isImagePicker,
    true,
  );
  const isVideoPicker = handlePluginBoolenParams(
    propsPluginConfig?.isVideoPicker,
    UIMessageInputConfig?.pluginConfig?.isVideoPicker,
    true,
  );
  const isFilePicker = handlePluginBoolenParams(
    propsPluginConfig?.isFilePicker,
    UIMessageInputConfig?.pluginConfig?.isFilePicker,
    true,
  );

  const pluginsRef = useRef(null);

  const { t } = useTranslationContext();

  const ImagePicker = isImagePicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <Icon width={20} height={20} type={IconTypes.IMAGE} />
        {/*<span>{t('message.type.image')}</span>*/}
      </div>
    ),
    type: 'image',
    accept: 'image/*',
    onChange: (file: HTMLInputElement | File) => {
      pluginsRef.current.closeMore();
      sendUploadMessage({ file }, MessageType.Image);
    },
  });

  const VideoPicker = isVideoPicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <Icon width={20} height={20} type={IconTypes.VIDEO} />
        {/*<span>{t('message.type.video')}</span>*/}
      </div>
    ),
    type: 'video',
    accept: 'video/*',
    onChange: (file:HTMLInputElement | File) => {
      pluginsRef.current.closeMore();
      sendUploadMessage({ file }, MessageType.Video);
    },
  });

  const FilePicker = isFilePicker && useUploadElement({
    children: (
      <div className="input-plugin-item">
        <Icon width={20} height={20} type={IconTypes.DOCUMENT} />
        {/*<span>{t('message.type.file')}</span>*/}
      </div>
    ),
    type: 'file',
    accept: 'file/*',
    onChange: (file:HTMLInputElement | File) => {
      pluginsRef.current.closeMore();
      sendUploadMessage({ file }, MessageType.File);
    },
  });
  const plugins = [
    isEmojiPicker && <EmojiPicker />, ImagePicker, VideoPicker, FilePicker, ...propPlugins,
  ].filter((item) => item);

  return <Plugins ref={pluginsRef} plugins={plugins} showNumber={showNumber} MoreIcon={MoreIcon} />;
}