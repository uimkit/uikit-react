import { Moment } from '../../types';
import { UIMomentContextProps } from './UIMomentContext';
import { MomentContextValue } from './hooks/MomentContext';



export type UIMomentProps = {
  moment: Moment;
  
  Moment?: React.ComponentType<MomentUIComponentProps>;
  MomentContext?: React.ComponentType<UIMomentContextProps>;
};

export type MomentUIComponentProps = Partial<MomentContextValue>;