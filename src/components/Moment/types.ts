import { ComponentContextValue } from '../../context';
import { Moment } from '../../types';
import { MomentContextValue } from './hooks/MomentContext';



export type MomentProps = {
  moment: Moment;
  
  Moment?: ComponentContextValue['Moment'];
};

export type MomentUIComponentProps = Partial<MomentContextValue>;