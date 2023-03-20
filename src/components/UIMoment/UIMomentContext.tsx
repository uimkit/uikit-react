import React from 'react';
import { Moment, MomentType } from '../../types';
import { MomentVideo } from './MomentVideo';
import { useMomentContext } from './hooks/MomentContext';


export type UIMomentContextProps = {
  moment: Moment;
};



const components = {
  // [MomentType.Text]: MomentText,
  // [MessageType.Image]: MessageImage,
  // [MessageType.Audio]: MessageAudio,
  [MomentType.Video]: MomentVideo,
};

export const UIMomentContext: React.FC<UIMomentContextProps> = (props) => {
  const {
    moment,
  } = props;
  
  const {
    VideoElement,
  } = useMomentContext('UIMomentContext');
  
  const CustemComponents = {
    [MomentType.Video]: VideoElement,
  };
  
  const Component = CustemComponents[moment?.type] ?? components[moment?.type];
  return Component && (
    <Component moment={moment} />
  );
};