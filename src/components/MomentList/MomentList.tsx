import React, { useRef } from 'react';
import {
  Components,
  ScrollSeekConfiguration,
  ScrollSeekPlaceholderProps,
  Virtuoso,
  VirtuosoHandle,
  VirtuosoProps,
} from 'react-virtuoso';
import { useMomentList } from './hooks/useMomentList';
import { Moment } from '../../types';

export type MomentListProps = {
  userId?: string;
};

export type MomentListWithContextProps = MomentListProps & {
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  moments?: Moment[];
};

const MomentListWithContext: React.FC<MomentListWithContextProps> = () => {
  const virtuoso = useRef<VirtuosoHandle>(null);
console.log('MomentListWithContext');
  return (
    <div>
      listfefefefe
    </div>
  );
};

export const MomentList: React.FC<MomentListProps> = (props) => {
  const { userId } = props;

  const { loading, loadMore, hasMore, moments } = useMomentList(userId);
  
  return (
    <MomentListWithContext
      hasMore={hasMore}
      loadMore={loadMore}
      loading={loading}
      moments={moments}
      {...props}
    />
  );
};