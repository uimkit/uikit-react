import React from 'react';
import { UIMomentProps } from './types';
import { MomentContextValue, MomentProvider } from './hooks/MomentContext';
import { UIMomentDefault } from './UIMomentDefault';



export const UIMoment: React.FC<UIMomentProps> = (props) => {
  const {
    Moment: propMoment,
    ...rest
  } = props;

  const MomentUIComponent = propMoment || UIMomentDefault;

  
  const momentContextValue: MomentContextValue = {
    ...rest,
  };
  
  
  return (
    <MomentProvider value={momentContextValue}>
      <MomentUIComponent />
    </MomentProvider>
  );
}