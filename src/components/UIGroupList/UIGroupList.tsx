import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslationContext, useUIKit } from "../../context";
import { useGroupList } from "./hooks/useGroupList";
import {
  Components,
  ScrollSeekConfiguration,
  ScrollSeekPlaceholderProps,
  Virtuoso,
  VirtuosoHandle,
  VirtuosoProps,
} from 'react-virtuoso';

// import './styles/index.scss';
import { Group, Profile } from '../../types';
import { UIGroupPreview, UIGroupPreviewComponentProps } from '../UIGroupPreview';

export type UIGroupListProps = {
  Preview?: React.ComponentType<UIGroupPreviewComponentProps>;
  defaultItemHeight?: number;
  activeProfile?: Profile;
  activeGroup?: Group;
  setActiveGroup?: (group?: Group) => void;
}

export type UIGroupListWithContextProps = UIGroupListProps & {
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  groups: Group[];
};

const UIGroupListWithContext: React.FC<UIGroupListWithContextProps> = (props) => {
  const {
    Preview,
    defaultItemHeight,
    hasMore,
    loadMore,
    groups,
    activeGroup,
    setActiveGroup,
  } = props;

  const { t } = useTranslationContext();

  const processedGroups = useMemo(() => {
    if (typeof groups === 'undefined') {
      return [];
    }

    return groups;
  }, [groups]);


  const virtuoso = useRef<VirtuosoHandle>(null);

  const endReached = () => {
    if (hasMore && loadMore) {
      loadMore();
    }
  };

  const groupRenderer = useCallback((group: Group) => {
    return (
      <UIGroupPreview 
        key={group.id} 
        group={group}
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        Preview={Preview}
      />
    );
  }, [activeGroup, setActiveGroup, Preview]);

  function fractionalItemSize(element: HTMLElement) {
    return element.getBoundingClientRect().height;
  }



  return (
    <div className="uim-group-list">
      <Virtuoso
        data={processedGroups}
        atBottomThreshold={200}
        className="uim-group-list-scroll"
        computeItemKey={(index) => processedGroups[index].id}
        endReached={endReached}
        itemContent={(i, data) => groupRenderer(data)}
        itemSize={fractionalItemSize}
        ref={virtuoso}
        style={{ overflowX: 'hidden' }}
        totalCount={processedGroups.length}
        {...(defaultItemHeight ? { defaultItemHeight } : {})}
      />
    </div>
  );
}

export const UIGroupList: React.FC<UIGroupListProps> = (props) => {
  const {
    activeProfile: propActiveProfile,
    activeGroup: propActiveGroup,
    setActiveGroup: propSetActiveGroup,
  } = props;

  const { activeProfile: contextActiveProfile } = useUIKit('UIGroupList');

  const activeProfile = propActiveProfile ?? contextActiveProfile;

  const [_activeGroup, _setActiveGroup] = useState<Group | undefined>(undefined);

  const activeGroup = propActiveGroup ?? _activeGroup;

  const { groups, loading, hasMore, loadMore } = useGroupList(activeProfile?.id);

  const setActiveGroup = useCallback((group?: Group) => {
    if (propSetActiveGroup) {
      propSetActiveGroup(group);
    } else {
      _setActiveGroup(group);
    }
  }, [propSetActiveGroup]);

  return (
    <UIGroupListWithContext 
      hasMore={hasMore}
      loadMore={loadMore}
      loading={loading}
      groups={groups}
      activeGroup={activeGroup}
      setActiveGroup={setActiveGroup}
    />
  );
}; 