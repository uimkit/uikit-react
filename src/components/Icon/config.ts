import IconMoreUrl from './images/more.png';
import IconCreateUrl from './images/create.png';
import IconClearUrl from './images/clear.png';
import IconSearchUrl from './images/search.png';
import IconBackUrl from './images/back.png';
import IconEmojiUrl from './images/emoji.png';
import IconProgressUrl from './images/progress.png';
import IconFileUrl from './images/file.png';
import IconAddUrl from './images/add.png';
import IconImageUrl from './images/image.png';
import IconVideoUrl from './images/video.png';
import IconDocumentUrl from './images/document.png';
import IconStarUrl from './images/star.png';
import IconCopyUrl from './images/copy.png';
import IconDelUrl from './images/del.png';
import IconForwardUrl from './images/forward.png';
import IconReplyUrl from './images/reply.png';
import IconCloseUrl from './images/close.png';
import IconArrowRightUrl from './images/arrow-right.png';
import IconRightUrl from './images/right.png';
import IconEllipseUrl from './images/ellipse.png';
import IconCancelUrl from './images/cancel.png';
import IconArrowDownUrl from './images/arrow-down.png';
import IconEditUrl from './images/edit.png';
import IconConfirmUrl from './images/confirm.png';
import IconCameraUrl from './images/camera.png';
import IconQuoteUrl from './images/quote.png';
import IconRevocationUrl from './images/revocation.png';
import IconEffortUrl from './images/effort.png';
import IconCryUrl from './images/cry.png';
import IconSendUrl from './images/send.png';
import IconOwnerUrl from './images/owner.png';
import IconLivingUrl from './images/living.png';
import IconMemberUrl from './images/member.png';
import IconLikerUrl from './images/like.png';
import IconUnlikeUrl from './images/unlike.png';
import IconLikedUrl from './images/liked.png';
import IconUnlikedUrl from './images/unliked.png';
import IconUnionUrl from './images/union.png';
import IconUnunionUrl from './images/ununion.png';
import IconVectorUrl from './images/vector.png';
import IconUnvectorUrl from './images/unvector.png';
import IconVoiceUrl from './images/voice.png';

import { IconTypes } from './type';

interface IconConfigItem {
  url: string,
  className: string,
}

interface IconConfig {
  [propName: string]: IconConfigItem
}

