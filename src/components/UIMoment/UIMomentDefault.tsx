import React from 'react';
import { MomentUIComponentProps, UIMomentProps } from "./types";
import { useMomentContext } from './hooks/MomentContext';
import { UIMomentContext } from './UIMomentContext';

const UIMomentDefaultWithContext: React.FC<UIMomentProps> = (
  props,
) => {
  const {
    MomentContext: propMomentContext,
    moment,
  } = props;


  const MomentContextUIComponent = propMomentContext ?? UIMomentContext;

  return (
    <>
      通用布局
      <MomentContextUIComponent moment={moment} />
    </>
  );
}

const MemoizedUIMomentDefault = React.memo(
  UIMomentDefaultWithContext,
);

export const UIMomentDefault: React.FC<MomentUIComponentProps> = (props) => {
  const momentContext = useMomentContext('UIMomentDefault');

  return <MemoizedUIMomentDefault {...momentContext} {...props} />;
};