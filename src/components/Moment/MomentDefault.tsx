import React from 'react';
import { MomentUIComponentProps } from "./types";
import { useMomentContext } from './hooks/MomentContext';


const MomentDefaultWithContext: React.FC<MomentUIComponentProps> = (
  props,
) => {
  const {} = props;

  return (
    <>
      moment
    </>
  );
}

const MemoizedMomentDefault = React.memo(
  MomentDefaultWithContext,
);

export const MomentDefault: React.FC<MomentUIComponentProps> = (props) => {
  const momentContext = useMomentContext('MomentDefault');

  return <MemoizedMomentDefault {...momentContext} {...props} />;
};