import React from 'react';

import { useTranslationContext } from '../../context/TranslationContext';
import { getDateString } from '../../i18n/utils';

export type DateSeparatorProps = {
  /** The date to format */
  date?: Date;
  /** Override the default formatting of the date. This is a function that has access to the original date object. */
  formatDate?: (date: Date) => string;
  /** If following messages are not new */
  unread?: boolean;
};

const UnMemoizedDateSeparator = (props: DateSeparatorProps) => {
  const { date: messageCreatedAt, formatDate } = props;

  const { tDateTimeParser } = useTranslationContext('DateSeparator');
  const formattedDate = getDateString({
    calendar: true,
    formatDate,
    messageCreatedAt,
    tDateTimeParser,
  });

  return (
    <div className='uim__date-separator message-list-time'>
      {formattedDate}
    </div>
  );
};

/**
 * A simple date separator between messages.
 */
export const DateSeparator = React.memo(UnMemoizedDateSeparator) as typeof UnMemoizedDateSeparator;