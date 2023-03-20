import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslationContext, useUIKit } from "../../context";
import { useContactList } from "../../hooks/useContactList";
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
import { Contact, UnknownType } from '../../types';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { LoadingIndicator } from '../Loading';


export type UIContactListProps = {
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

  Preview?: React.ComponentType<UIContactPreviewComponentProps>;

  /** 自定义列表头部 */
  head?: React.ReactElement;
  activeContact?: Contact;
  setActiveContact?: (contact: Contact) => void;
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
    head,
    defaultItemHeight,
    hasMore,
    loadMore,
    loading,
    contacts,
    activeContact,
    setActiveContact,
    scrollSeekPlaceHolder,
  } = props;

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

  const virtuosoComponents: Partial<Components> = useMemo(() => {
    const EmptyPlaceholder: Components['EmptyPlaceholder'] = () => (
      <>
        {EmptyStateIndicator && (
          <EmptyStateIndicator listType={'contact'} />
        )}
      </>
    );

    const Header: Components['Header'] = () => head ?? null;

    const Footer: Components['Footer'] = () =>
      loading ? (
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
  }, [loading, head]);

  const contactRenderer = useCallback((contact: Contact, index: number) => {
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
        components={virtuosoComponents}
        computeItemKey={(index) => {
          console.log('computeItemKey index: ', index);
          return processedContacts[index].id;
        }}
        endReached={endReached}
        itemContent={(i: number, data: Contact) => contactRenderer(data, i)}
        itemSize={fractionalItemSize}
        ref={virtuoso}
        style={{ overflowX: 'hidden' }}
        totalCount={processedContacts.length}
        {...(scrollSeekPlaceHolder ? { scrollSeek: scrollSeekPlaceHolder } : {})}
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

export const UIContactList: React.FC<UIContactListProps> = (props) => {
  const { activeProfile } = useUIKit('UIContactList');
  const { contacts, loading, hasMore, loadMore } = useContactList(activeProfile?.id);

  return (
    <UIContactListWithContext 
      hasMore={hasMore}
      loadMore={loadMore}
      loading={loading}
      contacts={contacts}
      {...props}
    />
  );
}; 