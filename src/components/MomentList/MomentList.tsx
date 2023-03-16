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
import './styles/index.scss';
import { useUIKit } from '../../context';

export type MomentListProps = {
  userId?: string;
};

export type MomentListWithContextProps = MomentListProps & {
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  moments?: Moment[];
};

const MomentListWithContext: React.FC<MomentListWithContextProps> = (props) => {
  const { moments } = props;

  console.log('moments: ', moments);

  const virtuoso = useRef<VirtuosoHandle>(null);



  return (
    <div className="uim-moment-list">
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