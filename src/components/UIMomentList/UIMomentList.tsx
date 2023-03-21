import React, { useCallback, useMemo, useRef } from 'react';
import {
  Components,
  ScrollSeekConfiguration,
  ScrollSeekPlaceholderProps,
  Virtuoso,
  VirtuosoHandle,
  VirtuosoProps,
} from 'react-virtuoso';
import { useMomentList } from './hooks/useMomentList';
import { Moment, Profile, UnknownType } from '../../types';
import './styles/index.scss';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { LoadingIndicator } from '../Loading';
import { UIMoment, UIMomentProps } from '../UIMoment';

export type UIMomentListProps = {
  Moment?: React.ComponentType<UIMomentProps>,
  /** 传递给 react-virtuoso 的属性 [`react-virtuoso` virtualized list dependency](https://virtuoso.dev/virtuoso-api-reference/) */
  additionalVirtuosoProps?: VirtuosoProps<UnknownType, unknown>;
  defaultItemHeight?: number;
  /**
   * 用户快速滚动列表时显示占位符来提高性能:
   * ```
   *  {
   *    enter: (velocity) => Math.abs(velocity) > 120,
   *    exit: (velocity) => Math.abs(velocity) < 40,
   *    change: () => null,
   *    placeholder: ({index, height})=> <div style={{height: height + "px"}}>{index}</div>,
   *  }
   *  ```
   */
   scrollSeekPlaceHolder?: ScrollSeekConfiguration & {
    placeholder: React.ComponentType<ScrollSeekPlaceholderProps>;
  };
  profile?: Profile;
};

export type UIMomentListWithContextProps = UIMomentListProps & {
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  moments?: Moment[];
  /** 自定义列表头部 */
  head?: React.ReactElement;
};

const UIMomentListWithContext: React.FC<UIMomentListWithContextProps> = (props) => {
  const {
    Moment: propMoment, 
    additionalVirtuosoProps,
    defaultItemHeight,
    scrollSeekPlaceHolder,
    moments,
    loadingMore,
    hasMore,
    loadMore,
    head,
  } = props;

  const MomentUIComponent = propMoment || UIMoment;


  const processedMoments = useMemo(() => {
    if (typeof moments === 'undefined') {
      return [];
    }

    return moments;
  }, [moments]);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const endReached = () => {
    if (hasMore && loadMore) {
      loadMore();
    }
  };

  const virtuosoComponents: Partial<Components> = useMemo(() => {
    const EmptyPlaceholder: Components['EmptyPlaceholder'] = () => (
      <>
        {EmptyStateIndicator && (
          <EmptyStateIndicator listType={'moment'} />
        )}
      </>
    );

    const Header: Components['Header'] = () => head ?? null;

    const Footer: Components['Footer'] = () =>
      loadingMore ? (
        <div className='str-chat__virtual-list__loading'>
          <LoadingIndicator size={20} />
        </div>
      ) : (
        null
      );

    return {
      EmptyPlaceholder,
      Footer,
      Header,
    };
  }, [loadingMore, head]);

  const momentRenderer = useCallback((moment: Moment, index: number) => {
    return (
      <MomentUIComponent moment={moment} />
    );
  }, []);

  function fractionalItemSize(element: HTMLElement) {
    return element.getBoundingClientRect().height;
  }

  return (
    <div className="uim-moment-list">
      <Virtuoso
        data={processedMoments}
        atBottomThreshold={200}
        className="uim-moment-list-scroll"
        components={virtuosoComponents}
        computeItemKey={(index) => {
          return processedMoments[index].id;
        }}
        endReached={endReached}
        itemContent={(i: number, data: Moment) => momentRenderer(data, i)}
        itemSize={fractionalItemSize}
        ref={virtuoso}
        style={{ overflowX: 'hidden' }}
        totalCount={processedMoments.length}
        {...(scrollSeekPlaceHolder ? { scrollSeek: scrollSeekPlaceHolder } : {})}
        {...(defaultItemHeight ? { defaultItemHeight } : {})}
      />
    </div>
  );
};

export const UIMomentList: React.FC<UIMomentListProps> = (props) => {
  const { profile } = props;
  const { loading, loadMore, hasMore, moments } = useMomentList(profile?.id);

  return (
    <UIMomentListWithContext
      hasMore={hasMore}
      loadMore={loadMore}
      loadingMore={loading}
      moments={moments}
      {...props}
    />
  );
};