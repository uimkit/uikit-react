import React from 'react';
import './styles/index.scss';

interface ModalProps {
  className?: string,
  onClick?: (e?) => void,
}

export function Modal<
T extends ModalProps
>(props: React.PropsWithChildren<T>): React.ReactElement {
  const {
    className,
    onClick,
    children,
  } = props;

  return (
    <div role="button" tabIndex={0} className={`modal ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
