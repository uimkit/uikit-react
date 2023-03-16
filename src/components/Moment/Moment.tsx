import React from 'react';
import { MomentProps } from './types';
import { MomentContextValue, MomentProvider } from './hooks/MomentContext';
import { MomentDefault } from './MomentDefault';



export const Moment: React.FC<MomentProps> = (props) => {
  const {
    Moment: propMoment,
    ...rest
  } = props;

  const MomentUIComponent = propMoment || MomentDefault;

  
  const momentContextValue: MomentContextValue = {
    ...rest,
  };
  
  
  return (
    <MomentProvider value={momentContextValue}>
      <MomentUIComponent />
    </MomentProvider>
  );
}