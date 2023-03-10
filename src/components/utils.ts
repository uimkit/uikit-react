import { defaultGroupAvatarWork, defaultUserAvatar } from './Avatar';
import { ConversationType } from '../types';



// Determine if it is a JSON string
export function isJSON(str: string) {
  // eslint-disable-next-line no-useless-escape
  if (
    /^[\],:{}\s]*$/.test(
      str
      // eslint-disable-next-line no-useless-escape
        .replace(/\\["\\\/bfnrtu]/g, '@')
      // eslint-disable-next-line no-useless-escape
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
    )
  ) {
    return true;
  }
  return false;
}

// Determine if it is a JSON string
export function JSONStringToParse(str: string) {
  if (!isJSON(str)) {
    return str;
  }
  return JSON.parse(str);
}

export const handleDisplayAvatar = (avatar: string, type: string = ConversationType.Private) => {
  let displayImage = avatar;
  if (!avatar) {
    switch (type) {
      case ConversationType.Private:
        displayImage = defaultUserAvatar;
        break;
      case ConversationType.Group:
        displayImage = defaultGroupAvatarWork;
        break;
      default:
        displayImage = defaultGroupAvatarWork;
    }
  }
  return displayImage;
};