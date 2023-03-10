import React, { PropsWithChildren } from 'react';

export type CustomNotificationProps = {
  type: string;
  active?: boolean;
};

const UnMemoizedCustomNotification = (props: PropsWithChildren<CustomNotificationProps>) => {
  const { active, children, type } = props;

  if (!active) return null;

  return (
    <div
      aria-live='polite'
      className={`uim__custom-notification notification-${type} uim__notification`}
      data-testid='custom-notification'
    >
      {children}
    </div>
  );
};

export const CustomNotification = React.memo(
  UnMemoizedCustomNotification,
) as typeof UnMemoizedCustomNotification;