export const ICON_CONFIG: IconConfig = {
  [IconTypes.MORE]: {
    url: IconMoreUrl,
    className: 'uim-kit-icon-more',
  },
  [IconTypes.CREATE]: {
    url: IconCreateUrl,
    className: 'uim-kit-icon-create',
  },
  [IconTypes.CLEAR]: {
    url: IconClearUrl,
    className: 'uim-kit-icon-clear',
  },
  [IconTypes.SEARCH]: {
    url: IconSearchUrl,
    className: 'uim-kit-icon-search',
  },
  [IconTypes.BACK]: {
    url: IconBackUrl,
    className: 'uim-kit-icon-back',
  },
  [IconTypes.EMOJI]: {
    url: IconEmojiUrl,
    className: 'uim-kit-icon-emoji',
  },
  [IconTypes.PROGRESS]: {
    url: IconProgressUrl,
    className: 'uim-kit-icon-progress',
  },
  [IconTypes.FILE]: {
    url: IconFileUrl,
    className: 'uim-kit-icon-file',
  },
  [IconTypes.ADD]: {
    url: IconAddUrl,
    className: 'uim-kit-icon-add',
  },
  [IconTypes.IMAGE]: {
    url: IconImageUrl,
    className: 'uim-kit-icon-image',
  },
  [IconTypes.VIDEO]: {
    url: IconVideoUrl,
    className: 'uim-kit-icon-video',
  },
  [IconTypes.DOCUMENT]: {
    url: IconDocumentUrl,
    className: 'uim-kit-icon-document',
  },
  [IconTypes.STAR]: {
    url: IconStarUrl,
    className: 'uim-kit-icon-star',
  },
  [IconTypes.COPY]: {
    url: IconCopyUrl,
    className: 'uim-kit-icon-copy',
  },
  [IconTypes.DEL]: {
    url: IconDelUrl,
    className: 'uim-kit-icon-del',
  },
  [IconTypes.FORWARD]: {
    url: IconForwardUrl,
    className: 'uim-kit-icon-forward',
  },
  [IconTypes.REPLY]: {
    url: IconReplyUrl,
    className: 'uim-kit-icon-reply',
  },
  [IconTypes.CLOSE]: {
    url: IconCloseUrl,
    className: 'uim-kit-icon-close',
  },
  [IconTypes.ARROW_RIGHT]: {
    url: IconArrowRightUrl,
    className: 'uim-kit-icon-arrow-right',
  },
  [IconTypes.RIGHT]: {
    url: IconRightUrl,
    className: 'uim-kit-icon-right',
  },
  [IconTypes.ELLIPSE]: {
    url: IconEllipseUrl,
    className: 'uim-kit-icon-ellipse',
  },
  [IconTypes.CANCEL]: {
    url: IconCancelUrl,
    className: 'uim-kit-icon-cancel',
  },
  [IconTypes.ARROW_DOWN]: {
    url: IconArrowDownUrl,
    className: 'uim-kit-icon-arrow-down',
  },
  [IconTypes.EDIT]: {
    url: IconEditUrl,
    className: 'uim-kit-icon-edit',
  },
  [IconTypes.CONFIRM]: {
    url: IconConfirmUrl,
    className: 'uim-kit-icon-confirm',
  },
  [IconTypes.CAMERA]: {
    url: IconCameraUrl,
    className: 'uim-kit-icon-camera',
  },
  [IconTypes.QUOTE]: {
    url: IconQuoteUrl,
    className: 'uim-kit-icon-quote',
  },
  [IconTypes.REVOCATION]: {
    url: IconRevocationUrl,
    className: 'uim-kit-icon-revocation',
  },
  [IconTypes.EFFORT]: {
    url: IconEffortUrl,
    className: 'uim-kit-icon-effort',
  },
  [IconTypes.CRY]: {
    url: IconCryUrl,
    className: 'uim-kit-icon-cry',
  },
  [IconTypes.OWNER]: {
    url: IconOwnerUrl,
    className: 'uim-kit-icon-owner',
  },
  [IconTypes.SEND]: {
    url: IconSendUrl,
    className: 'uim-kit-icon-send',
  },
  [IconTypes.LIVING]: {
    url: IconLivingUrl,
    className: 'uim-kit-icon-living',
  },
  [IconTypes.MEMBER]: {
    url: IconMemberUrl,
    className: 'uim-kit-icon-member',
  },
  [IconTypes.LIKE]: {
    url: IconLikerUrl,
    className: 'uim-kit-icon-like',
  },
  [IconTypes.UNLIKE]: {
    url: IconUnlikeUrl,
    className: 'uim-kit-icon-unlike',
  },
  [IconTypes.LIKED]: {
    url: IconLikedUrl,
    className: 'uim-kit-icon-liked',
  },
  [IconTypes.UNLIKED]: {
    url: IconUnlikedUrl,
    className: 'uim-kit-icon-unliked',
  },
  [IconTypes.UNION]: {
    url: IconUnionUrl,
    className: 'uim-kit-icon-union',
  },
  [IconTypes.UNUNION]: {
    url: IconUnunionUrl,
    className: 'uim-kit-icon-ununion',
  },
  [IconTypes.VECTOR]: {
    url: IconVectorUrl,
    className: 'uim-kit-icon-vector',
  },
  [IconTypes.UNVECTOR]: {
    url: IconUnvectorUrl,
    className: 'uim-kit-icon-unvector',
  },
  [IconTypes.VOICE]: {
    url: IconVoiceUrl,
    className: 'uim-kit-icon-voice',
  },
};
