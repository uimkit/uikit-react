import React, { PropsWithChildren } from 'react';

export interface EmptyStateIndicatorProps{
  /** List Type: conversation | message */
  listType?: 'conversation' | 'message' | 'chat';
}

function UnMemoizedEmptyStateIndicator
<T extends EmptyStateIndicatorProps>(props: PropsWithChildren<T>) {
  const { listType } = props;

  if (listType === 'conversation') { return <p role="listitem">暂时还没有会话</p>; }

  if (listType === 'message') return null;

  if (listType === 'chat') return null;

  return <p>No items exist</p>;
}

export const EmptyStateIndicator = React.memo(
  UnMemoizedEmptyStateIndicator,
) as typeof UnMemoizedEmptyStateIndicator;