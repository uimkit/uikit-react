import React from 'react';
import { useTranslationContext, useUIKit } from "../../context";
import { useContactList } from "../../hooks/useContactList";
import { EmptyStateIndicator } from "../EmptyStateIndicator";
import { InfiniteScroll } from "../InfiniteScrollPaginator";
import { UIContactPreview, UIContactPreviewComponentProps } from "../UIContactPreview";

import './styles/index.scss';


export interface UIContactListProps {
  Preview?: React.ComponentType<UIContactPreviewComponentProps>,
}

export function UIContactList<T extends UIContactListProps>(props: T) {
  const {
    Preview,
  } = props;
  const { t } = useTranslationContext();

  const { activeProfile, activeContact, setActiveContact } = useUIKit();

  const { contacts, loading, hasMore, loadMore } = useContactList(activeProfile?.id);

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
              contacts.map(contact => (
                <UIContactPreview 
                  key={contact.id} 
                  contact={contact}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                  Preview={Preview}
                />
              ))
            ) : <EmptyStateIndicator listType="contact" />
          }
        </ul>
      </InfiniteScroll>
      {loading && <p className="loading">{t('loading...')}</p>}
      {!hasMore && <p className="no-more">{t('No more')}</p>}
    </div>
  );
}