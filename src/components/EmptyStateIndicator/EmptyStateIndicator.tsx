import React, { PropsWithChildren } from 'react';
import { useTranslationContext } from '../../context';

export interface EmptyStateIndicatorProps{
  /** List Type: conversation | message */
  listType?: 'conversation' | 'contact' | 'message' | 'chat' | 'moment';
}

function UnMemoizedEmptyStateIndicator
<T extends EmptyStateIndicatorProps>(props: PropsWithChildren<T>) {
  const { listType } = props;

  const { t } = useTranslationContext('EmptyStateIndicator');

  if (listType === 'conversation') { return <p role="listitem">{t('You have no conversations currently')}</p>; }

  if (listType === 'contact') { return <p role="listitem">{t('You have no contacts currently')}</p>; }

  if (listType === 'message') return null;

  if (listType === 'chat') return null;

  return <p>No items exist</p>;
}

export const EmptyStateIndicator = React.memo(
  UnMemoizedEmptyStateIndicator,
) as typeof UnMemoizedEmptyStateIndicator;