import {
  isDate,
  isDayOrMoment,
  isNumberOrString,
  UIMessageContextValue,
  TDateTimeParser,
} from '../context';

import Dayjs from 'dayjs';

interface DateFormatterOptions {
  calendar?: boolean;
  format?: string;
  formatDate?: UIMessageContextValue['formatDate'];
  messageCreatedAt?: string | Date | number;
  tDateTimeParser?: TDateTimeParser;
}

export const notValidDateWarning =
  'MessageTimestamp was called without a message, or message has invalid created_at date.';
export const noParsingFunctionWarning =
  'MessageTimestamp was called but there is no datetime parsing function available';

export function getDateString({
  calendar,
  format,
  formatDate = (date: Date) => Dayjs(date).fromNow(),
  messageCreatedAt,
  tDateTimeParser,
}: DateFormatterOptions): string | null {
  if (
    !messageCreatedAt ||
    (typeof messageCreatedAt === 'string' && !Date.parse(messageCreatedAt))
  ) {
    console.warn(notValidDateWarning);
    return null;
  }

  if (typeof formatDate === 'function') {
    return formatDate(new Date(messageCreatedAt));
  }

  if (!tDateTimeParser) {
    console.warn(noParsingFunctionWarning);
    return null;
  }

  const parsedTime = tDateTimeParser(messageCreatedAt);

  if (isDayOrMoment(parsedTime)) {
    /**
     * parsedTime.calendar is guaranteed on the type but is only
     * available when a user calls dayjs.extend(calendar)
     */
    return calendar && parsedTime.calendar ? parsedTime.calendar() : parsedTime.format(format);
  }

  if (isDate(parsedTime)) {
    return parsedTime.toDateString();
  }

  if (isNumberOrString(parsedTime)) {
    return parsedTime.toString();
  }

  return null;
}