import { Moment } from '../../types';
import { MomentContextValue } from "./hooks/MomentContext";

// 感觉用不上，因为还有评论列表
const areMomentsEqual = (
  prevMoment: Moment,
  nextMoment: Moment,
) =>
  prevMoment.id === prevMoment.id

export const areMomentUIPropsEqual = (
  prevProps: MomentContextValue & {
    showDetailedReactions?: boolean;
  },
  nextProps: MomentContextValue & {
    showDetailedReactions?: boolean;
  },
) => {
  const { moment: prevMoment } = prevProps;
  const { moment: nextMoment } = nextProps;

  return areMomentsEqual(prevMoment, nextMoment);
};