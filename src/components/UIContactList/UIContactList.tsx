import React, { VoidFunctionComponent, useCallback, useMemo, useRef } from 'react';
import { useTranslationContext, useUIKit } from "../../context";
import { useContactList } from "../../hooks/useContactList";
import { EmptyStateIndicator } from "../EmptyStateIndicator";
import { InfiniteScroll } from "../InfiniteScrollPaginator";
import { UIContactPreview, UIContactPreviewComponentProps } from "../UIContactPreview";
import {
  Components,
  ScrollSeekConfiguration,
  ScrollSeekPlaceholderProps,
  Virtuoso,
  VirtuosoHandle,
  VirtuosoProps,
} from 'react-virtuoso';

import './styles/index.scss';
import { Contact } from '../../types';


export type UIContactListProps = {
  Preview?: React.ComponentType<UIContactPreviewComponentProps>;
  defaultItemHeight?: number;
}

export type UIContactListWithContextProps = UIContactListProps & {
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
  contacts: Contact[];
};

const UIContactListWithContext: React.FC<UIContactListWithContextProps> = (props) => {
  const {
    Preview,
    defaultItemHeight,
    hasMore,
    loadMore,
    contacts,
  } = props;

  const { activeContact, setActiveContact } = useUIKit('UIContactListWithContext');

  const { t } = useTranslationContext();

  const processedContacts = useMemo(() => {
    if (typeof contacts === 'undefined') {
      return [];
    }

    return contacts;
  }, [contacts]);


  const virtuoso = useRef<VirtuosoHandle>(null);

  const endReached = () => {
    if (hasMore && loadMore) {
      loadMore();
    }
  };

  const contactRenderer = useCallback((contact: Contact) => {
    return (
      <UIContactPreview 
        key={contact.id} 
        contact={contact}
        activeContact={activeContact}
        setActiveContact={setActiveContact}
        Preview={Preview}
      />
    );
  }, [activeContact, setActiveContact, Preview]);

  function fractionalItemSize(element: HTMLElement) {
    return element.getBoundingClientRect().height;
  }



  return (
    <div className="uim-contact-list">
      <Virtuoso
        data={processedContacts}
        atBottomThreshold={200}
        className="uim-contact-list-scroll"
        computeItemKey={(index) => processedContacts[index].id}
        endReached={endReached}
        itemContent={(i, data) => contactRenderer(data)}
        itemSize={fractionalItemSize}
        ref={virtuoso}
        style={{ overflowX: 'hidden' }}
        totalCount={processedContacts.length}
        {...(defaultItemHeight ? { defaultItemHeight } : {})}
      />
    </div>
  );

  /*
  return (
    <div className="uim-contact-list">
      <InfiniteScroll
        className="contact-list-infinite-scroll"
        hasMoreNewer={hasMore}
        loadMoreNewer={loadMore}
        threshold={150}
      >
        <ul>
          {
            contacts?.length > 0 ? (
              <>{contacts.map(contact => contactRenderer(contact))}</>
            ) : <EmptyStateIndicator listType="contact" />
          }
        </ul>
      </InfiniteScroll>
      {loading && <p className="loading">{t('loading...')}</p>}
      {!hasMore && <p className="no-more">{t('No more')}</p>}
    </div>
  );*/
}

export const UIContactList: React.FC<UIContactListProps> = () => {
  const { activeProfile } = useUIKit('UIContactList');
  const { contacts, loading, hasMore, loadMore } = useContactList(activeProfile?.id);

  return (
    <UIContactListWithContext 
      hasMore={hasMore}
      loadMore={loadMore}
      loading={loading}
      contacts={contacts}
    />
  );
}; 